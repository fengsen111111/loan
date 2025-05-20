<template>
  <a-modal :visible="visible" title="修改基本信息" @before-ok="save" @cancel="visible = false">
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { addUser } from '@/apis'
import { Message } from '@arco-design/web-vue'
import { GiForm, type Columns } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useUserStore } from '@/stores'

const options: Options = {
  form: {},
  col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  btns: { hide: true }
}

const columns: Columns = [
  {
    label: '昵称',
    field: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入昵称' }]
  },
  {
    label: '手机号',
    field: 'mobile',
    type: 'input',
    rules: [{ required: true, message: '请输入手机号' }]
  },

  {
    label: '账户',
    field: 'account',
    type: 'input',
    rules: [{ required: true, message: '请输入账户' }]
  }
]
const userStore = useUserStore()
const userInfo: any = ref({})
// const userInfo = computed(() => userStore.userInfo)
// console.log(userInfo)
const { form, resetForm } = useForm({
  id: userInfo.value.id,
  name: userInfo.value.name,
  mobile: userInfo.value.mobile,
  account: userInfo.value.account,

})

console.log(userInfo.value, '999')
const formRef = ref<InstanceType<typeof GiForm>>()
// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 修改
const onUpdate = async () => {
  reset()
  userInfo.value = userStore.userInfo
  // console.log(userInfo.value)
  form.name = userInfo.value.name
  form.id = userInfo.value.id
  form.mobile = userInfo.value.mobile
  form.account = userInfo.value.account

  visible.value = true
}

// 保存
const save = async () => {
  const isInvalid = await formRef.value?.formRef?.validate()
  if (isInvalid) return false
  try {
    await addUser({ post_params: form })
    Message.success('修改成功')
    // 修改成功后，重新获取用户信息
    await userStore.getInfo()
    visible.value = false
    return true
  } catch (error) {
    return false
  }
}

defineExpose({ onUpdate })
</script>
