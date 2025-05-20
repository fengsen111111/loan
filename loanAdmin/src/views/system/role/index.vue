<template>
  <div class="gi_page">
    <a-card title="角色管理" class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false" :disabledTools="['size']"
        :disabledColumnKeys="['name']" @refresh="search">
        <template #custom-left>
          <a-button @click="reset">重置</a-button>
        </template>
        <template #custom-right>
          <a-button type="primary" @click="onAdd">
            <template #icon><icon-plus /></template>
            <span>新增</span>
          </a-button>
        </template>

        <template #isSystem="{ record }">
          <a-tag v-if="record.isSystem" color="arcoblue" size="small">是</a-tag>
          <a-tag v-else color="red" size="small">否</a-tag>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status == 'Y'" color="arcoblue" size="small">启用</a-tag>
          <a-tag v-else color="red" size="small">禁用</a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-link @click="onUpdate(record)">修改</a-link>
            <!--<a-link @click="onAdd()">新增</a-link>-->

            <!-- <a-popconfirm
              type="warning"
              content="是否确定删除该条数据？"
              :ok-button-props="{ status: 'danger' }"
              @ok="onDelete(record)"
            >
              <a-link status="danger" title="系统内置数据不能删除'"> 删除 </a-link>
            </a-popconfirm> -->
          </a-space>
        </template>
      </GiTable>

      <RoleAddModal ref="RoleAddModalRef" @save-success="search" />
      <RoleDetailDrawer ref="RoleDetailDrawerRef" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { listRole, deleteRole } from '@/apis'
import RoleAddModal from './RoleAddModal.vue'
import RoleDetailDrawer from './RoleDetailDrawer.vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable } from '@/hooks'

import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SystemRole' })
const List = ref([])
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '名称', dataIndex: 'name', slotName: 'name', ellipsis: true, tooltip: true},
  // { title: '部门', dataIndex: 'parent_name', align: 'center', ellipsis: true, tooltip: true },

  { title: '状态', slotName: 'status', align: 'center', ellipsis: true, tooltip: true },

  { title: '创建时间', dataIndex: 'create_time', ellipsis: true, tooltip: true },
  { title: '修改时间', dataIndex: 'update_time',ellipsis: true, tooltip: true },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive({
  post_params: {
    type: 'b',
    parent_role_id: ''
  }
})

// const {
//   tableData: dataList,
//   loading,
//   search,
//   handleDelete
// } = useTable((p) => listRole({ ...queryForm }), { immediate: true })
const dataList = ref<DeptResp[]>([])
const loading = ref(false)
const tableRef = ref<InstanceType<typeof GiTable>>()
const getdeptList = async () => {
  try {
    const res = await listRole({
      post_params: {
        type: 'a'
      }
    })

    List.value = []
        res.data.list.map((item)=>{
      if(item.id !="1" || item.id !="2" ){
        List.value.push(item)
      }
    })
  } finally {
  }
}

// 查询列表数据
const getDataList = async (query: DeptQuery = { ...queryForm }) => {
  try {
    loading.value = true
    const res = await listRole(query)
    dataList.value = []
    res.data.list.map((item)=>{
      // if(item.id !="1" || item.id !="2" ){
      //   dataList.value.push(item)
      // }
      if(item.id==1){
      //
      }else if(item.id==2){

      }else{
        dataList.value.push(item)

      }
    })
    await nextTick(() => {
      tableRef.value?.tableRef?.expandAll(true)
    })
  } finally {
    loading.value = false
  }
}

// 查询
const search = () => {
  getDataList()
}

// 重置
const reset = () => {
  queryForm.description = undefined
  search()
}

// 删除
const onDelete = (item: RoleResp) => {
  return handleDelete(() => deleteRole(item.id), { content: `是否确定删除角色 [${item.name}]？`, showModal: true })
}

const RoleAddModalRef = ref<InstanceType<typeof RoleAddModal>>()
// 新增
const onAdd = () => {
  RoleAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (item: RoleResp) => {
  RoleAddModalRef.value?.onUpdate(item)
}

const RoleDetailDrawerRef = ref<InstanceType<typeof RoleDetailDrawer>>()
// 详情
const onDetail = (item: RoleResp) => {
  RoleDetailDrawerRef.value?.onDetail(item.id)
}

onMounted(() => {
  search(), getdeptList()
})
</script>

<style lang="scss" scoped>
.name {
  width: 100px;
  text-align: right;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}
</style>
