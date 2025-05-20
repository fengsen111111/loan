<template>
  <div class="gi_page">
    <a-card class="general-card">
      <a-row :gutter="16">
        <a-col :xs="24" :md="24" :lg="24" :xl="24" :xxl="24">
          <GiTable ref="tableRef" row-key="id" :data="dataList" :columns="columns" :loading="loading"
            :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination" :disabledTools="['size']"
            :disabledColumnKeys="['nickname']" @refresh="search">
            <template #custom-left>
              <a-row class="grid-demo2" :gutter="24">
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">姓名</div>
                    <a-input v-model="queryForm.name" placeholder="请输入姓名" allow-clear @change="search">
                      <template #prefix></template>
                    </a-input>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">账户</div>
                    <a-input v-model="queryForm.account" placeholder="请输入账户" allow-clear @change="search">
                      <template #prefix></template>
                    </a-input>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">锁定状态</div>
                    <a-select v-model="queryForm.status" :options="DisEnableStatusList" placeholder="请选择状态" allow-clear
                      @change="search" />
                  </div>
                </a-col>
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">工作状态</div>
                    <a-select v-model="queryForm.work_status" :options="DisEnableWORkList" placeholder="请选择状态"
                      allow-clear @change="search" />
                  </div>
                </a-col>
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">手机号</div>
                    <a-input v-model="queryForm.mobile" placeholder="请输入手机号 " allow-clear @change="search">
                      <template #prefix></template>
                    </a-input>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div style="display: flex">
                    <div class="name">证件号码</div>
                    <a-input v-model="queryForm.card_number" placeholder="请输入证件号码 " allow-clear @change="search">
                      <template #prefix></template>
                    </a-input>
                  </div>
                </a-col>
                <a-col :span="24">
                  <div style="display: flex; justify-content: flex-end">
                    <a-button @click="reset">重置</a-button>
                  </div>
                </a-col>
              </a-row>
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
              <GiCellAvatar :avatar="getAvatar(record.head_image, '')" is-link @click="onDetail(record)" />
            </template>
            <template #renLX="{ record }">
              <GICellRenLx :LX="record.role" />
            </template>

            <template #status="{ record }">
              <a-tag v-if="record.status == 'Y'" color="arcoblue" size="small">启用</a-tag>
              <a-tag v-else color="red" size="small">禁用</a-tag>
            </template>
            <template #isSystem="{ record }">
              <a-tag v-if="record.isSystem" color="red" size="small">是</a-tag>
              <a-tag v-else color="arcoblue" size="small">否</a-tag>
            </template>

            <template #action="{ record }">
              <a-space>
                <a-link @click="onUpdate(record)">修改</a-link>
                <a-link status="danger" @click="onDelete(record)">{{ record.status == 'Y' ? '禁用' : '启用' }} </a-link>
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
    <UserResetPwdModal ref="UserResetPwdModalRef" />
  </div>
</template>

<script setup lang="ts">
import { listUser, deleteUser, exportUser, addUser } from '@/apis'
import UserAddModal from './UserAddModal.vue'
import UserDetailDrawer from './UserDetailDrawer.vue'
import UserResetPwdModal from './UserResetPwdModal.vue'
import { Message } from '@arco-design/web-vue'
import type { TreeInstance } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useTable, useDownload } from '@/hooks'
// import { useDept } from '@/hooks/app'
import { isMobile } from '@/utils'
import getAvatar from '@/utils/avatar'
import has from '@/utils/has'
import { DisEnableStatusList, DisEnableWORkList } from '@/constant/common'

defineOptions({ name: 'SystemUser' })

const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '头像', slotName: 'username', ellipsis: true, tooltip: true },  //slotName 这个是他的插槽  dataIndex这个才是字段
  { title: '用户名', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '联系方式', dataIndex: 'mobile', ellipsis: true, tooltip: true },
  { title: '部门', dataIndex: 'department_name', ellipsis: true, tooltip: true },
  { title: '角色', dataIndex: 'role_names', ellipsis: true, tooltip: true },
  { title: '状态', slotName: 'status', align: 'center', ellipsis: true, tooltip: true },
  { title: '创建时间', dataIndex: 'create_time', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',

    show: true
  }
]

const queryForm = reactive({
  table_type: 'b'
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
  queryForm.description = undefined
  queryForm.status = undefined
  search()
}

// 禁用
const onDelete = async (item) => {
  try {
    await addUser({
      post_params: {
        id: item.id,
        status: item.status == 'N' ? 'Y' : 'N'
      }
    })
    search()
    if (item.status == 'N') {
      Message.success('禁用用户成功')
    } else {
      Message.success('启用用户成功')
    }
  } catch (error) {
    return false
  }
}

// 导出
const onExport = () => {
  useDownload(() => exportUser(queryForm))
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
}

.grid-demo2 .arco-col {
  margin-bottom: 10px;
}
</style>
