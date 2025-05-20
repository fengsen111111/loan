<template>
  <a-modal
    :visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '520px' }"
    width="90%"
    @ok="save"
    @cancel="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { getDept, addDept } from '@/apis'
import type { DeptReq } from './type'
import { Message } from '@arco-design/web-vue'
import { GiForm, type Columns } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { listDept } from '@/apis'
const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改部门' : '新增部门'))
const formRef = ref<InstanceType<typeof GiForm>>()
const options: Options = {
  form: {},
  col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  btns: { hide: true }
}

const columns: Columns = [
  { label: '名称', field: 'name', type: 'input', rules: [{ required: true, message: '请输入名称' }] },

  {
    label: '状态',
    field: 'status',
    type: 'switch',
    props: {
      type: 'round',
      checkedValue: 'Y',
      uncheckedValue: 'N',
      checkedText: '启用',
      uncheckedText: '禁用'
    }
  }
]

const { form, resetForm } = useForm<DeptReq>({
  name: '',
  type: 'a',
  status: 'Y'
})

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  visible.value = false
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = (id?: string) => {
  reset()
  visible.value = true
}

// 修改
const onUpdate = async (item: any) => {
  reset()
  dataId.value = item.id
  form.id = item.id
  form.name = item.name
  form.status = item.status
  form.type = item.type
  // Object.assign(form, item)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await addDept({
        post_params: form
      })
      Message.success('修改成功')
    } else {
      await addDept({
        post_params: form
      })

      Message.success('新增成功')
    }
    // 更新部门树

    emit('save-success')
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
