<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading" :row-selection="rowSelection"
        @selection-change="selectionChange" :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <a-row class="grid-demo2" :gutter="24">
            <a-col :span="8">
              <div style="display: flex">
                <div class="name">交易类型</div>
                <a-cascader :options="Goods" v-model="queryForm.type" placeholder="请选择交易类型" @change="search" />
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; ">
                <div class="name">交易时间</div>
                <DateRangePicker v-model="renTime" @change="timechange" />
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex;">
                <div class="name">联系人</div>
                <a-input v-model="queryForm.name" placeholder="请输入联系人" allow-clear @change="search" />
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; ">
                <div class="name">联系电话</div>
                <a-input v-model="queryForm.mobile" placeholder="请输入联系电话" allow-clear @change="search" />
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; ">
                <div class="name">合同编号</div>
                <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search" />
              </div>
            </a-col>
            <a-col :span="3">
              <a-button @click="downloadExcel" type="primary">导出excel表格</a-button>
            </a-col>
            <a-col :span="2">
              <a-button @click="reset">重置</a-button>
            </a-col>
            <a-col :span="24">
              <div style="display: flex;   ">
                <div class="name">当前余额</div>
                <div class=" money">{{ store_price }}元</div>
              </div>
            </a-col>
            <!-- <a-col :span="6" v-for="(item, i) in listv" :key="i" class="btn">
              <a-button type="outline" long>
                <div class="ntrlist">
                  <div class="ntt_name">{{ item.name }}</div>
                  <div class="ntred">{{ item.num }}</div>
                </div>
              </a-button>
            </a-col> -->
          </a-row>
        </template>

        <template #type="{ record }">{{ record.type == 'a' ? '充值' : record.type == 'b' ? '续费' : record.type == 'c' ?
          '公证支出' : record.type == 'd' ? '交易手续费' : record.type == 'e' ? '连连充值手续费 ' : '连连代付手续费'
        }}</template>

        <template #money="{ record }">
          <div v-if="record.type == 'a'">{{ '+' + record.money
          }}</div>
          <div v-else-if="record.type == 'b'">{{+ record.money
            }}</div>
          <div v-else>{{ '-' + record.money
          }}</div>
        </template>
      </GiTable>
    </a-card>

  </div>
</template>

<script setup lang="ts">
import {
  getStorePriceLogList,
  checkerOrderSta,

  storeGetOrderDetail,
  storeHasOrder
} from '@/apis'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { Message, Modal } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { api as viewerApi } from 'v-viewer'
import { downloadByUrl } from '@/utils/downloadFile'
defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const userStore = useUserStore()
const detailCon = ref({})
const selectedKeys = ref([])
const renTime = ref([])
const store_price = userStore.userInfo.store_price || 0
const currentToken = userStore.token
const columns = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex)
  },
  { title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '合同金额', align: 'center', dataIndex: 'apply_money', ellipsis: true, tooltip: true },
  { title: '总放款金额', align: 'center', dataIndex: 'pay_price', ellipsis: true, tooltip: true },
  { title: '联系人', align: 'center', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '联系电话', align: 'center', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '期数', align: 'center', dataIndex: 'loan_time', ellipsis: true, tooltip: true },
  { title: '交易时间', align: 'center', dataIndex: 'create_time', ellipsis: true, tooltip: true },
  { title: '交易类型', align: 'center', slotName: 'type', ellipsis: true, tooltip: true },
  { title: '交易金额(元)', align: 'center', slotName: 'money', ellipsis: true, tooltip: true }
]

const position = ref('right')

const queryForm = reactive({
  type: '',
  start_time: '',
  end_time: '',
  name: '',
  mobile: '',
  contract_num: ''
})

function timechange(e) {
  if(!e){
			queryForm.start_time = ''
			queryForm.end_time = ''
		}else{
			queryForm.start_time = e[0]
			queryForm.end_time = e[1]
		}
  search()
}
const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    getStorePriceLogList({
      post_params: {
        ...queryForm,
        currentPage: p.page,
        perPage: p.size
      }
    }),
  { immediate: true }
)

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
})
const Goods = ref([{
  label: '充值',
  value: 'a'
},
{
  label: '续费',
  value: 'b'
}, {
  label: '公证支出',
  value: 'c'
}, {
  label: '交易手续费',
  value: 'd'
}, {
  label: '连连充值手续费',
  value: 'e'
}, {
  label: '连连代付手续费',
  value: 'f'
}
])
function selectionChange(e) {
  selectedKeys.value = e
}

//打开弹窗
const showModal1 = (item) => {
  detailCon.value = item
  open1.value = true
}

//导出
async function downloadExcel() {
  try {
    const response = await getStorePriceLogList({
      post_params: {

        currentPage: 1,
        perPage: 99999
      }
    });

    if (response.data.list.length == 0) return Message.error('暂无信息')
    // 转换数据为二维数组
    response.data.list = response.data.list.map((item) => {
      return {
        contract_num: item.contract_num,
        create_time: item.create_time,
        name: item.name,
        mobile: item.mobile,
        money: item.type == 'a' || item.type == 'b' ? '+' + item.money : '-' + item.money,
        loan_time: item.loan_time,
        type: item.type == 'a' ? '充值' : item.type == 'b' ? '续费' : item.type == 'c' ?
          '公证支出' : item.type == 'd' ? '交易手续费' : item.type == 'e' ? '连连充值手续费 ' : '连连代付手续费'
      }
    })
    const formattedData = response.data.list.map(item => [
      item.contract_num,
      item.name,
      item.mobile,
      item.loan_time,
      item.type,
      item.money,
      item.create_time
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([[
      '合同编号', '联系人', '联系电话', '期数', '交易类型', '交易金额', '交易时间'
    ], ...formattedData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  } catch (error) {
    console.error('下载失败:', error);
  }
}
// 重置
const reset = () => {
  queryForm.start_time = ''
  queryForm.end_time = ''
  queryForm.type = ''
  queryForm.name = ''
  queryForm.mobile = ''
  queryForm.contract_num = ''
  renTime.value = []
  search()
}


//关闭
const handleOk = () => {
  loading.value = false
  open.value = false
}

onMounted(() => {
  //   checkerOrder()

})
</script>

<style lang="scss" scoped>
.name {
  width: 130px;
  text-align: right;
  margin-right: 10px;
  font-weight: 800;
  margin-top: 8px;
}

.money {
  text-align: left;
  margin-left: 10px;
  font-weight: 400;
  margin-top: 8px;
}

.grid-demo2 .arco-col {
  margin-bottom: 10px;
}

.ntrlist {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 20px;
  line-height: 20px;
  color: #000;
  font-size: 12px;

  .ntt_name {
    font-weight: 800;
  }
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
