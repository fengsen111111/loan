<template>
  <div class="gi_page">
    <a-card title="部门管理" class="general-card">
      <GiTable ref="tableRef" row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false" :disabledTools="['size']"
        :disabledColumnKeys="['name']" @refresh="search">
        <template #expand-icon="{ expanded }">
          <IconDown v-if="expanded" />
          <IconRight v-else />
        </template>
        <template #custom-left>
          <a-input v-model="queryForm.description" placeholder="请输入关键词" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input>
          <a-select v-model="queryForm.status" :options="DisEnableStatusList" placeholder="请选择状态" allow-clear
            @change="search" />
          <a-button @click="reset">重置</a-button>
        </template>
        <template #custom-right>
          <a-button type="primary" @click="onAdd()">
            <template #icon><icon-plus /></template>
            <span>新增</span>
          </a-button>
          <a-tooltip content="导出">
            <a-button v-permission="['system:dept:export']" class="gi_hover_btn-border" @click="onExport">
              <template #icon>
                <icon-download />
              </template>
            </a-button>
          </a-tooltip>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status == 'Y'" color="arcoblue" size="small">启用</a-tag>
          <a-tag v-else color="red" size="small">禁用</a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-link @click="onUpdate(record)">修改</a-link>
            <!-- <a-link @click="onAdd(record.id)">新增</a-link>-->

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
    </a-card>

    <DeptAddModal ref="DeptAddModalRef" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { listDept, deleteDept, exportDept, type DeptResp, type DeptQuery } from '@/apis'
import DeptAddModal from './DeptAddModal.vue'
import { Message } from '@arco-design/web-vue'
import type GiTable from '@/components/GiTable/index.vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { DisEnableStatusList } from '@/constant/common'

defineOptions({ name: 'SystemDept' })

const columns: TableInstanceColumns[] = [
  { title: '名称', dataIndex: 'name',  ellipsis: true, tooltip: true },
  { title: '状态', slotName: 'status', align: 'center', ellipsis: true, tooltip: true },

  { title: '创建时间', dataIndex: 'create_time', ellipsis: true, tooltip: true },
  { title: '修改时间', dataIndex: 'update_time', ellipsis: true, tooltip: true },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive<DeptQuery>({
  post_params: {
    type: 'a'
  }
})

const dataList = ref<DeptResp[]>([])
const loading = ref(false)
const tableRef = ref<InstanceType<typeof GiTable>>()
// 查询列表数据
const getDataList = async (query: DeptQuery = { ...queryForm }) => {
  try {
    loading.value = true
    const res = await listDept(query)
    dataList.value = res.data.list
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
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = async (item: DeptResp) => {
  await deleteDept(item.id)
  Message.success('删除成功')
  search()
}

// 导出
const onExport = () => {
  useDownload(() => exportDept(queryForm))
}

const DeptAddModalRef = ref<InstanceType<typeof DeptAddModal>>()
// 新增
const onAdd = (parentId?: string) => {
  DeptAddModalRef.value?.onAdd(parentId)
}

// 修改
const onUpdate = (item: DeptResp) => {
  DeptAddModalRef.value?.onUpdate(item)
}

onMounted(() => {
  search()
})
</script>

<style lang="scss" scoped></style>
