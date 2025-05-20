<template>
  <a-drawer :visible="visible" :title="title" :mask-closable="false" :esc-to-close="false" width="60%" :footer="false"
            @cancel="reset">
    <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
      <a-row class="grid-demo1" :gutter="24"><a-col :span="12">
        <a-form-item label="姓名  " field="name">
          <a-input v-model.trim="form.name" placeholder="请输入姓名  " :max-length="30" /> </a-form-item></a-col>
        <a-col :span="12">
          <a-form-item label="手机号码" field="mobile">
            <a-input v-model.trim="form.mobile" placeholder="请输入手机号码" :max-length="11" /> </a-form-item></a-col>
        <a-col
          :span="12" v-if="form.role != 'c'">
        <a-form-item label="账户" field="account">
          <a-input v-model.trim="form.account" placeholder="请输入账户" :max-length="64" />
        </a-form-item></a-col>
<!--         v-if="!isUpdate && form.role != 'c'">-->
        <a-col
          :span="12">
        <a-form-item label="密码" field="password">
          <a-input-password v-model.trim="form.password" placeholder="请输入密码" :max-length="32" />
        </a-form-item>
        </a-col>


        <a-col :span="12">
          <a-form-item label="部门" field="department_id">
            <a-select v-model="form.department_id" :options="departmentList" placeholder="请选择部门" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="角色" field="role_ids">
            <!--            <a-checkbox v-model.trim="form.role_ids" placeholder="请选择角色权限">-->
            <!--              <a-option v-for="item in roleList" :key="item.id" :value="item.id">{{ item.name }}</a-option>-->
            <!--            </a-checkbox>-->

            <a-checkbox-group v-model:value="form.role_ids" @change="aaa">
              <a-col v-for="(option, index) in roleList" :key="index">
                <a-checkbox :value="option.id">{{ option.name }}</a-checkbox>
              </a-col>
            </a-checkbox-group>



          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="头像" field="head_image">
            <a-upload list-type="picture-card" @before-upload="onChange" :limit="1" :on-before-remove="handleRemove1"
                      :file-list="fileList1" image-preview /> </a-form-item></a-col>
        <a-col :span="12">
          <a-form-item label="证件类型 " field="card_type">
            <a-select v-model="form.card_type" :options="cardTypeList" placeholder="请选择证件类型" />
          </a-form-item></a-col><a-col :span="12">
          <a-form-item label="证件号码" field="card_number">
            <a-input v-model.trim="form.card_number" placeholder="请输入证件号码" /> </a-form-item></a-col><a-col :span="12">
          <a-form-item label="现居城市  ">
            <a-cascader :options="options" :field-names="fieldNames" :format-label="format"
                        v-model.trim="form.city_address" placeholder="请输入现居城市" /> </a-form-item></a-col>
        <a-col :span="12">
          <a-form-item label="详细地址  ">
            <a-input v-model.trim="form.address" placeholder="请输入详细地址" />
        </a-form-item>
        </a-col>



        <a-col
            :span="12">
          <a-form-item label="工作证明">
            <a-upload list-type="picture-card" @before-upload="onChange3" :limit="1" :on-before-remove="handleRemove4"
                      :file-list="fileList4" image-preview /> </a-form-item></a-col><a-col :span="12">
          <a-form-item label="身份证正面">
            <a-upload list-type="picture-card" @before-upload="onChange1" :limit="1" :on-before-remove="handleRemove2"
                      :file-list="fileList2" image-preview /> </a-form-item></a-col><a-col :span="12">
          <a-form-item label="身份证反面">
            <a-upload list-type="picture-card" @before-upload="onChange2" :limit="1" :on-before-remove="handleRemove3"
                      :file-list="fileList3" image-preview /> </a-form-item></a-col><a-col :span="12">
          <a-form-item label="状态" field="status">
            <a-switch v-model="form.status" checked-value="Y" unchecked-value="N" checked-text="启用" unchecked-text="禁用"
                      type="round" /> </a-form-item></a-col>
      </a-row>
    </a-form>

    <div style="position: fixed; bottom: 20px; right: 20px">
      <a-button key="back" @click="reset" style="margin-right: 30px">取消</a-button>
      <a-button key="submit" type="primary" @click="save">确认</a-button>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { listRole, getUser, addUser, updateUser, getAreas, getDictionary, frontUpload } from '@/apis'
