<template>
  <a-form ref="formRef" :model="form" :rules="rules" :label-col-style="{ display: 'none' }"
    :wrapper-col-style="{ flex: 1 }" size="large" @submit="handleLogin">
    <a-form-item field="account" hide-label>
      <a-input v-model="form.account" placeholder="请输入用户名" allow-clear />
    </a-form-item>
    <a-form-item field="password" hide-label>
      <a-input-password v-model="form.password" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item>
      <a-row justify="space-between" align="center" class="w-full">
        <a-checkbox v-model="loginConfig.rememberMe">记住我</a-checkbox>
        <!-- <a-link @click="forgetPassword">忘记密码</a-link> -->
      </a-row>
    </a-form-item>
    <a-form-item>
      <a-space direction="vertical" fill class="w-full">
        <a-button class="btn" type="primary" :loading="loading" html-type="submit" size="large" long>立即登录</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { getImageCaptcha } from '@/apis'
import { Message, type FormInstance } from '@arco-design/web-vue'
import { useUserStore } from '@/stores'
import { useStorage } from '@vueuse/core'

const loginConfig = useStorage('login-config', {
  rememberMe: true,
  account: '', // 演示默认值
  password: '' // 演示默认值
})
// console.log(loginConfig)
const formRef = ref<FormInstance>()
const form = reactive({
  account: loginConfig.value.account,
  password: loginConfig.value.password
})

const rules: FormInstance['rules'] = {
  account: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }]
}

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
// 登录
const handleLogin = async () => {
  // const { redirect, ...othersQuery } = router.currentRoute.value.query
  // router.push({
  //   path: (redirect as string) || '/',
  //   query: {
  //     ...othersQuery
  //   }
  // })
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return
    loading.value = true
    await userStore.accountLogin({
      //   {
      //   account: form.account,
      //   password: form.password || ''
      // }
      post_params: form
    })
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      path: (redirect as string) || '/',
      query: {
        ...othersQuery
      }
    })
    const { rememberMe } = loginConfig.value
    loginConfig.value.account = rememberMe ? form.account : ''
    Message.success('欢迎使用')
  } catch (error) {
  } finally {
    loading.value = false
  }
}
function forgetPassword() {
  router.push('/')
}
onMounted(() => { })
</script>

<style lang="scss" scoped>
.arco-input-wrapper,
:deep(.arco-select-view-single) {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  font-size: 13px;
}

:deep(.arco-tabs-nav-ink) {
  width: 0px;
  background-color: transparent;
}

.arco-input-wrapper.arco-input-error {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-3));
}

.arco-input-wrapper.arco-input-error:hover {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-6));
}

.arco-input-wrapper :deep(.arco-input) {
  font-size: 13px;
  color: var(--color-text-1);
}

.arco-input-wrapper:hover {
  border-color: rgb(var(--arcoblue-6));
}

.captcha {
  width: 111px;
  height: 36px;
  margin: 0 0 0 5px;
}

.btn {
  height: 40px;
}

.captcha-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.captcha-container {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay p {
  font-size: 12px;
  color: white;
}
</style>
