<template>
  <div>
    <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 3000 }" :pagination="pagination"
      :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
      <template #custom-left>
        <a-row class="grid-demo2" :gutter="24">
          <a-col :span="8">
            <div style="display: flex">
              <div class="name">主体名称</div>
              <a-input v-model="queryForm.name" placeholder="请输入主体名称" allow-clear @change="search">
                <template #prefix></template>
              </a-input>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex">
              <div class="name">联系人</div>
              <a-input v-model="queryForm.user_name" placeholder="请输入联系人" allow-clear @change="search">
                <template #prefix></template>
              </a-input>
            </div>
          </a-col>

          <a-col :span="8">
            <div style="display: flex">
              <div class="name">产品名称</div>
              <a-cascader :options="Goods" v-model="queryForm.goods_id" placeholder="请选择产品名称" @change="search" />
            </div>
          </a-col>
          <a-col :span="8" v-if="isExpanded">
            <div style="display: flex">
              <div class="name">产品对象</div>
              <a-cascader :options="GoodsdxList" v-model="queryForm.type" placeholder="请选择产品对象" @change="search" />
            </div>
          </a-col>
          <a-col :span="8" v-if="isExpanded">
            <div style="display: flex">
              <div class="name">产品类型</div>
              <a-cascader :options="GoodstypeList" v-model="queryForm.goods_type" placeholder="请选择产品类型"
                @change="search" />
            </div>
          </a-col>

          <a-col :span="8" v-if="isExpanded">
            <div style="display: flex">
              <div class="name">合同编号</div>
              <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
                <template #prefix></template>
              </a-input>
            </div>
          </a-col>
          <a-col :span="8" v-if="isExpanded">
            <div style="display: flex">
              <div class="name">联系电话</div>
              <a-input v-model="queryForm.user_mobile" placeholder="请输入联系电话" allow-clear @change="search">
                <template #prefix></template>
              </a-input>
            </div>
          </a-col>

          <a-col :span="8">
            <div style="display: flex; margin-left: 40px">
              <div class="name">进件时间</div>
              <!-- <a-date-picker v-model="queryForm.create_time" @change="search" /> -->
              <DateRangePicker v-model="renTime" @change="timechange" :show-time="false" format="YYYY-MM-DD" />
            </div>
          </a-col>
          <a-col :span="2">
            <a-button @click="reset">重置</a-button>
          </a-col>

          <div class="btn" @click="expandMore">{{ isExpanded ? '收起' : '展开更多' }}</div>
        </a-row>
      </template>
      <template #status="{ record }">
        {{
          record.status == 'a'
            ? '填单中'
            : record.status == 'b'
              ? '审核中'
              : record.status == 'c'
                ? '签约中 '
                : record.status == 'd'
                  ? '公证中'
                  : record.status == 'e'
                    ? '放款中'
                    : record.status == 'f'
                      ? '业务完成,转债中'
                      : record.status == 'g'
                        ? '流程完结'
                        : record.status == 'z'
                          ? '订单作废'
                          : ''
        }}
      </template>

      <template #type="{ record }">
        {{
          record.type == 'person'
            ? '个人'
            : record.type == 'company'
              ? '企业 '
              : ''
        }}
      </template>
      <template #goods_type="{ record }">
        {{
          record.goods_type == 'borrow'
            ? '借款'
            : record.goods_type == 'mortgage'
              ? '抵押 '
              : ''
        }}
      </template>


      <template #action="{ record }">
        <a-space>
          <a-link @click="showModal(record)">详情</a-link>
          <a-link @click="showModal2(record)">查看合同详情</a-link>
        </a-space>
      </template>
    </GiTable>
    <a-modal :visible="open" title="详情" @ok="handleOk" width="40%" @cancel="open = false">
      <div>
        <iframe :src="detailCon?.detail_url" width="100%" height="600px" frameborder="0"></iframe>
      </div>
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" @click="open = false">关闭</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open1" title="合同详情" @ok="handleOk" width="80%" @cancel="open1 = false">
      <div>
        <GiTable row-key="id" :data="dataList1" :columns="columns3" :loading="loading"
          :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
          :disabledTools="['fullscreen', 'refresh', 'size', 'setting']">
          <template #action="{ record }">
            <a-space> <a-link @click="showdownload(record)">下载合同</a-link> </a-space>
          </template>
        </GiTable>
      </div>
      <template #footer>
        <a-button key="back" @click="open1 = false">取消</a-button>
        <a-button key="submit" type="primary" @click="open1 = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { storeGetOrderList, storeGetOrderDetail, storeGetGoodsList } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { DisEnableStatusList } from '@/constant/common'
