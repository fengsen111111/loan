<template>
  <div class="gi_page">
    <a-card title="用户管理" class="general-card">
      <a-row :gutter="16">
        <a-col :xs="24" :md="24" :lg="24" :xl="24" :xxl="24">
          <GiTable ref="tableRef" row-key="id" :data="dataList" :columns="columns" :loading="loading"
            :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination" :disabledTools="['size']"
            :disabledColumnKeys="['nickname']" @refresh="search">
            <template #custom-left>
              <div style="display: flex">
                <div class="name">姓名</div>
                <a-input v-model="queryForm.name" placeholder="请输入姓名" allow-clear @change="search"> </a-input>
              </div>
              <div style="display: flex">
                <div class="name">手机号码</div>
                <a-input v-model="queryForm.mobile" placeholder="请输入手机号码" allow-clear @change="search">
                </a-input>
              </div>
              <div style="display: flex">
                <div class="name">证件号码</div>
                <a-input v-model="queryForm.card_number" placeholder="请输入证件号码" allow-clear @change="search">
                </a-input>
              </div>
              <div style="display: flex">
                <div class="name">状态</div>
                <a-select v-model="queryForm.status" :options="DisEnableStatusList" placeholder="请选择状态" allow-clear
                  @change="search" />
              </div>

              <a-button @click="reset">重置</a-button>
            </template>
            <template #custom-right>
              <a-button type="primary" @click="onAdd">
                <template #icon><icon-plus /></template>
                <span>新增</span>
              </a-button>
              <a-tooltip content="导出">
                <a-button v-permission="['system:user:export']" class="gi_hover_btn-border" @click="onExport">
                  <template #icon>
                    <icon-download />
                  </template>
                </a-button>
              </a-tooltip>
            </template>
            <template #username="{ record }">
              <GiCellAvatar :avatar="getAvatar(record.avatar, record.gender)" :name="record.username" is-link
                @click="onDetail(record)" />
            </template>
            <template #gender="{ record }">
              <GiCellGender :gender="record.gender" />
            </template>
            <template #status="{ record }">
              <a-tag v-if="record.status == 'Y'" color="arcoblue" size="small">启用</a-tag>
              <a-tag v-else color="red" size="small">禁用</a-tag>
            </template>
            <template #roletype="{ record }">
              <a-tag v-if="record.type == 'a'" color="arcoblue" size="small">用户</a-tag>
              <a-tag v-if="record.type == 'b'" color="arcoblue" size="small">管理员</a-tag>
              <a-tag v-if="record.type == 'c'" color="arcoblue" size="small">业务员</a-tag>
              <a-tag v-if="record.type == 'd'" color="arcoblue" size="small">审核员 </a-tag>
            </template>

            <template #isSystem="{ record }">
              <a-tag v-if="record.isSystem" color="red" size="small">是</a-tag>
              <a-tag v-else color="arcoblue" size="small">否</a-tag>
            </template>
            <template #action="{ record }">
              <a-space>
                <a-link @click="onUpdate(record)">修改</a-link>
                <a-link title="查看" @click="onDetail(record)">查看</a-link>
                <!-- <a-link status="danger" title="删除" @click="onDelete(record)"> 删除 </a-link> -->
                <a-dropdown>
                  <a-link v-if="has.hasPermOr(['system:user:resetPwd'])" type="text">更多</a-link>
                  <template #content>
                    <a-doption v-permission="['system:user:resetPwd']" @click="onResetPwd(record)">重置密码</a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </GiTable>
        </a-col>
      </a-row>
    </a-card>

    <UserAddModal ref="UserAddModalRef" @save-success="search" />
    <UserDetailDrawer ref="UserDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { listUser, deleteUser, exportUser, type UserResp, type UserQuery } from '@/apis'
import UserAddModal from './pseronAddModal.vue'
import UserDetailDrawer from './UserDetailDrawer.vue'

import type { TreeInstance } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable, useDownload } from '@/hooks'
// import { useDept } from '@/hooks/app'
import { isMobile } from '@/utils'
import getAvatar from '@/utils/avatar'
import has from '@/utils/has'
import { DisEnableStatusList } from '@/constant/common'

defineOptions({ name: 'SystemUser' })

const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '用户名', dataIndex: 'name', width: 120, ellipsis: true, tooltip: true },
  { title: '联系方式', dataIndex: 'mobile', width: 120, ellipsis: true, tooltip: true },
  { title: '状态', slotName: 'status', align: 'center', ellipsis: true, tooltip: true },
  { title: '创建时间', dataIndex: 'create_time', width: 180, ellipsis: true, tooltip: true },
  { title: '修改时间', dataIndex: 'update_time', width: 180, ellipsis: true, tooltip: true },
  {
    title: '操作',
    slotName: 'action',
    width: 200,
    align: 'center',

    show: true
  }
]

const queryForm = reactive({
  table_type: 'a',
  name: '',
  mobile: '',
  card_number: '',
  status: ''
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable(
  (p) =>
    listUser({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)

// 重置
const reset = () => {
  queryForm.name = ''
  queryForm.mobile = ''
  queryForm.card_number = ''
  queryForm.status = ''
  search()
}

// 删除
const onDelete = (item: UserResp) => {
  return handleDelete(() => deleteUser(item.id), {
    content: `是否确定删除用户 [${item.nickname}(${item.username})]？`,
    showModal: true
  })
}

const treeRef = ref<TreeInstance>()
const deptName = ref('')

const UserAddModalRef = ref<InstanceType<typeof UserAddModal>>()
// 新增
const onAdd = () => {
  UserAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (item: any) => {
  UserAddModalRef.value?.onUpdate(item)
}

const UserDetailDrawerRef = ref<InstanceType<typeof UserDetailDrawer>>()
// 详情
const onDetail = (item: UserResp) => {
  UserDetailDrawerRef.value?.onDetail(item)
}

const UserResetPwdModalRef = ref<InstanceType<typeof UserResetPwdModal>>()
// 重置密码
const onResetPwd = (item: UserResp) => {
  UserResetPwdModalRef.value?.onReset(item.id)
}

onMounted(() => { })
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
</style>
