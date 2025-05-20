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
            <div class="name">所属商户</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入所属商户" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex">
            <div class="name">产品名称</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入产品名称" allow-clear @change="search"> </a-input>
          </div>

          <div style="display: flex">
            <div class="name">所属部门</div>
            <a-select v-model="queryForm.status" :options="DisEnableStatusList" placeholder="请选择部门" allow-clear />
          </div>
          <div style="display: flex">
            <div class="name">申请件编号</div>
            <a-input v-model="queryForm.nickname" placeholder="请输申请件编号" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex">
            <div class="name">客户名称</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入客户名称" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex">
            <div class="name">证件号码</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入证件号码" allow-clear @change="search"> </a-input>
          </div>

          <div style="display: flex">
            <div class="name">订单类型</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择订单类型"
              allow-clear
            />
          </div>

          <div style="display: flex">
            <div class="name">申请时间</div>
            <DateRangePicker v-model="queryForm.loginTime" @change="search" />
          </div>
          <div style="display: flex">
            <div class="name">订单来源</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择订单来源"
              allow-clear
            />
          </div>
          <div style="display: flex">
            <div class="name">订单状态</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择订单状态"
              allow-clear
            />
          </div>
          <a-button type="primary" @click="search" size="small">
            <template #icon><icon-search /></template>
            <span>搜索</span>
          </a-button>

          <a-button @click="reset">重置</a-button>

          <div class="btn" @click="expandMore">{{ isExpanded ? '收起' : '展开更多' }}</div>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}（{{ record.username }}）</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="showModal">详情 </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>

    <a-modal :visible="open" title="详情" @ok="handleOk" width="80%">
      <div>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['1']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请信息" key="1">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>所属商户</span>{{ datail.store }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>姓名</span>{{ datail.name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>证件类型</span>{{ datail.card_type }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>现居城市</span>{{ datail.city }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>街道地址</span>{{ datail.address }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>状态</span>{{ datail.status }}</div>
                </a-col>
              </a-row>
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>负责的受让方</span>{{ datail.part }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>身份证号</span>{{ datail.idcard }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>手机号码</span>{{ datail.mobile }}</div>
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
import { listOnlineUser, kickout, type OnlineUserQuery } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { DisEnableStatusList } from '@/constant/common'
defineOptions({ name: 'MonitorOnline' })
const isExpanded = ref(false) // 控制是否展开
const userStore = useUserStore()
const currentToken = userStore.token
const open = ref(false)
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '申请件编号', dataIndex: 'order_number' },
  { title: '订单类型', dataIndex: 'store' },
  { title: '所属渠道', dataIndex: 'name' },
  { title: '所属商户', dataIndex: 'idcard' },
  { title: '所属部门', dataIndex: 'card_type' },
  { title: '申请产品', dataIndex: 'mobile' },
  { title: '客户名称', dataIndex: 'status' },
  { title: '客户证件号码', dataIndex: 'status' },
  { title: '客户证件类型', dataIndex: 'status' },
  { title: '申请金额(元)', dataIndex: 'status' },
  { title: '申请期数类型', dataIndex: 'status' },
  { title: '申请期数', dataIndex: 'status' },
  { title: '申请时间', dataIndex: 'status' },
  { title: '订单来源', dataIndex: 'status' },
  { title: '录单人', dataIndex: 'status' },
  { title: '订单状态', dataIndex: 'status' },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive<OnlineUserQuery>({
  sort: ['createTime,desc']
})
//打开弹窗
const showModal = () => {
  open.value = true
}
//关闭
const handleOk = () => {
  open.value = false
}
//接口请求
// const {
//   tableData: dataList,
//   loading,
//   pagination,
//   search
// } = useTable((p) => listOnlineUser({ ...queryForm,currentPage: p.page, perPage: p.size }), { immediate: true })

//表格数据
const dataList = reactive([])

//详情数据
const datail = reactive()

//数据分页
const pagination = reactive({
  current: 1,
  pageSize: 12
})
const search = () => {}

// 重置
const reset = () => {
  queryForm.nickname = undefined
  queryForm.loginTime = undefined
  search()
}
//展开
const expandMore = () => {
  console.log(isExpanded.value)
  isExpanded.value = !isExpanded.value // 将展开状态设置为true
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
  width: 130px;
  text-align: right;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}
.btn {
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  margin-left: 20px;
  color: rgb(var(--primary-6));
}
</style>
