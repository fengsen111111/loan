<template>
  <a-card title="基本信息" bordered class="gradient-card">
    <div class="body">
      <section>
        <a-upload :file-list="avatarList" accept="image/*" :show-file-list="false" list-type="picture-card"
          :show-upload-button="true" :on-before-upload="onBeforeUpload">
          <template #upload-button>
            <a-avatar :size="100">
              <template #trigger-icon><icon-camera /></template>
              <img v-if="avatarList.length" :src="userInfo.avatar" alt="avatar" />
            </a-avatar>
          </template>
        </a-upload>
        <div class="name">
          <span style="margin-right: 10px">{{ userInfo.nickname }}</span>
          <icon-edit :size="16" class="btn" @click="onUpdate" />
        </div>
        <div class="id">
          <GiSvgIcon name="id" :size="16" />
          <span>{{ userInfo.id }}</span>
        </div>
      </section>
      <footer>
        <div class="desc">
          <icon-user name="id" :size="16" />
          <span style="margin-left: 5px; margin-right: 40px">用户名</span>
          <span> {{ userInfo.name }}</span>
        </div>
        <div class="desc">
          <icon-phone name="id" :size="16" style="margin-left: 25px" />
          <span style="margin-left: 5px; margin-right: 30px">手机</span>
          <span> {{ userInfo.mobile }}</span>
        </div>
        <div class="desc">
          <icon-user-group name="id" :size="16" /><span style="margin-left: 5px; margin-right: 50px">角色</span>
          <span>
            {{
              userInfo.is_owner == 'Y'
                ? '拥有者'
                : '管理员'
            }}</span>
        </div>
      </footer>
    </div>
    <div class="footer">注册于 {{ userInfo.create_time }}</div>
  </a-card>

  <a-modal :visible="visible" title="上传头像" :width="400" :footer="false" @cancel="visible = false">
    <a-row>
      <a-col :span="14" style="width: 200px; height: 200px">
        <vue-cropper ref="cropperRef" :img="options.img" :info="true" :auto-crop="options.autoCrop"
          :auto-crop-width="options.autoCropWidth" :auto-crop-height="options.autoCropHeight"
          :fixed-box="options.fixedBox" :fixed="options.fixed" :full="options.full" :center-box="options.centerBox"
          :can-move="options.canMove" :output-type="options.outputType" :output-size="options.outputSize"
          @real-time="handleRealTime" />
      </a-col>
      <a-col :span="10" style="display: flex; justify-content: center">
        <div :style="previewStyle">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" alt="" />
          </div>
        </div>
      </a-col>
    </a-row>
    <div style="text-align: center; padding-top: 30px">
      <a-space>
        <a-button type="primary" @click="handleUpload">确定</a-button>
        <a-button @click="reset">取消</a-button>
      </a-space>
    </div>
  </a-modal>
  <BasicInfoUpdateModal ref="BasicInfoUpdateModalRef" />
</template>

<script setup lang="ts">
import { initOSSClient } from '@/utils/oss.ts'
import { addUser, frontUpload } from '@/apis'
import BasicInfoUpdateModal from './BasicInfoUpdateModal.vue'
import { Message, type FileItem } from '@arco-design/web-vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useUserStore } from '@/stores'
import getAvatar from '@/utils/avatar'
onMounted(() => {
  //初始化OSS client实例
  initOSSClient()
})
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const head_image = ref('')
const avatar = {
  uid: '-2',
  name: 'avatar.png',
  url: userInfo.value.avatar
}
const avatarList = ref<FileItem[]>([avatar])
const fileRef = ref(reactive({ name: 'avatar.png' }))
const options: cropperOptions = reactive({
  img: '',
  autoCrop: true,
  autoCropWidth: 160,
  autoCropHeight: 160,
  fixedBox: true,
  fixed: true,
  full: false,
  centerBox: true,
  canMove: true,
  outputSize: 1,
  outputType: 'png'
})
const visible = ref(false)
// 打开裁剪框
const onBeforeUpload = (file: File): boolean => {
  fileRef.value = file
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    options.img = reader.result
  }
  visible.value = true
  return false
}

// 重置
const reset = () => {
  fileRef.value = { name: '' }
  options.img = ''
  visible.value = false
}

const previews: any = ref({})
const previewStyle: any = ref({})
// 实时预览
const handleRealTime = (data: any) => {
  previewStyle.value = {
    width: `${data.w}px`,
    height: `${data.h}px`,
    overflow: 'hidden',
    margin: '0',
    zoom: 100 / data.h,
    borderRadius: '50%'
  }
  previews.value = data
}

const cropperRef = ref()
// 上传头像
const handleUpload = async () => {
  cropperRef.value.getCropBlob(async (data: any) => {
    const formData = new FormData()
    // console.log('File uploaded:', fileRef.value, cropperRef.value)
    try {
      const result = await window.globalOSSClient.put(fileRef.value.name, data)
      console.log('File uploaded22:', result)
      head_image.value = result.url
      visible.value = false
      bcUpload()
      // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信
    } catch (error) {
      console.error('Failed to upload file:', error)
      // 处理上传失败的逻辑，例如展示错误信息
    }
  })
}
// 保存服务器
const bcUpload = async () => {
  let data1 = {
    url: head_image.value,
    name: fileRef.value.name,
    size: fileRef.value.size,
    file_type: 'file',
    upload_type: 'oss'
  }

  try {
    const res = await frontUpload({
      post_params: data1
    })
    if (res.code == 1) {
      save()
    }
  } catch (error) {
    return false
  }
}

// 保存
const save = async () => {
  try {
    await addUser({
      post_params: {
        id: userInfo.value.id,
        table_type: userInfo.value.role,
        head_image: head_image.value
      }
    })
    Message.success('修改成功')
    visible.value = false
    // 修改成功后，重新获取用户信息
    await userStore.getInfo()
    return true
  } catch (error) {
    return false
  }
}

const BasicInfoUpdateModalRef = ref<InstanceType<typeof BasicInfoUpdateModal>>()
// 修改基本信息
const onUpdate = async () => {
  BasicInfoUpdateModalRef.value?.onUpdate()
}
</script>

<style scoped lang="scss">
:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;

  .arco-icon-camera {
    margin-top: 8px;
    color: rgb(var(--arcoblue-6));
    font-size: 14px;
  }
}

.body {
  display: flex;
  flex-direction: column;
  padding: 28px 10px 20px 10px;

  .btn {
    cursor: pointer;
  }

  &>section {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px 0 50px;

    .name {
      font-size: 20px;
      margin: 20px 0;
    }

    .id {
      span {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        padding: 0 6px;
        color: var(--color-text-3);
      }
    }
  }

  &>footer .footer_item {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 12px;
  }
}

.desc {
  text-align: center;
  margin: 20px auto;
}

.footer {
  margin: 0 -16px;
  padding-top: 16px;
  font-size: 12px;
  text-align: center;
  border-top: 1px solid var(--color-border-2);
}
</style>
