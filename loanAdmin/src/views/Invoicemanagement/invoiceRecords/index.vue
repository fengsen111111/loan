<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>

          <a-button @click="add" type="primary">开票</a-button>
        </template>
        <template #status="{ record }">{{ record.status == 'a' ? '未开票' : '已开票' }}</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="showdownload(record)">下载 </a-link>


          </a-space>
        </template>
      </GiTable>

      <a-modal :visible="open1" title="开票" @ok="handleOk1" @cancel="open1 = false" width="50%">

        <div class="mpdal_content">

          <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>

            <a-col :span="24">
              <a-form-item label="开票抬头" field="invoice_account_id">
                <a-select v-model.trim="form.invoice_account_id" placeholder="请选择开票抬头">
                  <a-option v-for="item in invoiceList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="开票金额" field="money">
                <a-input v-model.trim="form.money" placeholder="请输入开票金额" :max-length="30" />
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
import { addInvoice, getInvoiceList, getInvoiceAccountList } from '@/apis'
import { Message, type FormInstance, } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import { useForm } from '@/hooks'
import { onMounted, ref } from 'vue'
const formRef = ref<FormInstance>()
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const userStore = useUserStore()
const title = ref('add')
const invoiceList = ref([])
const rules = {
  invoice_account_id: [{
    required: true, message: '请选择开票抬头'
  }],
  money: [{ required: true, message: '请输入开票金额' }],

}

const { form, resetForm } = useForm({
  invoice_account_id: "",
  money: "",

})

const columns = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '付款公司', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '纳税人识别号 ', dataIndex: 'account_number', width: 180, ellipsis: true, tooltip: true },
  { title: '开户行  ', dataIndex: 'bank_name', width: 180, ellipsis: true, tooltip: true },
  {
    title: '开户行账号 ', dataIndex: 'bank_number', width: 180, ellipsis: true, tooltip: true
  },
  {
    title: '电话', dataIndex: 'mobile', width: 180, ellipsis: true, tooltip: true
  },
  { title: '开票金额  ', dataIndex: 'money', width: 180, ellipsis: true, tooltip: true },
  { title: '邮箱', dataIndex: 'email', width: 180, ellipsis: true, tooltip: true },
  { title: '开票状态', slotName: 'status', width: 180, ellipsis: true, tooltip: true },
  {
    title: '操作',
    width: 180,

    slotName: 'action',
    align: 'center',
    fixed: 'right',
    show: true
  }
]

onMounted(() => {
  invoiceARRY()
})

const queryForm = reactive({

})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    getInvoiceList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)
async function invoiceARRY() {
  let res = await getInvoiceAccountList({
    post_params: {

    }
  })
  invoiceList.value = res.data.list
}
// 重置
const reset = () => {
  formRef.value?.resetFields()
  open1.value = false
  search()
}
//下载

function showdownload(item) {
  if (item.image.length == 0) return Message.error('暂无开票具体信息记录')
  // 生成或获取文件 URL 
  const fileUrl = item.image
  // 创建一个临时链接
  const link = document.createElement('a');
  link.href = fileUrl;
  // link.download = 'filename.ext'; // 可选，指定下载的文件名
  link.click();
}
//弹窗新增开票
function add() {
  open1.value = true
}


//开票提交
async function handleOk1() {
  const isInvalid = await formRef.value?.validate()
  if (isInvalid) return false
  try {

    await addInvoice({
      post_params: form
    })
    Message.success('开票成功')


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
