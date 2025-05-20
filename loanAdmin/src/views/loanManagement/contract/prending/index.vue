<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <div style="display: flex">
            <div class="name">合同编号</div>
            <a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear @change="search">
            </a-input>
          </div>

          <a-button @click="reset">重置</a-button>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-link @click="showModal(record)">详情 </a-link>
            <a-link @click="showModal1(record)">使用登记 </a-link>
            <a-link @click="showModal2(record)">作废登记 </a-link>

            <a-link @click="showModal3(record)">预览 </a-link>
          </a-space>
        </template>
      </GiTable>
    </a-card>
    <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
      <div>
        <a-row class="grid-demo1">
          <a-col :span="12">
            <div><span>合同编号</span>{{ datail.contract_num }}</div>
          </a-col>
          <!-- <a-col :span="12">
            <div><span>电子合同编号</span> {{ datail.bizNo }}</div>
          </a-col> -->
          <a-col :span="12">
            <div><span>客户姓名</span>{{ datail.name }}</div>
          </a-col>
          <a-col :span="12">
            <div><span>客户手机号码</span> {{ datail.mobile }}</div>
          </a-col>
          <a-col :span="12">
            <div><span>客户身份证号码</span>{{ datail.card_number }}</div>
          </a-col>

          <a-col :span="12">
            <div><span>合同放款金额（元）</span>{{ datail.apply_money }}</div>
          </a-col>
          <a-col :span="12">
            <div><span>借款期限类型</span>{{ datail.loan_time_type }}</div>
          </a-col>

          <a-col :span="12">
            <div><span>合同期数</span>{{ datail.loan_time + '期' }}</div>
          </a-col>
          <a-col :span="12">
            <div><span>合同期限</span> {{ datail.start_time + '-' + datail.end_time }}</div>
          </a-col>

          <a-col :span="12">
            <div><span>执行年利率（%）</span>{{ datail.loan_rate }}</div>
          </a-col>
          <a-col :span="12">
            <div>
              <span>签约城市</span>
              {{ datail.sign_address }}
            </div>
          </a-col>
          <a-col :span="12">
            <div><span>签约时间</span>{{ datail.sign_time }}</div>
          </a-col>
        </a-row>
      </div>
      <template #footer>
        <a-button key="back" @click="handleOk">关闭</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open1" title="使用登记" @ok="handleOk1" @cancel="open1 = false" width="80%">
      <a-form ref="formRef" size="medium" :rules="rules" :model="form" :style="{ width: '100%' }">
        <a-row class="grid-demo1" :gutter="24">
          <a-col :span="12">
            <a-form-item field="name" label="客户姓名" validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.name" placeholder="客户姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="mobile" label="客户手机号码" validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.mobile" placeholder="客户手机号码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="card_number" label="客户身份证号码" validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.card_number" placeholder="客户身份证号码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="apply_money" label="申请金额(元)" validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.apply_money" placeholder="申请金额(元)" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item field="sign_address" label="签约地  " validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.sign_address" placeholder="签约地  " />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="sign_time" label="签约时间 " validate-trigger="blur" label-col-flex="130px">
              <a-date-picker v-model="form.sign_time" show-time :time-picker-props="{ defaultValue: '09:09:06' }"
                format="YYYY-MM-DD HH:mm:ss" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="loan_rate" label="执行利率" validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.loan_rate" placeholder="执行利率" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="loan_time_type" label="贷款期数类型 " validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.loan_time_type" placeholder="贷款期数类型 " />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="loan_time" label="贷款期数 " validate-trigger="blur" label-col-flex="130px">
              <a-input v-model="form.loan_time" placeholder="贷款期数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="applyTime" label="贷款时间" validate-trigger="blur" label-col-flex="130px">
              <DateRangePicker v-model="form.applyTime" @change="search" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="纸质合同扫描件" validate-trigger="blur" label-col-flex="130px">
              <a-upload list-type="picture-card" @before-upload="onChange" :on-before-remove="handleRemove1"
                :file-list="fileList1" image-preview />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="抵押办理回执单" validate-trigger="blur" label-col-flex="130px">
              <a-upload list-type="picture-card" @before-upload="onChange1" :on-before-remove="handleRemove2"
                :file-list="fileList2" image-preview />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer>
        <a-button key="back" @click="handleOk1">取消</a-button>
        <a-button @click="save" type="primary">提交</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open2" title="作废登记" @ok="handleOk2" @cancel="open2 = false" width="80%">
      <div>
        <a-row class="grid-demo1">
          <a-col :span="24">
            <div><span>合同编号</span>{{ datail.contract_num }}</div>
          </a-col>
          <a-col :span="24">
            <div>
              <span>作废原因</span>
              <a-textarea placeholder="请输入作废原因" v-model="reject_reason" :max-length="255" allow-clear show-word-limit />
            </div>
          </a-col>
        </a-row>
      </div>
      <template #footer>
        <a-button key="back" @click="handleOk2">取消</a-button>
        <a-button key="back " type="primary" @click="ZFcontat">提交</a-button>
      </template>
    </a-modal>
    <a-modal :visible="open3" title="预览" @ok="open3 = false" @cancel="open3 = false" width="80%">
      <iframe :src="templateFileUrl" frameborder="0" style="width: 100%; height: 500px"></iframe>
      <template #footer>
        <a-button key="back" type="primary" @click="open3 = false">关闭</a-button>

      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { getSignContentsList, signContract, rejectContracts, frontUpload } from '@/apis'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { onMounted } from 'vue'