const isExpanded = ref(false) // 控制是否展开
const userStore = useUserStore()
const detailCon: any = ref()
const dataList1: any = ref([])
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const Goods = ref([])
const renTime = ref([])
function timechange(e) {
  // console.log('1',e);
  if(!e){
			queryForm.start_time = ''
			queryForm.end_time = ''
		}else{
			queryForm.start_time = e[0]
			queryForm.end_time = e[1]
		}
  search()
}
const GoodsdxList = ref([
  {
    value: 'person',
    label: '个人',

  },
  {
    value: 'company',
    label: '企业',

  }
])
const GoodstypeList = ref([
  {
    value: 'borrow',
    label: '借款 ',

  },
  {
    value: 'mortgage',
    label: '抵押',

  }
])

const currentToken = userStore.token
const columns3: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '合同链接', align: 'center', dataIndex: 'url', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '进件时间', align: 'center', dataIndex: 'create_time', ellipsis: true, tooltip: true },
  { title: '进度', align: 'center', slotName: 'status', ellipsis: true, tooltip: true },
  { title: '产品名称', align: 'center', dataIndex: 'goods_name', ellipsis: true, tooltip: true },
  { title: '产品对象', align: 'center', slotName: 'type', ellipsis: true, tooltip: true },
  { title: '产品类型', align: 'center', slotName: 'goods_type', ellipsis: true, tooltip: true },
  { title: '主体名称', align: 'center', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '联系人', align: 'center', dataIndex: 'user_name', ellipsis: true, tooltip: true },
  { title: '联系电话', align: 'center', dataIndex: 'user_mobile', ellipsis: true, tooltip: true },
  { title: '贷款金额', align: 'center', dataIndex: 'apply_money', ellipsis: true, tooltip: true },
  { title: '期数', align: 'center', dataIndex: 'loan_time', ellipsis: true, tooltip: true },
  { title: '利率', align: 'center', dataIndex: 'loan_rate', ellipsis: true, tooltip: true },
  { title: '已放款金额', align: 'center', dataIndex: 'payed_money', ellipsis: true, tooltip: true },
  { title: '待放款金额', align: 'center', dataIndex: 'wait_pay_money', ellipsis: true, tooltip: true },
  { title: '放款中金额', align: 'center', dataIndex: 'paing_money', ellipsis: true, tooltip: true },
{ title: '部门', align: 'center', dataIndex: 'dpt_name', ellipsis: true, tooltip: true },
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
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '借贷人的手机号', align: 'center', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '担保人类型 ', align: 'center', slotName: 'type', ellipsis: true, tooltip: true },
  { title: '融担方名称', align: 'center', dataIndex: 'name', ellipsis: true, tooltip: true },
  {
    title: '个人身份证号 / 企业统一社会信用代码 ',
    align: 'center',
    dataIndex: 'card_number',
    ellipsis: true,
    tooltip: true
  },

  {
    title: '身份证正面照 url  ',
    align: 'center',
    slotName: 'personidcardimagefront',
    ellipsis: true,
    tooltip: true
  },
  { title: '身份证反面照片 url  ', align: 'center', slotName: 'personidcardimage_back', width: 180 },
  {
    title: '身份证号有效期  ',
    align: 'center',
    dataIndex: 'person_idcard_end_time',
    width: 180,
    ellipsis: true,
    tooltip: true
  },
  {
    title: '与借贷人关系   ',
    align: 'center',
    dataIndex: 'person_relationship',
    width: 180,
    ellipsis: true,
    tooltip: true
  },
  { title: '婚姻状态  ', align: 'center', dataIndex: 'person_marriage', ellipsis: true, width: 180, tooltip: true },
  { title: '居住城市  ', align: 'center', dataIndex: 'person_city_address', ellipsis: true, width: 180, tooltip: true },
  { title: '详细地址', align: 'center', dataIndex: 'person_address', ellipsis: true, width: 180, tooltip: true },
  {
    title: '营业执照照片 url ',
    align: 'center',
    slotName: 'companylicenseimage',
    width: 180,
    ellipsis: true,
    tooltip: true
  },
  { title: '营业期限   ', align: 'center', dataIndex: 'company_end_time', ellipsis: true, width: 180, tooltip: true },
  { title: '办公城市  ', align: 'center', dataIndex: 'company_work_city', ellipsis: true, width: 180, tooltip: true },
  {
    title: '办公地址   ',
    align: 'center',
    dataIndex: 'company_work_address',
    ellipsis: true,
    width: 180,
    tooltip: true
  },
  { title: '法人姓名  ', align: 'center', dataIndex: 'company_leader_name', ellipsis: true, width: 180, tooltip: true },
  {
    title: '法人与借贷人关系   ',
    align: 'center',
    width: 180,
    dataIndex: 'company_leader_relationship',
    ellipsis: true,
    tooltip: true
  },

  {
    title: '法人证件类型   ',
    align: 'center',
    width: 180,
    dataIndex: 'company_leader_card_type',
    ellipsis: true,
    tooltip: true
  },
  {
    title: '法人证件号码  ',
    width: 180,
    align: 'center',
    dataIndex: 'company_leader_card_number',
    ellipsis: true,
    tooltip: true
  },

  { title: '操作', align: 'center', dataIndex: 'linkmanTypeLV', width: 180 }
]
const num = ref(0)

