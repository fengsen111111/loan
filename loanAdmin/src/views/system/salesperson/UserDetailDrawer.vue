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
      <a-descriptions-item label="证件号码">{{ dataDetail?.card_number }}</a-descriptions-item>
      <a-descriptions-item label="证件类型">{{ dataDetail?.card_type }}</a-descriptions-item>
      <a-descriptions-item label="角色">业务员</a-descriptions-item>
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
  visible.value = true
}

defineExpose({ onDetail })
</script>

<style lang="scss" scoped></style>