import { initOSSClient } from '@/utils/oss.ts'
import RoleDetailDrawer from '@/views/system/role/RoleDetailDrawer.vue'
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const open2 = ref<boolean>(false)
const open3 = ref<boolean>(false)
const templateFileUrl = ref('')
const fileList1 = ref<any>([])
const fileList2 = ref<any>([])
const reject_reason = ref()
const formRef = ref<FormInstance>()
defineOptions({ name: 'MonitorOnline' })
onMounted(() => {
  //初始化OSS client实例
  initOSSClient()
})
const rules: FormInstance['rules'] = {
  name: [{ required: true, message: '请输入用户名' }],
  card_number: [
    { required: true, message: '请输入证件号码' },
    {
      validator: (value, cb) => {
        // 定义正则表达式，用于证件
        const idRegex18 = /^\d{6}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
        const idRegex15 = /^\d{8}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/
        if (!idRegex18.test(value) || !idRegex15.test(value)) {
          cb('请输入有效的证件号码')
        } else {
          cb()
        }
      }
    }
  ],
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
  sign_address: [{ required: true, message: '请输入签约地' }],
  sign_time: [{ required: true, message: '请输入签约时间 ' }],
  loan_time_type: [{ required: true, message: '请输入贷款期数类型  ' }],
  apply_money: [{ required: true, message: '请输入申请金额  ' }],
  loan_time: [{ required: true, message: '请输入贷款期数' }]
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
  { title: '合同编号', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
  { title: '合同名称', dataIndex: 'contractName', ellipsis: true, tooltip: true },
  { title: '申请批次号', dataIndex: 'apply_number', ellipsis: true, tooltip: true },
  { title: '一式份数', dataIndex: 'one_number', width: 180 },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 300,
    fixed: 'right',
    show: true
  }
]
const form = reactive({
  name: '',
  card_number: '',
  mobile: '',
  sign_address: '',
  sign_time: '',
  apply_money: '',
  loan_rate: '',
  loan_time_type: '',
  loan_time: '',
  start_time: '',
  end_time: '',
  contract_images: [],
  mortgage_images: [],
  applyTime: []
})
const queryForm = reactive<OnlineUserQuery>({
  status: 'a',
  contract_num: ''
})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable(
  (p) =>
    getSignContentsList({
      post_params: { ...queryForm, currentPage: p.page, perPage: p.size }
    }),
  { immediate: true }
)
const onChange = (currentFile) => {
  putFileToOss(currentFile)
}
const onChange1 = (currentFile) => {
  console.log(currentFile)
  putFileToOss1(currentFile)
}
const datail = ref([])
//提交
const save = async () => {
  form.contract_images = fileList1.value.map(({ url }) => url)
  form.mortgage_images = fileList2.value.map(({ url }) => url)
  form.start_time = form.applyTime.length > 0 ? form.applyTime[0] : ''
  form.end_time = form.applyTime.length > 0 ? form.applyTime[1] : ''
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    delete form.applyTime
    await signContract({
      post_params: {
        ...form
      }
    })
    Message.success('提交成功')
    search()
  } catch (error) {
    return false
  }
}

// 重置
const reset = () => {
  search()
}

// 需要上传的时候，调用
const putFileToOss = async (file) => {
  console.log(file, window)
  // const { file } = fileObj
  try {
    const result = await window.globalOSSClient.put(file.name, file)
    fileList1.value.push(result)
    console.log('File uploaded:', fileList1.value)
    bcUpload({
      url: result.url,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
// 保存服务器
const bcUpload = async (data) => {
  let data1 = {
    url: data.value.map((obj: any) => obj.url).toString(),
    name: data.name,
    size: data.size,
    file_type: data.type,
    upload_type: 'oss'
  }

  try {
    const res = await frontUpload({
      post_params: data1
    })
    if (res.code == 1) {
    }
  } catch (error) {
    return false
  }
}
const putFileToOss1 = async (file) => {
  console.log(file, window)
  // const { file } = fileObj

  try {
    const result = await window.globalOSSClient.put(file.name, file)
    console.log('File uploaded:', result)
    fileList2.value.push(result)
    bcUpload({
      url: result,
      name: file.name,
      size: file.size,
      file_type: file.type
    })
    // 处理上传成功后的逻辑，例如保存文件链接或者展示上传成功信息
  } catch (error) {
    console.error('Failed to upload file:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}
function handleRemove1(file) {
  // 在这里处理文件删除的逻辑
  fileList1.value = fileList1.value.filter((item) => item.res.rt !== file.res.rt)
}
function handleRemove2(file) {
  // 在这里处理文件删除的逻辑
  fileList2.value = fileList2.value.filter((item) => item.res.rt !== file.res.rt)
}
//作废合同

const ZFcontat = async () => {
  try {
    const result = await rejectContracts({
      post_params: {
        id: datail.value.id,
        reject_reason: reject_reason.value
      }
    })
    open2.value = false
    Message.success('提交成功')
    search()
    console.log('File uploaded:', result)
  } catch (error) {
    console.error('Failed:', error)
    // 处理上传失败的逻辑，例如展示错误信息
  }
}

//打开弹窗
const showModal = (item: any) => {

  datail.value = item
  open.value = true
}
//关闭
const handleOk = () => {
  open.value = false
}
//打开弹窗
const showModal1 = (item) => {
  datail.value = item
  open1.value = true
}
//关闭
const handleOk1 = () => {
  open1.value = false
}
//打开弹窗
const showModal2 = (item) => {
  datail.value = item
  open2.value = true
}
//关闭
const handleOk2 = () => {
  open2.value = false
  reject_reason.value = ''
}
//打开弹窗
const showModal3 = (e) => {
  templateFileUrl.value = e.contractPath
  open3.value = true
}
//关闭
const handleOk3 = () => {
  open3.value = false
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

.grid-demo1 {
  div {
    margin: 5px 0;
  }

  span {
    text-align: right;
    font-weight: 800;
  }
}
</style>
