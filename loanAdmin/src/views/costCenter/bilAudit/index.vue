<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <div style="display: flex">
            <div class="name">状态</div>
            <a-cascader :options="capitalList" :field-names="fieldNames" v-model="queryForm.capital_id"
              placeholder="请选择状态" />
          </div>
          <div style="display: flex">
            <div class="name" style="width: 200px; margin-left: -20px">帐期</div>
            <DateRangePicker v-model="loginTime" @change="search" />
          </div>
          <a-button @click="reset">重置</a-button>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}（{{ record.username }}）</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="showModel(record)"> 详情 </a-link>
            <a-link @click="submitOrder(record)"> 确认账单 </a-link>
          </a-space>
        </template>
      </GiTable>
      <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
        <div>
          <a-collapse :default-active-key="['1']" :accordion="true">
            <a-collapse-item header="账期" key="1">
              <div style="width: 100%">
                <a-row class="grid-demo">
                  <a-col :span="6">
                    <div><span> 账单金额</span> {{ detailCon?.contract_num }}</div>
                  </a-col>
                  <a-col :span="6">
                    <div><span>实收金额</span> {{ detailCon?.id }}</div>
                  </a-col>
                  <a-col :span="6">
                    <div><span>本月应收金额</span> {{ detailCon?.order_material?.apply_money }}</div>
                  </a-col>
                  <a-col :span="6">
                    <div><span>差额</span> {{ detailCon?.order_material?.goods_name }}</div>
                  </a-col>
                </a-row>
              </div>
            </a-collapse-item></a-collapse>
          <a-collapse :default-active-key="['2']" :accordion="true">
            <a-collapse-item header="账单明细" key="2">
              <div style="width: 100%">
                <GiTable row-key="id" :data="dataList" :columns="columns1" :loading="loading"
                  :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                  :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search"></GiTable>
              </div>
            </a-collapse-item></a-collapse>
        </div>
        <template #footer>
          <a-button key="back" @click="open = false">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { waitSureMoveList, getStoreCapitalList } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
const open = ref<boolean>(false)
const List = reactive([{ name: '合同基本信息' }, { name: '客户详细信息' }, { name: '融担方信息' }])
const userStore = useUserStore()
const capitalList = ref([])
const fieldNames = { value: 'name', label: 'name' }
const currentToken = userStore.token
const loginTime = ref([])
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '合同编号', dataIndex: 'contract_num', width: 180, ellipsis: true, tooltip: true },
  { title: '转债确认单编号  ', dataIndex: 'move_num', width: 180, ellipsis: true, tooltip: true },
  { title: '客户姓名  ', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '证件号码  ', dataIndex: 'card_number', width: 180, ellipsis: true, tooltip: true },
  { title: '证件类型', dataIndex: 'card_type', width: 180, ellipsis: true, tooltip: true },
  { title: '申请金额 ', dataIndex: 'apply_money', width: 180 },
  { title: '助贷方名称 ', dataIndex: 'capital_name', width: 180 },
  { title: '确认时间 ', dataIndex: 'sure_time', width: 180 },
  { title: '确认人  ', dataIndex: 'worker_name', width: 180 },
  {
    title: '操作',
    width: 180,

    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]
const columns1: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '费用类型', dataIndex: 'contract_num', width: 180, ellipsis: true, tooltip: true },
  { title: '费用笔数', dataIndex: 'move_num', width: 180, ellipsis: true, tooltip: true },
  { title: '交易金额(元)  ', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '应收金额(元) ', dataIndex: 'card_number', width: 180, ellipsis: true, tooltip: true },
  { title: '实收金额(元)', dataIndex: 'card_type', width: 180, ellipsis: true, tooltip: true },
  { title: '月结应收金额(元) ', dataIndex: 'apply_money', width: 180 },

  {
    title: '操作',
    width: 180,

    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]
onMounted(() => {
  CapitalList()
}) //获取接收债权方
const CapitalList = async () => {
  try {
    const res = await getStoreCapitalList()
    capitalList.value = res.data.list

    return true
  } catch (error) {
    return false
  }
}
const queryForm = reactive<OnlineUserQuery>({
  capital_id: '',
  name: '',
  contract_num: '',
  start_time: loginTime.value.length > 0 ? loginTime.value[0] : '',
  end_time: loginTime.value.length > 0 ? loginTime.value[1] : ''
})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    waitSureMoveList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)

// 重置
const reset = () => {
  loginTime.value = []

  queryForm.move_status = 'c'
  queryForm.capital_id = ''
  queryForm.name = ''
  queryForm.contract_num = ''
  queryForm.start_time = ''
  queryForm.end_time = ''

  search()
}

//关闭
const handleOk = () => {
  open.value = false
}
// 详情
const showModel = (item) => {
  open.value = true
}
</script>

<style lang="scss" scoped>
.name {
  width: 130px;
  text-align: right;
  font-weight: 800;
  margin-right: 10px;
  margin-top: 8px;
}
</style>
