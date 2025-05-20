<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
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
            <div class="name">接收债权方</div>
            <a-cascader :options="capitalList" :field-names="fieldNames" v-model="queryForm.capital_id"
              placeholder="请选择接收债权方" />
          </div>
          <div style="display: flex">
            <div class="name" style="width: 200px; margin-left: -20px">债权转让完成时间</div>
            <DateRangePicker v-model="loginTime" @change="search" />
          </div>
          <a-button @click="reset">重置</a-button>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}（{{ record.username }}）</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="showModel(record)"> 详情 </a-link>
          </a-space>
        </template>
      </GiTable>
      <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
        <div style="display: flex">
          <div class="mpdal_left">
            <div v-for="(item, i) in List" :key="i" style="margin-bottom: 20px" @click="detail(i)">
              <a-button style="width: 150px" type="primary" v-if="i == num">{{ item.name }}</a-button>
              <a-button v-else style="width: 150px">{{ item.name }}</a-button>
            </div>
          </div>
          <div class="mpdal_right">
            <div v-if="num == 0" style="width: 100%">
              <a-row class="grid-demo">
                <a-col :span="12">
                  <div><span> 合同编号</span> {{ detailCon?.contract_num }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>业务申请编号</span> {{ detailCon?.id }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>合同金额</span> {{ detailCon?.order_material?.apply_money }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>产品名称</span> {{ detailCon?.order_material?.goods_name }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>客户名称</span>{{ detailCon?.businesser_name }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>客户联系方式</span>{{ detailCon?.mobile }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>客户证件类型</span> {{ detailCon?.card_type }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>客户证件号码</span>{{ detailCon?.card_number }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>还款方式</span>{{ detailCon?.order_material?.repayment_type }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>申请期数</span>{{ detailCon?.order_material?.loan_time }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>执行年利率（%）</span>{{ detailCon?.order_material?.loan_rate }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>期数类型</span>{{ detailCon?.order_material?.loan_time_type }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>申请借款用途</span>{{ detailCon?.order_material?.use_type }}</div>
                </a-col>

                <a-col :span="12">
                  <div><span>争议解决方式</span>-</div>
                </a-col>

                <a-col :span="12">
                  <div><span>仲裁机构(全称)</span>-</div>
                </a-col>
              </a-row>
            </div>
            <div v-if="num == 1" style="width: 100%">
              <a-collapse :default-active-key="['1']" :accordion="true">
                <a-collapse-item :header="`签约人：${detailCon?.businesser_name}`" key="1">
                  <a-row class="grid-demo">
                    <a-col :span="8">
                      <div><span>客户姓名</span>{{ detailCon?.businesser_name }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div><span>客户手机号码</span>{{ detailCon?.mobile }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div><span>客户证件号码</span>{{ detailCon?.card_number }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div><span>客户证件类型</span> {{ detailCon?.card_type }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div><span>签约时间</span>{{ detailCon?.signTime }}</div>
                    </a-col>

                    <a-col :span="24">
                      <div style="display: flex; margin-bottom: -40px">
                        <div class="idcard">
                          <div class="idcarda">
                            <img :src="detailCon?.sign_image" alt="" />
                            <div>签名</div>
                          </div>
                          <!-- <div class="idcarda">
                            <img :src="item.faceUrl" alt="" />
                            <div>人脸识别影像</div>
                          </div> -->
                          <div class="idcarda">
                            <a-image width="100" :src="detailCon?.person_id_card_image_front" alt="" />
                            <div>证件正面照</div>
                          </div>
                          <div class="idcarda">
                            <a-image width="100" :src="detailCon?.person_id_card_image_back" alt="" />
                            <div>证件反面照</div>
                          </div>
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                </a-collapse-item>
              </a-collapse>
              <a-space direction="vertical" :style="{ width: '100%' }"
                v-for="(item, i) in detailCon?.order_material?.other_persons" :key="i">
                <a-collapse :default-active-key="['1']" :accordion="true">
                  <a-collapse-item :header="`签约人：${item.name}`" key="1">
                    <a-row class="grid-demo" v-if="item.type == 'person'">
                      <a-col :span="8">
                        <div><span>客户姓名</span>{{ item.name }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户手机号码</span>{{ item.person_mobile }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户证件号码</span>{{ item.card_number }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户证件类型</span> {{ item.card_type }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>签约时间</span>{{ item.signTime }}</div>
                      </a-col>

                      <a-col :span="24">
                        <div style="display: flex; margin-bottom: -40px">
                          <div class="idcard">
                            <!-- <div class="idcarda">
                            <img :src="`data:image/png;base64,${item.sealData}`" alt="" />
                            <div>签名</div>
                          </div> -->
                            <!-- <div class="idcarda">
                            <img :src="item.faceUrl" alt="" />
                            <div>人脸识别影像</div>
                          </div> -->
                            <div class="idcarda">
                              <a-image width="100" :src="item.person_id_card_image_front" alt="" />
                              <div>证件正面照</div>
                            </div>
                            <div class="idcarda">
                              <a-image width="100" :src="item.person_id_card_image_back" alt="" />
                              <div>证件反面照</div>
                            </div>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                    <a-row class="grid-demo" v-else>
                      <a-col :span="8">
                        <div><span>客户姓名</span>{{ item.company_leader_name }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户手机号码</span>{{ item.mobile }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户证件号码</span>{{ item.card_number }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>客户证件类型</span> {{ item.company_leader_card_type }}</div>
                      </a-col>
                      <a-col :span="8">
                        <div><span>签约时间</span>{{ item.signTime }}</div>
                      </a-col>

                      <a-col :span="24">
                        <div style="display: flex; margin-bottom: -40px">
                          <div class="idcarda">
                            <a-image width="100" :src="item.company_license_image" alt="" />
                            <div>证件正面照</div>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </a-collapse-item>
                </a-collapse>
              </a-space>
            </div>
            <div v-if="num == 2" style="width: 100%">
              <div style="width: 100%">
                <GiTable row-key="id" :data="detailCon?.order_material?.guarantee_persons" :columns="columns2"
                  :loading="loading" :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                  :disabledTools="['fullscreen', 'refresh', 'size', 'setting']">
                  <template #personidcardimagefront="{ record }">
                    <a-image width="100" :src="record.person_id_card_image_front" alt="" />
                  </template>
                  <template #nperson_idcardimageback="{ record }">
                    <a-image width="100" :src="record.person_id_card_image_back" alt="" /></template>
                  <template #companylicenseimage="{ record }">
                    <a-image width="100" :src="record.company_license_image" alt="" /></template>
                </GiTable>
              </div>
            </div>
          </div>
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
import { waitSureMoveList, getStoreCapitalList, submitMove } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
const loginTime = ref([])
const List = reactive([{ name: '合同基本信息' }, { name: '客户详细信息' }, { name: '融担方信息' }])
const capitalList = ref([])
const fieldNames = { value: 'name', label: 'name' }
const userStore = useUserStore()
const currentToken = userStore.token
const detailCon = ref()
const open = ref<boolean>(false)
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true, width: 180 },
  { title: '转债确认单编号  ', dataIndex: 'move_num', ellipsis: true, tooltip: true, width: 180 },
  { title: '客户姓名  ', dataIndex: 'name', ellipsis: true, width: 180, tooltip: true },
  { title: '证件号码  ', dataIndex: 'card_number', ellipsis: true, tooltip: true, width: 180 },
  { title: '证件类型', dataIndex: 'card_type', ellipsis: true, tooltip: true, width: 180 },
  { title: '申请金额 ', dataIndex: 'apply_money', width: 180 },
  { title: '助贷方名称 ', dataIndex: 'capital_name', width: 180 },
  { title: '确认时间 ', dataIndex: 'sure_time', width: 180 },
  { title: '确认人  ', dataIndex: 'worker_name', width: 180 },
  {
    width: 180,
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive({
  move_status: 'c',
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
onMounted(() => {
  CapitalList()
})

//获取接收债权方
const CapitalList = async () => {
  try {
    const res = await getStoreCapitalList()
    capitalList.value = res.data.list

    return true
  } catch (error) {
    return false
  }
}
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
  detailCon.value = item
  open.value = true
}
//转债确认
const submitOrder = async (item) => {
  try {
    const res = await submitMove({
      post_params: { order_id: item.id }
    })

    Message.success('提交转债确认成功')
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
  margin-right: 10px;
  font-weight: 800;
  margin-top: 8px;
}
</style>
