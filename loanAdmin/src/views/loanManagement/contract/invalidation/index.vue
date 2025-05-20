<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 2700 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <div style="display: flex">
            <div class="name">合同编号</div>
            <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
            </a-input>
          </div>

          <!-- <div style="display: flex">
            <div class="name">签约城市</div>
            <a-cascader
              :options="options1"
              v-model.trim="queryForm.use_city_address"
              :format-label="format"
              :field-names="fieldNames"
              placeholder="请输入签约城市"
            />
          </div> -->

          <div style="display: flex">
            <div class="name" style="margin-left: 35px">登记日期</div>
            <DateRangePicker v-model="loginTime" @change="search" />
          </div>

          <a-button @click="reset">重置</a-button>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}{{ record.username }}</template>
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
                <!-- <a-col :span="12">
            <div><span>电子合同编号</span> {{ datail.bizNo }}</div>
          </a-col> -->
                <a-col :span="12">
                  <div><span>客户姓名</span>{{ datail.name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>客户手机号码</span> {{ datail.mobile }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>客户身份证号码</span>{{ datail.card_number }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>合同放款金额（元）</span>{{ datail.apply_money }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>借款期限类型</span>{{ datail.loan_time_type }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>合同期数</span>{{ datail.loan_time + '期' }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>合同期限</span> {{ datail.start_time + '-' + datail.end_time }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>执行年利率（%）</span>{{ datail.loan_rate }}</div>
                </a-col>
                <a-col :span="12">
                  <div>
                    <span>签约城市</span>
                    {{ datail.sign_address }}
                  </div>
                </a-col>
                <a-col :span="12">
                  <div><span>签约时间</span>{{ datail.sign_time }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['2']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="合同/协议" key="2">
              <GiTable row-key="id" :data="datail?.contractFileResultList" :columns="columns1"
                :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
                <template #action="{ record }">
                  <a-space>
                    <a-link @click="showModal1(record)"> 预览 </a-link>
                  </a-space>
                </template>
              </GiTable>
            </a-collapse-item>
          </a-collapse>
        </a-space>
      </div>
      <template #footer>

        <a-button key="submit" type="primary" @click="open = false">关闭</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open1" title="预览" @ok="handleOk1" @cancel="open1 = false" width="80%">
      <iframe :src="templateFileUrl" frameborder="0" style="width: 100%; height: 500px"></iframe>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { getSignContentsList, getAreas } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { DisEnableStatusList } from '@/constant/common'
defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const templateFileUrl = ref('')
const options = ref([])
const options1 = ref([])
const fieldNames = { value: 'label', label: 'label' }
const userStore = useUserStore()
const loginTime = ref([])
const currentToken = userStore.token
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },

  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '合同名称', dataIndex: 'contractName', ellipsis: true, tooltip: true },
  { title: '申请批次号', dataIndex: 'apply_number', ellipsis: true, tooltip: true },
  { title: '一式份数', dataIndex: 'one_number', width: 180 },
  { title: '客户姓名', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '客户身份证号', dataIndex: 'card_number', ellipsis: true, tooltip: true },
  { title: '客户证件类型', dataIndex: 'documentTypeLV', ellipsis: true, tooltip: true },
  { title: '客户手机号', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '合同期数', dataIndex: 'loan_time', ellipsis: true, tooltip: true },
  { title: '合同期限类型', dataIndex: 'loan_time_type', width: 180 },
  { title: '合同金额(元)', dataIndex: 'contractAmt', ellipsis: true, tooltip: true },
  { title: '执行年利率(%)', dataIndex: 'loan_rate', ellipsis: true, tooltip: true },
  { title: '用印方式', dataIndex: 'sealType', ellipsis: true, tooltip: true },
  { title: '签约城市', dataIndex: 'sign_address', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]
onMounted(() => {
  getAreasList()
})
const format = (options) => {
  const labels = options.map((option) => option.label)
  queryForm.use_city_address = labels.join('-')
  return labels.join('-')
}
//获取行政区
const getAreasList = async () => {
  try {
    const res = await getAreas({
      post_params: {}
    })
    options.value = res.data.areas
    options1.value = res.data.areas.map((province) => ({
      id: province.id,
      value: province.value,
      label: province.label,
      children: province.children.map((city) => ({
        id: city.id,
        value: city.value,
        label: city.label
      }))
    }))
    // console.log(res)
  } finally {
  }
}
const columns1: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },

  { title: '合同/协议编号', dataIndex: 'contractNo', ellipsis: true, tooltip: true },
  { title: '合同/协议名称', dataIndex: 'contractName', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive<OnlineUserQuery>({
  status: 'b',
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
const showModal = (item) => {

  datail.value = item
  open.value = true
}
//关闭
const handleOk = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 2000)
}
//打开弹窗
const showModal1 = (e) => {
  templateFileUrl.value = e.templateFileUrl
  open1.value = true
}
//关闭
const handleOk1 = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
.name {
  width: 130px;
  text-align: right;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}

.grid-demo span {
  font-size: 12px;
  font-weight: 700;
}

.grid-demo {
  font-size: 14px;
  text-align: center;
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
