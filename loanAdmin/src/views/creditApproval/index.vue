<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading" :row-selection="rowSelection"
        @selection-change="selectionChange" :scroll="{ x: '100%', y: '100%', minWidth: 3000 }" :pagination="pagination"
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
            <a-col :span="8">
              <div style="display: flex">
                <div class="name">产品对象</div>
                <a-cascader :options="GoodsdxList" v-model="queryForm.type" placeholder="请选择产品对象" @change="search" />
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex">
                <div class="name">产品类型</div>
                <a-cascader :options="GoodstypeList" v-model="queryForm.goods_type" placeholder="请选择产品类型"
                  @change="search" />
              </div>
            </a-col>

            <a-col :span="8">
              <div style="display: flex">
                <div class="name">合同编号</div>
                <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
                  <template #prefix></template>
                </a-input>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex">
                <div class="name">联系电话</div>
                <a-input v-model="queryForm.user_mobile" placeholder="请输入联系电话" allow-clear @change="search">
                  <template #prefix></template></a-input>
              </div>
            </a-col>

            <a-col :span="12">
              <div style="display: flex; margin-left: 28px">
                <div class="name">进件时间</div>
                <a-date-picker v-model="queryForm.create_time" @change="search" />
              </div>
            </a-col>
            <a-col :span="24">
              <a-button @click="reset">重置</a-button>
            </a-col>

            <a-col :span="8" v-for="(item, i) in listv" :key="i" class="btn" @click="btn(item)">
              <a-button :type="numbtn == item.id ? 'primary' : 'outline'" long>
                {{ item.name }}
                <div class="ntred">{{ item.num }}</div>
              </a-button>
            </a-col>
            <a-col :span="24">
              <!-- --{{isGl}}-- -->
              <a-button @click="hasOrder" type="primary" v-if="numbtn == 2 && isGl">批量抢件</a-button>
              <a-button @click="hasRw" type="primary" v-if="numbtn == 1 && isGl">批量退回</a-button>
            </a-col>
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
        <template #check_status="{ record }">
          {{
            record.status == 'a'
              ? '待资料审核'
              : record.status == 'b'
                ? '资料审核通过'
                : record.status == 'c'
                  ? '风险审核通过 '
                  : record.status == 'd'
                    ? '合同审核通过'
                    : record.status == 'z'
                      ? '拒绝 '
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
            <a-link :disabled="currentToken === record.token" v-if="numbtn == 1 && isGl" @click="showModal1(record)">
              审核
            </a-link>
            <a-link :disabled="currentToken === record.token" v-if="numbtn == 2 && isGl" @click="renOrder(record)">
              认领
            </a-link>
            <a-link :disabled="currentToken === record.token" @click="showModal(record)"> 详情 </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>
    <a-modal :visible="open" title="详情" @ok="handleOk" width="40%" @cancel="open = false">
      <div>
        <iframe :src="detailCon?.detail_url" width="100%" height="600px" frameborder="0"></iframe>
      </div>
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" @click="open = false">关闭</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open1" title="审核订单" @ok="handleOk" width="80%" @cancel="open1 = false">
      <div>
        <a-row class="grid-demo1">
          <a-col :span="24">
            <div><span>合同编号</span>{{ detailCon?.contract_num }}</div>
          </a-col>
          <a-col :span="24">
            <div>
              <span>驳回理由 </span>
              <a-textarea placeholder="请输入驳回理由" v-model="reject_des" :max-length="255" allow-clear show-word-limit />
            </div>
          </a-col>
        </a-row>
      </div>
      <template #footer>
        <a-button key="back" @click="handleOk2">取消</a-button>
        <a-button key="back " type="primary" @click="CheckOrder('a')">审核通过</a-button>
        <a-button key="back " type="warning" @click="CheckOrder('b')">审核拒绝 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  storeGetOrderList,
  checkerOrderSta,
  storeCheckOrder,
  storeGetGoodsList,
  storeGetOrderDetail,
  storeHasOrder,
  getUserInfo
} from '@/apis'
import { Message, Modal } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { api as viewerApi } from 'v-viewer'
defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const userStore = useUserStore()
const detailCon = ref({})
const selectedKeys = ref([])
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
// console.log('进入页面');
const isGl = ref(false)
const _getUserInfo = async () => {
  try {
    const res = await getUserInfo({})
    // console.log(res.data.role_ids)
    if(res.data.role_ids.indexOf('2')!='-1'){
      isGl.value = true
    }else{
      isGl.value = false
    }
  } catch (error) {
    return false
  }
}
_getUserInfo()

const currentToken = userStore.token
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
  { title: '审核状态', align: 'center', slotName: 'check_status', ellipsis: true, tooltip: true },
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

const listv = ref([
  {
    name: '待办队列',
    id: 1,
    type: 'b',
    num: 0
  },
  {
    name: '待抢队列',
    id: 2,
    type: 'a',
    num: 0
  },
  {
    name: '已办队列',
    id: 3,
    type: 'c',
    num: 0
  }
])
const position = ref('right')
const num = ref(0)
const numbtn = ref(1)
const reject_des = ref('')
const queryForm = reactive({
  contract_num: '',
  create_time: '',
  status: 'b',
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
function btn(item) {
  numbtn.value = item.id
  queryForm.status = item.type
  dataList.value = []
  search()
}
const Goods = ref([])
function selectionChange(e) {
  selectedKeys.value = e
}
//获取
const checkerOrder = async () => {
  try {
    const res = await checkerOrderSta({})
    // console.log(res, 'eeeeeeeeeee')
    listv.value[0].num = res.data.status_c_number
    listv.value[1].num = res.data.status_b_number
    listv.value[2].num = res.data.complete_number
    return true
  } catch (error) {
    return false
  }
}

//打开弹窗
const showModal1 = (item) => {
  detailCon.value = item
  open1.value = true
}
const GoodsList = async () => {
  try {
    const res = await storeGetGoodsList()
    // console.log(res.data.datas, 'eeeeeeeeeee')
    Goods.value = res.data.datas

    return true
  } catch (error) {
    return false
  }
}
//审核订单
const CheckOrder = async (item) => {
  if (reject_des.value.length == 0 && item == 'b') return Message.error('请输入拒绝理由')
  try {
    const res = await storeCheckOrder({
      post_params: { order_ids: [detailCon.value.id], status: item, reject_des: reject_des.value }
    })
    open1.value = false
    search()
    Message.success('审核订单成功')
    checkerOrder()
    reject_des.value = ''
    return true
  } catch (error) {
    return false
  }
}
//批量退回
const hasRw = async (item) => {
  if (selectedKeys.value.length == 0 && item == 'b') return Message.error('请选择批量退回数据')
  try {
    const res = await storeCheckOrder({
      post_params: { order_ids: selectedKeys.value, status: 'b' }
    })
    open1.value = false
    search()
    Message.success('审核订单成功')
    checkerOrder()
    return true
  } catch (error) {
    return false
  }
}
//合同批量下载
const installContatrt = () => { }
//抢单
const hasOrder = async () => {
  if (selectedKeys.value.length == 0) return

  try {
    const res = await storeHasOrder({
      post_params: { order_ids: selectedKeys.value }
    })

    Message.success('抢单成功')
    search()
    checkerOrder()
    return true
  } catch (error) {
    return false
  }
}

//认领
const renOrder = async (item) => {
  try {
    const res = await storeHasOrder({
      post_params: { order_ids: [item.id] }
    })

    Message.success('抢单成功')
    search()
    checkerOrder()
    return true
  } catch (error) {
    return false
  }
}
// 点击文件
const handleClickFile = (item) => {
  const imgList = reactive([item])
  // const index = imgList.findIndex((i) => i === item.url)
  if (imgList.length) {
    viewerApi({
      // options: {
      //   initialViewIndex: index
      // },
      images: imgList
    })
  }
}
// 重置
const reset = () => {

  queryForm.contract_num = ''
  queryForm.create_time = ''
  queryForm.check_status = ''
  queryForm.pay_status = ''
  queryForm.notarization_status = ''
  queryForm.goods_id = ''
  queryForm.type = ''
  queryForm.goods_type = ''
  queryForm.name = ''
  queryForm.user_name = ''
  queryForm.user_mobile = ''
  search()
}
//打开弹窗
const showModal = async (item) => {

  detailCon.value = item
  open.value = true
}

//关闭
const handleOk = () => {
  loading.value = false
  open.value = false
}
const handleOk2 = () => {
  reject_des.value = ''
  open1.value = false
}
onMounted(() => {
  checkerOrder()
  GoodsList()
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

.grid-demo2 .arco-col {
  margin-bottom: 10px;
}

.ntred {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background-color: red;
  color: #fff;
  font-size: 12px;
  position: absolute;
  right: 30px;
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
