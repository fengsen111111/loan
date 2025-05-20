<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <div style="display: flex">
            <div class="name">合同编号</div>
            <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
            </a-input>
          </div>

          <div style="display: block">
            <div style="display: flex">
              <div class="name">登记日期</div>
              <DateRangePicker v-model="loginTime" @change="search" />
            </div>
          </div>

          <a-button @click="reset">重置</a-button>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-link @click="showModal(record)">详情 </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>
    <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
      <div>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['1']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请信息" key="1">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>合同编号</span>{{ datail.contract_num }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>合同名称</span> {{ datail.contractName }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>申请批次号</span>{{ datail.apply_number }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>申请商户</span> {{ datail.name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>登记人</span>{{ datail.name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>登记时间</span> {{ datail.sign_time }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>作废原因</span>{{ datail.reject_reason }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
      </div>
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { getSignContentsList } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import RoleDetailDrawer from '@/views/system/role/RoleDetailDrawer.vue'

defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const userStore = useUserStore()
const currentToken = userStore.token
const loginTime = ref([])
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },

  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  // { title: '合同名称', dataIndex: 'contractName', ellipsis: true, tooltip: true },
  { title: '申请批次号', dataIndex: 'apply_number', ellipsis: true, tooltip: true },

  { title: '一式份数', dataIndex: 'one_number', width: 180 },
  { title: '作废原因', dataIndex: 'reject_reason', ellipsis: true, tooltip: true },
  { title: '登记人', dataIndex: 'registerName', ellipsis: true, tooltip: true },
  { title: '登记日期', dataIndex: 'registerDate', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive<OnlineUserQuery>({
  status: 'c',
  contract_num: '',
  start_time: loginTime.value.length > 0 ? loginTime.value[0] : '',
  end_time: loginTime.value.length > 0 ? loginTime.value[1] : ''
})
const datail = ref({})
const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    getSignContentsList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)

//打开弹窗
const showModal = (item: any) => {
  datail.value = item
  open.value = true
}
//关闭
const handleOk = () => {
  open.value = false
}
// 重置
const reset = () => {
  queryForm.nickname = undefined
  queryForm.loginTime = undefined
  search()
}

// 强退
const handleKickout = (token: string) => {
  kickout(token).then(() => {
    search()
    Message.success('强退成功')
  })
}
</script>

<style lang="scss" scoped>
.name {
  width: 70px;
  text-align: right;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}

:deep(.arco-collapse-item-header:before) {
  background-color: #2911df;
  border-radius: 4px;
  content: '';
  height: 18px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
}

:deep(.arco-collapse-item-header) {
  padding-left: 20px;
}

.grid-demo1 {
  div {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  span {
    text-align: right;
    font-weight: 800;
    margin-right: 30px;
  }
}
</style>