import type { Gender, Status } from '@/types/global'
import { Message, type FormInstance, type TreeNodeData } from '@arco-design/web-vue'
import { useForm } from '@/hooks'
import { useWindowSize } from '@vueuse/core'
import { encryptByRsa } from '@/utils/encrypt'
import { onMounted } from 'vue'
import { initOSSClient } from '@/utils/oss.ts'
const fieldNames = { value: 'label', label: 'label' }
function aaa(e) {
  form.role_ids = e
}
onMounted(() => {
  //初始化OSS client实例
  initOSSClient()
  getAreasList()
  Dictionary()
})
const { width } = useWindowSize()
const format = (options) => {
  const labels = options.map((option) => option.label)
  form.city_address = labels.join('-')
  return labels.join('-')
}
const roleList = ref([])
const departmentList = ref([])
const cardTypeList = ref([])
// 过滤部门
const filterDeptOptions = (searchKey: string, nodeData: TreeNodeData) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
  }
  return false
}

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改用户' : '新增用户'))
const formRef = ref<FormInstance>()
const deptList = reactive([
  {
    value: 'b',
    label: '管理员'
  },
  {
    value: 'c',
    label: '业务员'
  },
  {
    value: 'd_a',
    label: '资料审核员'
  },
  {
    value: 'd_b',
    label: '风险审核员'
  },
  {
    value: 'd_c',
    label: '合同审核员'
  }
])
const fileList1 = ref([])
const fileList2 = ref([])
const fileList3 = ref([])
const fileList4 = ref([])
const options = ref([])
const workList = reactive([
  {
    value: 'Y',
    label: '在职'
  },
  {
    value: 'N',
    label: '离职'
  }
])

const rules: FormInstance['rules'] = {
  name: [{ required: true, message: '请输入姓名  ' }],
  mobile: [
    { required: true, message: '请输入电话号码' },
    {
      validator: (value, cb) => {
        // 定义正则表达式，用于验证电话号码
        const phoneRegex = /^[1][3-9][0-9]{9}$/
        if (!phoneRegex.test(value)) {
          cb('请输入有效电话号码')
        } else {
          cb()
        }
      }
    }
  ],
  work_status: [{ required: true, message: '请选择工作状态' }],
  //head_image: [{ required: true, message: '请选择上传头像' }],
}
//获取行政区
const getAreasList = async () => {
  try {
    const res = await getAreas({
      post_params: {}
    })
    options.value = res.data.areas

    // console.log(res)
  } finally {
  }
}

// 查询部门数据
const getDataList = async () => {
  try {
    const res = await listRole({
      post_params: {
        type: 'b',
        parent_role_id: ''
      }
    })
    roleList.value = res.data.list

    const res2 = await listRole({
      post_params: {
        type: 'a',
        parent_role_id: ''
      }
    })
    departmentList.value = res2.data.list.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  } finally {
  }
}

//获取证件类型
const Dictionary = async () => {
  try {
    const res = await getDictionary({
      post_params: {
        key: 'leader_card_type'
      }
    })
    cardTypeList.value = res.data.values.map((item) => {
      return {
        label: item,
        value: item
      }
    })
  } finally {
  }
}

const { form, resetForm } = useForm({
  role_ids: [],
  department_id: '',
  account: '',
  password: '',
  status: '',
  work_status: '',
  head_image: '',
  name: '',
  mobile: '',
  card_type: '',
  card_number: '',
  city_address: '',
  address: '',
  id_card_image_front: '',
  id_card_image_back: '',
  work_image: ''
})

