<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable
        row-key="id"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']"
        @refresh="search"
      >
        <template #custom-left>
          <div style="display: flex">
            <div class="name">客户姓名</div>
            <a-input v-model="queryForm.name" placeholder="请输入客户姓名" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>

          <div style="display: flex">
            <div class="name">合同编号</div>
            <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>
          <div style="display: flex">
            <div class="name">债权持有方</div>
            <a-cascader
              :options="capitalList"
              :field-names="fieldNames"
              v-model="queryForm.capital_id"
              placeholder="请选择债权持有方"
            />
          </div>
          <div style="display: flex">
            <div class="name" style="width: 200px; margin-left: -20px">合同有效日期</div>
            <DateRangePicker v-model="loginTime" @change="search" />
          </div>

          <a-button @click="reset">重置</a-button>
        </template>
        <template #status="{ record }">{{
          record.status == 'a'
            ? '可抢件 '
            : record.status == 'b'
            ? '待办件'
            : record.status == 'c'
            ? '已办件'
            : (record.status = 'd'
                ? '签约中'
                : record.status == 'e'
                ? '已签约'
                : record.status == 'f'
                ? '待转债 '
                : record.status == 'g'
                ? '待放款'
                : record.status == 'h'
                ? '放款异常'
                : record.status == 'i'
                ? '放款记录'
                : '')
        }}</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="submitOrder(record)"> 提交转债 </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { storeGetOrderList, submitMove, getStoreCapitalList } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const capitalList = ref([])
const loginTime = ref([])
const fieldNames = { value: 'name', label: 'name' }
const userStore = useUserStore()
const currentToken = userStore.token
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '姓名/公司名称 ', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '手机号', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '证件号码', dataIndex: 'card_number', ellipsis: true, tooltip: true },
  { title: '债权持有方', dataIndex: 'license_plate_name', ellipsis: true, tooltip: true },
  {
    title: '操作',
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
  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '姓名/公司名称 ', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '手机号', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '证件号码', dataIndex: 'card_number', ellipsis: true, tooltip: true },
  { title: '债权持有方', dataIndex: 'os', ellipsis: true, tooltip: true },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]
const columns2: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '合同编号', dataIndex: 'contract_num', width: 200, ellipsis: true, tooltip: true },
  { title: '原债权受让方 ', dataIndex: 'name', width: 200, ellipsis: true, tooltip: true },
  { title: '新债权受让方', dataIndex: 'mobile', width: 200, ellipsis: true, tooltip: true },
  { title: '合同金额(元)', dataIndex: 'card_number', width: 200, ellipsis: true, tooltip: true },
  { title: '债权金额(元)', dataIndex: 'os', width: 200, ellipsis: true, tooltip: true },
  { title: '债转完成时间', dataIndex: 'os', width: 200, ellipsis: true, tooltip: true },
  { title: '债权转让说明', dataIndex: 'os', width: 200, ellipsis: true, tooltip: true },
  { title: '状态', slotName: 'status', ellipsis: true, tooltip: true }
  // {
  //   title: '操作',
  //   slotName: 'action',
  //   align: 'center',
  //   fixed: 'right',
  //   show: true
  // }
]

const num = ref(0)
const queryForm = reactive<OnlineUserQuery>({
  status: 'f',
  capital_id: '',
  name: '',
  contract_num: '', //合同编号
  start_time: loginTime.value.length > 0 ? loginTime.value[0] : '',
  end_time: loginTime.value.length > 0 ? loginTime.value[1] : ''
})
const List = reactive([
  { name: '合同基本信息' },
  { name: '客户详细信息' },
  { name: '融担方信息' },
  { name: '债转变更记录' }
])
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
const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    storeGetOrderList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)
const detail = (i) => {
  num.value = i
}

const datail = ref()
// 重置
const reset = () => {
  loginTime.value = []
  queryForm.status = 'f'
  queryForm.capital_id = ''
  queryForm.name = ''
  queryForm.contract_num = ''
  queryForm.start_time = ''
  queryForm.end_time = ''

  search()
}
//关闭
const handleOk = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 2000)
}

//提交转债
const submitOrder = async (item) => {
  try {
    const res = await submitMove({
      post_params: { order_id: item.id }
    })

    Message.success('提交转债')
    search()

    return true
  } catch (error) {
    return false
  }
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
.mpdal_left {
  width: 100px;
  margin-right: 90px;
}
.mpdal_right {
  width: calc(100% - 200px);
}
.grid-demo {
  div {
    margin-bottom: 20px;
  }
  span {
    text-align: right;
    font-weight: 800;
    margin-right: 30px;
  }
  .idcard {
    display: flex;
    margin-left: 50px;
    .idcarda {
      text-align: center;
      margin-right: 50px;
      img {
        width: 120px;
        height: 100px;
      }
    }
  }
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
