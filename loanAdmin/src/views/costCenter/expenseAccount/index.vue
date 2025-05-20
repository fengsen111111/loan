<template>
  <div class="gi_page">
    <a-card class="general-card-a">
      <div class="cost_detail">
        <a-row>
          <a-col
            :span="12"
            style="display: flex; justify-content: space-around; height: 70px; border-right: 1px solid #7c7676"
          >
            <div class="cost_detail-a">
              <div class="title">可用余额</div>
              <div class="price">5555555</div>
            </div>
            <a-button type="primary" @click="search" size="small">
              <span>充值</span>
            </a-button>
          </a-col>
          <a-col :span="12" style="padding-left: 30px">
            <div class="cost_detail-a">
              <div class="title">可开票金额</div>
              <div class="price">5555555</div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card class="general-card-b">
      <div class="card-b">
        <div class="title"></div>
        <div class="time">2024-07 账单分类汇总-未出账</div>
      </div>
      <VCharts :option="option" autoresize :style="{ height: '280px', width: '80%' }"></VCharts>
    </a-card>
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
      </GiTable>
    </a-card>
    <a-modal :visible="open" title="充值" @ok="handleOk" @cancel="open = false" width="80%">
      <div>
        <a-collapse :default-active-key="['1']" :accordion="true">
          <a-collapse-item header="付款方信息" key="1">
            <a-row class="grid-demo2">
              <a-col :span="12" style="display: flex">
                <div class="name" style="width: 50px">付款方</div>
                <a-cascader
                  :options="capitalList"
                  :field-names="fieldNames"
                  v-model="queryForm.capital_id"
                  placeholder="请选择付款方"
                />
              </a-col>
            </a-row>
          </a-collapse-item>
        </a-collapse>
        <a-collapse :default-active-key="['2']" :accordion="true">
          <a-collapse-item header="收款方信息" key="2">
            <a-row class="grid-demo2">
              <a-col :span="12"> <div class="name">收款方账户名称 333333333</div> </a-col>
              <a-col :span="12"> <div class="name">收款方子账户 4444</div> </a-col>
              <a-col :span="12"> <div class="name">收款方电子账户 5555</div> </a-col>
            </a-row>
          </a-collapse-item>
        </a-collapse>
        <a-collapse :default-active-key="['3']" :accordion="true">
          <a-collapse-item header="充值信息" key="3">
            <a-row class="grid-demo3">
              <a-col :span="24" style="margin-top: 40px; margin-bottom: 40px">
                <div style="display: flex">
                  <div class="name">转帐金额</div>
                  <a-input-number
                    :style="{ width: '220px' }"
                    placeholder="请输入充值金额"
                    :default-value="0"
                    mode="button"
                    class="input-demo"
                  />

                  <p>可用余额：￥<span>0</span>元</p>
                  <p style="color: blue">全部转出</p>
                </div>
              </a-col>
              <a-col :span="24">
                <div style="display: flex; margin-left: 5px">
                  <div class="name">交易附言</div>
                  <a-textarea placeholder="请输入交易附言" allow-clear />
                </div>
              </a-col>
            </a-row>
          </a-collapse-item>
        </a-collapse>
      </div>
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { listOnlineUser, kickout, getStoreCapitalList } from '@/apis'
import VCharts from 'vue-echarts'
import { graphic } from 'echarts'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useUserStore } from '@/stores'
import { useTable, useChart } from '@/hooks'
const open = ref(true)
const capitalList = ref([])
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
  { title: '用户昵称', slotName: 'nickname', ellipsis: true, tooltip: true },
  { title: '登录 IP', dataIndex: 'ip', ellipsis: true, tooltip: true },
  { title: '登录地点', dataIndex: 'address', ellipsis: true, tooltip: true },
  { title: '浏览器', dataIndex: 'browser', ellipsis: true, tooltip: true },
  { title: '终端系统', dataIndex: 'os', ellipsis: true, tooltip: true },
  { title: '登录时间', dataIndex: 'loginTime', width: 180 }
]

const queryForm = reactive<OnlineUserQuery>({
  sort: ['createTime,desc']
})
var color = ['#00FFFC', '#FFC400', '#99D155', '#1AD979', '#3D99E8', '#FF8D3A']
var nameList = ['轮式拖拉机', '稻麦收割机', '烘干机', '插秧机', '无人机', '其它收割机']
let datas = [{ value: 40, name: '轮式拖拉机' }]
const rich = {
  title: {
    color: '#000',
    fontSize: 17
  },
  titleUnit: {
    color: '#000',
    fontSize: 16,
    padding: [10, 0, 0, 0]
  },
  titleValue: {
    color: 'rgba(0, 255, 252, 1)',
    fontSize: 24,
    fontWeight: 700,
    padding: [15, 5, 5, 5]
  }
}
const title = {
  name: '费用合计',
  value: 263,
  unit: '￥'
}

const { option } = useChart(() => {
  return {
    color,

    legend: {
      bottom: '42%',
      right: '10%',
      orient: 'vertical',
      data: datas,
      icon: 'square',
      itemWith: 10,
      itemHeight: 10,
      itemGap: 12,
      // padding: [5, 10, 5, 0],
      formatter(name) {
        console.log(name)
        debugger
        const item = datas.filter((item) => item.name === name)[0]
        return `{name|${name}}{value1| ${item.value + '%}'}{value1| ${item.value + '元}'}`
      },
      textStyle: {
        rich: {
          name: {
            color: '#000',
            fontSize: 14,
            width: 100
          },
          value1: {
            color: '#000',
            fontSize: 14,
            width: 66
          }
        }
      }
    },
    series: [
      {
        name: '情况',
        type: 'pie',
        center: ['35%', '50%'],
        radius: ['60%', '50%'],
        clockwise: false, //饼图的扇区是否是顺时针排布
        avoidLabelOverlap: false,
        labelLine: {
          normal: {
            length: 15,
            length2: 13,
            smooth: true
          }
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => `{title|${title.name}}\n{titleUnit|${title.unit}}{titleValue|${title.value}}`,
          rich
        },
        data: datas
      }
    ]
  }
})
const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable((p) => listOnlineUser({ ...queryForm, currentPage: p.page, perPage: p.size }), { immediate: true })

// 重置
const reset = () => {
  queryForm.nickname = undefined
  queryForm.loginTime = undefined
  search()
}
//获取付款方
const CapitalList = async () => {
  try {
    const res = await getStoreCapitalList()
    capitalList.value = res.data.list

    return true
  } catch (error) {
    return false
  }
}
onMounted(() => {
  CapitalList()
})
</script>

<style lang="scss" scoped>
.general-card-a {
  height: 100px;
  margin-bottom: 20px;
  .cost_detail-a {
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .price {
      color: #0c08f3;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.general-card-b {
  height: 300px;
  margin-bottom: 20px;
  .card-b {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #9e9d9d;
    display: flex;
    .title {
      height: 20px;
      width: 2px;
      background-color: #0c08f3;
      margin: auto 0;
      margin-right: 10px;
    }
  }
}

.grid-demo2 {
  .name {
    margin-right: 10px;

    margin-top: 8px;
    font-size: 12px;
    font-weight: 400;
  }
}
.grid-demo3 {
  .name {
    width: 80px;
    font-size: 12px;
    font-weight: 400;
  }
  p {
    margin-top: 5px;
    margin-right: 50px;
    margin-left: 40px;
  }
}
.btn {
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  margin-left: 20px;
  color: rgb(var(--primary-6));
}
</style>