// 重置
const reset = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const visible = ref(false)
// 新增
const onAdd = () => {
  reset()
  getDataList()
  form.password = ''
  dataId.value = ''
  visible.value = true
}
//上传头像
const onChange = (currentFile) => {
  putFileToOss(currentFile)
}
const onChange1 = (currentFile) => {
  putFileToOss1(currentFile)
}
const onChange2 = (currentFile) => {
  putFileToOss2(currentFile)
}
const onChange3 = (currentFile) => {
  putFileToOss3(currentFile)
}
function handleRemove1(file) {
  // 在这里处理文件删除的逻辑
  fileList1.value = fileList1.value.filter((item) => item.res.rt !== file.res.rt)
}
function handleRemove2(file) {
  // 在这里处理文件删除的逻辑
  fileList2.value = fileList2.value.filter((item) => item.res.rt !== file.res.rt)
}
function handleRemove3(file) {
  // 在这里处理文件删除的逻辑
  fileList3.value = fileList3.value.filter((item) => item.res.rt !== file.res.rt)
}
function handleRemove4(file) {
  // 在这里处理文件删除的逻辑
  fileList4.value = fileList4.value.filter((item) => item.res.rt !== file.res.rt)
}
// 需要上传的时候，调用
const putFileToOss = async (file) => {
  console.log(file, window)
  // const { file } = fileObj
  try {
    const result = await window.globalOSSClient.put(file.name, file)
    fileList1.value.push(result)
    console.log('File uploaded:', fileList1.value)
    bcUpload({
      url: result,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
const putFileToOss1 = async (file) => {
  console.log(file, window)
  // const { file } = fileObj
  try {
    const result = await window.globalOSSClient.put(file.name, file)
    fileList2.value.push(result)
    console.log('File uploaded:', fileList2.value)
    bcUpload({
      url: result,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
const putFileToOss2 = async (file) => {
  console.log(file, window)
  // const { file } = fileObj
  try {
    const result = await window.globalOSSClient.put(file.name, file)
    fileList3.value.push(result)
    console.log('File uploaded:', fileList3.value)

    bcUpload({
      url: result,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
const putFileToOss3 = async (file) => {
  console.log(file, window)
  // const { file } = fileObj
  try {
    const result = await window.globalOSSClient.put(file.name, file)
    fileList4.value.push(result)
    console.log('File uploaded:', fileList4.value)
    bcUpload({
      url: result,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
// 保存服务器
const bcUpload = async (data) => {
  let data1 = {
    url: data.value.map((obj: any) => obj.url).toString(),
    name: data.name,
    size: data.size,
    file_type: data.type,
    upload_type: 'oss'
  }

  try {
    const res = await frontUpload({
      post_params: data1
    })
    if (res.code == 1) {
    }
  } catch (error) {
    return false
  }
}
// 修改
const onUpdate = async (item: any) => {
  reset()
  getDataList()
  dataId.value = item.id
  Object.assign(form, item)
  form.password = ''
  visible.value = true
}

// 保存
const save = async () => {
  form.head_image = ''
  if (fileList1.value.length > 0) {
    form.head_image = fileList1.value.map((obj: any) => obj.url).toString()
  }
  // console.log(form, form.id_card_image_front)
  if (form.id_card_image_front != undefined && form.id_card_image_front.length > 0)
    form.id_card_image_front == fileList2.value.map((obj: any) => obj.url).toString()
  if (form.id_card_image_front != undefined && form.id_card_image_back.length > 0)
    form.id_card_image_back = fileList3.value.map((obj: any) => obj.url).toString()
  if (form.id_card_image_front != undefined && form.work_image.length > 0)
    form.work_image = fileList4.value.map((obj: any) => obj.url).toString()
  // for (let i in form) {
  //   if (form[i].length == 0 && form) {
  //     delete form[i]
  //   }
  // }
  try {
    let isInvalid = await formRef.value?.validate()

    if (isInvalid) return false
    if (isUpdate.value) {
      await addUser({
        post_params: form
      })
      Message.success('修改成功')
    } else {
      // if (rawPassword) {
      //   form.password = encryptByRsa(rawPassword) || ''
      // }
      delete form.id
      await addUser({
        post_params: form
      })
      Message.success('新增成功')
    }
    emit('save-success')
    reset()
    return true
  } catch (error) {
    return false
  }
}

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

defineExpose({ onAdd, onUpdate })
</script>
