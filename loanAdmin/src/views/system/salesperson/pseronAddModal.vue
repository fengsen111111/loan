<template>
  <a-drawer
    :visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 600 ? 600 : '100%'"
    @ok="save"
    @cancel="reset"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
      <a-form-item label="姓名  " field="name">
        <a-input v-model.trim="form.name" placeholder="请输入姓名  " :max-length="30" />
      </a-form-item>
      <a-form-item label="账户" field="account">
        <a-input v-model.trim="form.account" placeholder="请输入账户" :max-length="64" />
      </a-form-item>
      <a-form-item v-if="!isUpdate" label="密码" field="password">
        <a-input-password v-model.trim="form.password" placeholder="请输入密码" :max-length="32" />
      </a-form-item>
      <a-form-item label="手机号码" field="mobile">
        <a-input v-model.trim="form.mobile" placeholder="请输入手机号码" :max-length="11" />
      </a-form-item>
      <a-col :span="12">
        <a-form-item label="证件号码" field="card_number">
          <a-input v-model.trim="form.card_number" placeholder="请输入证件号码" /> </a-form-item
      ></a-col>
      <a-col :span="12">
        <a-form-item label="证件类型 " field="card_type">
          <a-select v-model="form.card_type" :options="cardTypeList" placeholder="请选择证件类型" /> </a-form-item
      ></a-col>
      <a-form-item label="角色类型" field="role">
        <a-select v-model="form.role" :options="deptList" placeholder="请选择角色类型" />
      </a-form-item>
      <a-form-item label="角色" field="role_id" v-if="form.role == 'b'">
        <a-select v-model.trim="form.role_id" placeholder="请选择角色">
          <a-option v-for="item in roleList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="状态" field="status">
        <a-switch
          v-model="form.status"
          checked-value="Y"
          unchecked-value="N"
          checked-text="启用"
          unchecked-text="禁用"
          type="round"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { listRole, addUser, getDictionary } from '@/apis'
import type { Gender, Status } from '@/types/global'
import { Message, type FormInstance, type TreeNodeData } from '@arco-design/web-vue'
import { useForm } from '@/hooks'
import { useWindowSize } from '@vueuse/core'
import { encryptByRsa } from '@/utils/encrypt'

const { width } = useWindowSize()
const roleList = ref([])
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
    value: 'c',
    label: '业务员'
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
  role: [{ required: true, message: '请选择角色类型' }],
  role_id: [{ required: true, message: '请选择角色' }]
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
  } finally {
  }
}
const cardTypeList = ref([])
const { form, resetForm } = useForm({
  account: '',
  name: '',
  mobile: '',
  card_number: '',
  card_type: '',
  role: '',
  role_id: '',
  status: 'b' as Status,
  type: 'N' as 'Y' | 'N'
})

// 重置
const reset = () => {
  formRef.value?.resetFields()
  visible.value = false
  resetForm()
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

const visible = ref(false)
// 新增
const onAdd = () => {
  reset()
  getDataList()
  Dictionary()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (item: any) => {
  reset()
  getDataList()
  Dictionary()
  dataId.value = item.id
  // const res = await getUser(id)
  Object.assign(form, item)
  visible.value = true
}

// 保存
const save = async () => {
  const rawPassword = form.password
  try {
    const isInvalid = await formRef.value?.validate()
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
      await addUser({
        post_params: form
      })
      Message.success('新增成功')
    }
    visible.value = false
    emit('save-success')
    return true
  } catch (error) {
    form.password = rawPassword
    return false
  }
}

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

defineExpose({ onAdd, onUpdate })
</script>