const queryForm = reactive({
  status: 'e',
  contract_num: '',
  // create_time: '',
  check_status: '',
  pay_status: '',
  notarization_status: '',
  goods_id: '',
  type: '',
  goods_type: '',
  name: '',
  user_name: '',
  user_mobile: ''
})
const List = reactive([{ name: '合同基本信息' }, { name: '客户详细信息' }, { name: '融担方信息' }])
const detail = (i) => {
  num.value = i
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

//打开弹窗
const showModal = (record) => {
  detailCon.value = record
  open.value = true
}

const GoodsList = async () => {
  try {
    const res = await storeGetGoodsList()
    console.log(res.data.datas, 'eeeeeeeeeee')
    Goods.value = res.data.datas
    return true
  } catch (error) {
    return false
  }
}
//合同详情
function showModal2(item) {
  // contract_pdf.value = item.contract_pdf


  const list = item.contract_pdf.map((item1) => {
    return {
      contract_num: item.contract_num,
      url: item1
    }
  })
  dataList1.value = list

  open1.value = true
  console.log(open1.value)
}
//关闭
const handleOk = () => {
  open.value = false
}
// 重置
const reset = () => {
  queryForm.contract_num = ''
  // queryForm.create_time = ''
  queryForm.check_status = ''
  queryForm.pay_status = ''
  queryForm.notarization_status = ''
  queryForm.goods_id = ''
  queryForm.type = ''
  queryForm.goods_type = ''
  queryForm.name = ''
  queryForm.user_name = ''
  queryForm.user_mobile = ''
  renTime.value = []
  queryForm.start_time = ''
  queryForm.end_time = ''
  search()
}
//展开
const expandMore = () => {
  console.log(isExpanded.value)
  isExpanded.value = !isExpanded.value // 将展开状态设置为true
}
//下载
function showdownload(item) {
  if (item.url.length == 0) return Message.error('暂无合同记录')
  // 生成或获取文件 URL 
  const fileUrl = item.url
  // 创建一个临时链接
  const link = document.createElement('a');
  link.href = fileUrl;
  // link.download = 'filename.ext'; // 可选，指定下载的文件名
  link.click();
}
GoodsList()
</script>

<style lang="scss" scoped>
.name {
  width: 130px;
  text-align: right;
  margin-right: 10px;
  font-weight: 800;
  margin-top: 8px;
}

.grid-demo2 .arco-col {
  margin-bottom: 10px;
}

.btn {
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  margin-left: 20px;
  color: rgb(var(--primary-6));
  margin-top: 10px;
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
