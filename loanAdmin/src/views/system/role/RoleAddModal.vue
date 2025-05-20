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
      <a-alert v-if="!form.disabled" type="warning" style="margin-bottom: 15px">
        变更功能权限或数据权限后，关联在线用户会自动下线！
      </a-alert>
      <fieldset>
        <legend>基础信息</legend>
        <a-form-item label="名称" field="name">
          <a-input v-model.trim="form.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="状态" field="status">
          <a-switch v-model.trim="form.status" checked-value="Y" unchecked-value="N" />
        </a-form-item>
<!--        <a-form-item label="部门" field="parent_role_id">-->
<!--          <a-select v-model.trim="form.parent_role_id" placeholder="请选择部门">-->
<!--            <a-option v-for="item in List" :key="item.id" :value="item.id">{{ item.name }}</a-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
        <!-- <a-form-item label="角色权限" field="rules"> </a-form-item> -->
        <fieldset>
          <legend>角色权限</legend>
          <a-form-item hide-label :disabled="form.isSystem">
            <a-space>
              <a-checkbox v-model="isMenuExpanded" @change="onExpanded('menu')">展开/折叠</a-checkbox>
              <a-checkbox v-model="isMenuCheckAll" @change="onCheckAll('menu')">全选/全不选</a-checkbox>
            </a-space>
            <template #extra>
              <a-tree
                ref="menuTreeRef"
                v-model:checked-keys="form.rules"
                :data="restructuredRoutes"
                :default-expand-all="isMenuExpanded"
                checkable
              />
            </template>
          </a-form-item>
        </fieldset>
      </fieldset>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { listRole, getRole, addRole, updateRole } from '@/apis'
import { Message, type FormInstance, type TreeNodeData } from '@arco-design/web-vue'
import { useForm } from '@/hooks'
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
import { restructuredRoutes } from '@/router'
// const { menuList, getMenuList } = useMenu()
const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改角色' : '新增角色'))
const formRef = ref<FormInstance>()
const List = ref([])
const rules: FormInstance['rules'] = {
  name: [{ required: true, message: '请输入名称' }],
  status: [{ required: true, message: '请选择状态' }],
  parent_role_id: [{ required: true, message: '请选择部门' }],
  rules: [{ required: true, message: '请选择数据权限' }]
}
const visible = ref(false)

const { form, resetForm } = useForm({
  name: '',
  status: '',
  type: 'b',
  rules: ''
})
const router = useRouter()
const routes = router.getRoutes()
const menuTreeRef = ref()
const deptTreeRef = ref()
const isMenuExpanded = ref(false)
const isDeptExpanded = ref(true)
const isMenuCheckAll = ref(false)
const isDeptCheckAll = ref(false)

const menuList: Array<any> = reactive([])

// // 调用重组函数并输出结果

menuList.push(...restructuredRoutes)

console.log(menuList, '重组函数')
// 展开/折叠
const onExpanded = (type: string) => {
  if (type === 'menu') {
    menuTreeRef.value?.expandAll(isMenuExpanded.value)
  } else if (type === 'dept') {
    deptTreeRef.value?.expandAll(isDeptExpanded.value)
  }
}

// 全选/全不选
const onCheckAll = (type: string) => {
  if (type === 'menu') {
    menuTreeRef.value?.checkAll(isMenuCheckAll.value)
  } else if (type === 'dept') {
    deptTreeRef.value?.checkAll(isDeptCheckAll.value)
  }
}

// 重置
const reset = () => {
  visible.value = false
  isMenuExpanded.value = false
  isMenuCheckAll.value = false
  isDeptExpanded.value = true
  isDeptCheckAll.value = false
  menuTreeRef.value?.expandAll(isMenuExpanded.value)
  deptTreeRef.value?.expandAll(isDeptExpanded.value)
  formRef.value?.resetFields()
  resetForm()
}

// 新增
const onAdd = () => {
  reset()
  getDataList()
  dataId.value = ''
  visible.value = true
}

const getDataList = async () => {
  try {
    const res = await listRole({
      post_params: {
        type: 'a'
      }
    })
    List.value = res.data.list
  } finally {
  }
}

// 修改
const onUpdate = async (item: any) => {
  reset()
  getDataList()
  dataId.value = item.id
  // const res = await getRole(id)
  // Object.assign(form, res.data)
  form.id = item.id
  form.name = item.name
  form.status = item.status
  form.type = item.type
  form.parent_role_id = item.parent_role_id
  if (item.rules.length > 0) {
    form.rules = JSON.parse(item.rules)
  }

  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    form.rules = JSON.stringify(form.rules)
    if (isUpdate.value) {
      await addRole({
        post_params: form
      })
      Message.success('修改成功')
    } else {
      await addRole({
        post_params: form
      })
      Message.success('新增成功')
    }
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

<style lang="scss" scoped>
fieldset {
  padding: 15px 15px 0 15px;
  margin-bottom: 15px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
}
fieldset legend {
  color: rgb(var(--gray-10));
  padding: 2px 5px 2px 5px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 3px;
}
</style>
