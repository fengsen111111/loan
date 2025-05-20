<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>

          <a-button @click="add" type="primary">新增</a-button>
        </template>
        <template #status="{ record }">{{ record.status == 'a' ? '未开票' : '已开票' }}</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="showModel(record)"> 详情 </a-link>
            <a-link @click="showedit(record)"> 修改 </a-link>
            <a-link @click="showdelte(record)"> 删除 </a-link>

          </a-space>
        </template>
      </GiTable>
      <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
        <div style="display: flex">


          <div style="width: 100%">
            <a-row class="grid-demo">
              <a-col :span="12">
                <div><span> 公司名称</span> {{ detailCon?.name }}</div>
              </a-col>
              <a-col :span="12">
                <div><span>纳税人识别号</span> {{ detailCon?.account_number }}</div>
              </a-col>
              <a-col :span="12">
                <div><span>开户行</span> {{ detailCon?.bank_name }}</div>
              </a-col>
              <a-col :span="12">
                <div><span>开户账号</span> {{ detailCon?.bank_number }}</div>
              </a-col>



              <a-col :span="12">
                <div><span>手机号码</span>{{ detailCon?.mobile }}</div>
              </a-col>
              <a-col :span="12">
                <div><span>邮箱</span> {{ detailCon?.email }}</div>
              </a-col>

            </a-row>
          </div>


        </div>
        <template #footer>
          <a-button key="back" @click="open = false">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
        </template>
      </a-modal>
      <a-modal :visible="open1" :title="title == 'add' ? '新增' : '修改'" @ok="handleOk1" @cancel="open1 = false"
        width="50%">

        <div class="mpdal_content">

          <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
            <a-col :span="24">
              <a-form-item label="公司名称  " field="name">
                <a-input v-model.trim="form.name" placeholder="请输入公司名称   " :max-length="30" />
              </a-form-item></a-col>
            <a-col :span="24">
              <a-form-item label="	纳税人识别号" field="account_number">
                <a-input v-model.trim="form.account_number" placeholder="请输入纳税人识别号" :max-length="64" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="开户行  " field="bank_name">
                <a-input v-model.trim="form.bank_name" placeholder="请输入开户行  " /> </a-form-item></a-col>

            <a-col :span="24">
              <a-form-item label="开户行账号  " field="bank_number">
                <a-input v-model.trim="form.bank_number" placeholder="请输入开户行账号  " />
              </a-form-item></a-col>
            <a-col :span="24">
              <a-form-item label="手机号码" field="mobile">
                <a-input v-model.trim="form.mobile" placeholder="请输入手机号码" :max-length="11" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="邮箱" field="email">
                <a-input v-model.trim="form.email" placeholder="请输入邮箱  " />
              </a-form-item></a-col>

          </a-form>

        </div>

        <template #footer>
          <a-button key="back" @click="open = false">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk1">提交</a-button>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { editInvoiceAccount, getInvoiceAccountList } from '@/apis'
import { Message, type FormInstance, } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import { useForm } from '@/hooks'
const formRef = ref<FormInstance>()
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const userStore = useUserStore()
const detailCon = ref({})
const title = ref('add')
const rules = {
  name: [{ required: true, message: '请输入公司名称 ' }],
  bank_name: [{ required: true, message: '请输入开户行 ' }],
  bank_number: [{ required: true, message: '请输入开户行账号  ' }],
  account_number: [{ required: true, message: '请输入纳税人识别号  ' }],

  mobile: [
    { required: true, message: '请输入电话号码' },
    {
      validator: (value, cb) => {
        // 定义正则表达式，用于验证电话号码
        const phoneRegex = /^[1][3-9][0-9]{9}$/
        if (!phoneRegex.test(value)) {
          cb('请输入有效电话号码')
        } else {
          cb()
        }
      }
    }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    {
      validator: (value, cb) => {
        // 定义正则表达式，用于验证电话号码
        const phoneRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!phoneRegex.test(value)) {
          cb('请输入有效邮箱')
        } else {
          cb()
        }
      }
    }
  ]
}

const { form, resetForm } = useForm({
  name: "",
  account_number: "",
  bank_name: "",
  bank_number: "",
  mobile: "",
  email: ""
})
const DisEnableStatusList = ref([
  { label: '待确认', value: 'b', color: '' },
  { label: '转债成功 ', value: 'c', color: '' }
])
const columns = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '公司名称', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '纳税人识别号 ', dataIndex: 'account_number', width: 180, ellipsis: true, tooltip: true },
  { title: '开户行  ', dataIndex: 'bank_name', width: 180, ellipsis: true, tooltip: true },
  {
    title: '开户行账号 ', dataIndex: 'bank_number', width: 180, ellipsis: true, tooltip: true
  },
  {
    title: '电话', dataIndex: 'mobile', width: 180, ellipsis: true, tooltip: true
  },
  { title: '邮箱', dataIndex: 'email', width: 180, ellipsis: true, tooltip: true },
  {
    title: '操作',
    width: 180,

    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

const queryForm = reactive({

})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    getInvoiceAccountList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)

// 重置
const reset = () => {
  open1.value = false
  formRef.value?.resetFields()

  search()
}

//弹窗新增
function add() {
  title.value = 'add'
  open1.value = true
}
//弹窗新增
function showedit(record?: any) {
  title.value = 'edit'
  open1.value = true
  Object.assign(form, record)
}
//删除
async function showdelte(row) {
  let res = await editInvoiceAccount({
    post_params: {
      delete_status: 'Y',
      id: row.id
    }
  })

  if (res.code == 1) {
    Message.success('删除成功')
    reset()
  }
}
//提交
async function handleOk1() {
  const isInvalid = await formRef.value?.validate()
  if (isInvalid) return false
  try {
    if (title.value == 'add') {
      await editInvoiceAccount({
        post_params: form
      })
      Message.success('新增成功')
    } else {
      // if (rawPassword) {
      //   form.password = encryptByRsa(rawPassword) || ''
      // }
      await editInvoiceAccount({
        post_params: form
      })
      Message.success('修改成功')
    }

    reset()

    return true
  } catch (error) {
    return false
  }
}
//关闭
const handleOk = () => {
  open.value = false
}
// 详情
const showModel = (item) => {
  open.value = true
  detailCon.value = item
}
</script>

<style lang="scss" scoped>
.name {
  width: 130px;
  text-align: right;
  font-weight: 800;
  margin-right: 10px;
  margin-top: 8px;
}
</style>
