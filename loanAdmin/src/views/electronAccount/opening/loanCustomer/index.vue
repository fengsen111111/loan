<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable
        row-key="id"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1700 }"
        :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']"
        @refresh="search"
      >
        <template #custom-left>
          <div style="display: flex">
            <div class="name">申请编号</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择申请编号"
              allow-clear
            />
          </div>

          <a-button type="primary" @click="search">
            <template #icon><icon-search /></template>
            <span>新增</span>
          </a-button>

          <a-button @click="reset">重置</a-button>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}（{{ record.username }}）</template>
        <template #action="{ record }">
          <a-space>
            <a-popconfirm
              type="warning"
              content="是否确定强退该用户？"
              :ok-button-props="{ status: 'danger' }"
              @ok="handleKickout(record.token)"
            >
              <a-link
                v-permission="['monitor:online:kickout']"
                status="danger"
                :title="currentToken === record.token ? '不能强退自己' : '强退'"
                :disabled="currentToken === record.token"
              >
                强退
              </a-link>
            </a-popconfirm>
            <a-link v-permission="['monitor:online:kickout']" status="danger" :disabled="currentToken === record.token">
              作废剩余待登记合同
            </a-link>
            <a-link
              v-permission="['monitor:online:kickout']"
              status="danger"
              title="详情"
              @click="showModal"
              :disabled="currentToken === record.token"
            >
              详情
            </a-link>
            <a-link
              v-permission="['monitor:online:kickout']"
              status="danger"
              title="详情"
              :disabled="currentToken === record.token"
            >
              详情
            </a-link>

            <a-link
              v-permission="['monitor:online:kickout']"
              status="danger"
              title="详情"
              :disabled="currentToken === record.token"
            >
              详情
            </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>
    <a-modal :visible="open" title="申领详情" @ok="handleOk" width="80%">
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
      </template>
      <a-space direction="vertical" :style="{ width: '100%' }">
        <a-collapse :default-active-key="['1']" :show-expand-icon="!hideIcon">
          <a-collapse-item header="申请纸质合同信息" key="1">
            <a-space direction="vertical" size="large" fill>
              <a-descriptions :data="data" layout="inline-horizontal" />
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="申请明细" key="2">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
            <div>Beijing Toutiao Technology Co., Ltd.</div>
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
        </a-collapse>
      </a-space>
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
const data = [
  {
    label: 'Name',
    value: 'Socrates'
  },
  {
    label: 'Mobile',
    value: '123-1234-1234'
  },
  {
    label: 'Residence',
    value: 'Beijing'
  },
  {
    label: 'Hometown',
    value: 'Beijing'
  },
  {
    label: 'Address',
    value: 'Yingdu Building, Zhichun Road, Beijing'
  }
]
const position = ref('right')
const hideIcon = ref(false)
const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const handleOk = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 2000)
}

const handleCancel = () => {
  open.value = false
}
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
  { title: '登录时间', dataIndex: 'loginTime', width: 180 },
  {
    title: '操作',
    slotName: 'action',
    width: 380,
    align: 'center',
    fixed: 'right',
    show: has.hasPermOr(['monitor:online:kickout'])
  }
]

const queryForm = reactive<OnlineUserQuery>({
  sort: ['createTime,desc']
})

// const {
//   tableData: dataList,
//   loading,
//   pagination,
//   search
// } = useTable((p) => listOnlineUser({ ...queryForm,currentPage: p.page, perPage: p.size }), { immediate: true })

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
:deep(.arco-collapse-item-header-title:before) {
  background-color: rgb(var(--primary-6));
  border-radius: 4px;
  content: '';
  height: 18px;
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  margin-right: 10px;
}
:deep(.arco-collapse-item-header-title) {
  margin-left: 10px;
}
</style>
