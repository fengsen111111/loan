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
            <a-input v-model="queryForm.nickname" placeholder="请输入客户姓名" allow-clear @change="search">
              <template #prefix></template>
            </a-input>
          </div>
          <div style="display: flex">
            <div class="name">申请编号</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入申请编号" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>

          <div style="display: flex">
            <div class="name">申请产品</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入申请产品" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>
          <div style="display: flex">
            <div class="name">客户手机号码</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入客户手机号码" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>

          <div style="display: flex">
            <div class="name">客户证件号码</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入用户名或昵称" allow-clear @change="search">
              <template #prefix><icon-search /></template>
            </a-input>
          </div>
          <div style="display: flex">
            <div class="name">任务处理时间</div>
            <DateRangePicker v-model="queryForm.loginTime" @change="search" />
          </div>
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
          </a-space>
        </template>
      </GiTable>
    </a-card>
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

defineOptions({ name: 'MonitorOnline' })

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
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive<OnlineUserQuery>({
  sort: ['createTime,desc']
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
}
</style>
