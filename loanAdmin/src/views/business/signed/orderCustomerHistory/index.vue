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
            <div class="name">借据编号</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入借据编号" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex">
            <div class="name">所属部门</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择所属部门"
              allow-clear
            />
          </div>
          <div style="display: flex">
            <div class="name">借据开始日期范围</div>
            <DateRangePicker v-model="queryForm.loginTime" @change="search" />
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">合同编号</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择合同编号"
              allow-clear
            />
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">客户名称</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入客户名称" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">手机号码</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入手机号码" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">证件号码</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入证件号码" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">合同编号</div>
            <a-input v-model="queryForm.nickname" placeholder="请输入合同编号" allow-clear @change="search"> </a-input>
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">业务合作模式</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择业务合作模式"
              allow-clear
            />
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">记账方式</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择记账方式"
              allow-clear
            />
          </div>
          <div style="display: flex" v-if="isExpanded">
            <div class="name">借据状态</div>
            <a-select
              v-model="queryForm.status"
              :options="DisEnableStatusList"
              placeholder="请选择借据状态"
              allow-clear
            />
          </div>
          <a-button type="primary" @click="search" size="small">
            <template #icon><icon-search /></template>
            <span>新增</span>
          </a-button>

          <a-button @click="reset">重置</a-button>

          <div class="btn" @click="expandMore">{{ isExpanded ? '收起' : '展开更多' }}</div>
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
import { DisEnableStatusList } from '@/constant/common'
defineOptions({ name: 'MonitorOnline' })
const isExpanded = ref(false) // 控制是否展开
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
