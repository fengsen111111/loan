<template>
  <a-drawer
    :visible="visible"
    title="用户详情"
    :width="width >= 600 ? 600 : '100%'"
    :footer="false"
    @cancel="visible = false"
  >
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="ID" :span="2">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="用户名">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item label="手机号">{{ dataDetail?.mobile }}</a-descriptions-item>
      <a-descriptions-item label="账号">{{ dataDetail?.account }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.create_time }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.update_time }}</a-descriptions-item>
      <!-- <a-descriptions-item label="所属部门">{{ dataDetail?.deptName }}</a-descriptions-item> -->
      <a-descriptions-item label="头像" v-if="dataDetail?.head_image">
        <a-image :src="dataDetail?.head_image"></a-image>
      </a-descriptions-item>
      <a-descriptions-item label="身份证正面" v-if="dataDetail?.id_card_image_front">
        <a-image :src="dataDetail?.id_card_image_front"></a-image
      ></a-descriptions-item>
      <a-descriptions-item label="身份证反面" v-if="dataDetail?.id_card_image_back">
        <a-image :src="dataDetail?.id_card_image_back"></a-image
      ></a-descriptions-item>
      <a-descriptions-item label="工作证明" v-if="dataDetail?.work_image">
        <a-image :src="dataDetail?.work_image"></a-image
      ></a-descriptions-item>

      <a-descriptions-item label="角色">{{
        dataDetail?.role == 'a'
          ? '拥有者'
          : dataDetail?.role == 'b'
          ? '管理员'
          : dataDetail?.role == 'c'
          ? '业务员'
          : dataDetail?.role == 'd_a'
          ? '资料审核员'
          : dataDetail?.role == 'd_b'
          ? '风险审核员'
          : dataDetail?.role == 'd_c'
          ? '合同审核员'
          : ''
      }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
// import { getUser, type UserDetailResp } from '@/apis'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<UserDetailResp>()

const visible = ref(false)
// 详情
const onDetail = async (item: any) => {
  dataId.value = item.id
  dataDetail.value = item
  console.log(dataDetail.value)
  visible.value = true
}

defineExpose({ onDetail })
</script>

<style lang="scss" scoped></style>
