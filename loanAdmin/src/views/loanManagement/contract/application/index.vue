<template>
  <div class="gi_page">
    <a-card class="general-card">
      <GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
        :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
        <template #custom-left>
          <div style="display: flex">
            <div class="name">处理状态</div>
            <a-select v-model="queryForm.status" @click="search" :options="DisContratStatus" placeholder="请选择处理状态"
              allow-clear />
          </div>

          <a-button @click="reset">重置</a-button>
          <a-button type="primary" @click="openAdd = true">
            <span>申请</span>
          </a-button>
        </template>
        <template #nickname="{ record }">{{ record.username }}</template>
        <template #status="{ record }">{{
          record.status == 'a'
            ? '待复核/登记 '
            : record.status == 'b'
              ? '待用印'
              : record.status == 'c'
                ? '已拒绝'
                : (record.status = 'd'
                  ? '待邮寄'
                  : record.status == 'e'
                    ? '已邮寄'
                    : record.status == 'f'
                      ? '已归档'
                      : record.status == 'z'
                        ? '已取消'
                        : '')
        }}</template>
        <template #action="{ record }">
          <a-space>
            <a-link @click="fhfrom(record)" v-if="record.status == 'a'"> 待复核/登记 </a-link>
            <a-link @click="showModal(record)"> 详情 </a-link>
            <a-link @click="showModal3(record)">作废剩余合同 </a-link>
            <a-link @click="showModal2(record)">撤销申请 </a-link>
            <a-link>批量下载 </a-link>
          </a-space>
        </template>
      </GiTable>
      <a-modal :visible="openAdd" title="申请合同" @ok="save" @cancel="reset1" width="80%">
        <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
          <a-row class="grid-demo" :gutter="24">
            <a-col :span="12">
              <a-form-item label="合同使用城市" field="use_city_address">
                <a-cascader :options="options1" v-model.trim="form.use_city_address" :format-label="format"
                  :field-names="fieldNames" placeholder="请输入合同使用城市" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="收件人姓名" field="name">
                <a-input v-model.trim="form.name" placeholder="请输入收件人姓名" :max-length="64" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收件人手机号码" field="mobile">
                <a-input v-model.trim="form.mobile" placeholder="请输入收件人手机号码" :max-length="11" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收件人地址" field="city_address">
                <a-cascader :options="options" :field-names="fieldNames" :format-label="format1"
                  v-model.trim="form.city_address" placeholder="请输入收件人地址" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收件人街道地址" field="address">
                <a-input v-model.trim="form.address" placeholder="请输入收件人街道地址" :max-length="11" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['1']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请纸质合同信息" key="1">
              <GiTable row-key="id" :data="dataList1" :columns="columns1"
                :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
                <template #one_number="{ record }">
                  <a-space>
                    <a-button @click="numAdd(record)">
                      <span>+</span>
                    </a-button>
                    <a-input v-model.trim="record.one_number" placeholder="请输入" />
                    <a-button @click="numschu(record)">
                      <span>-</span>
                    </a-button>
                  </a-space>
                </template>
                <template #apply_number="{ record }">
                  <a-space>
                    <a-button @click="numzAdd(record)">
                      <span>+</span>
                    </a-button>
                    <a-input v-model.trim="record.apply_number" placeholder="请输入" />
                    <a-button @click="numzschu(record)">
                      <span>-</span>
                    </a-button>
                  </a-space>
                </template>
                <template #action="{ record }">
                  <a-space>
                    <a-link @click="showModal1(record)"> 预览 </a-link>
                  </a-space>
                </template>
              </GiTable>
            </a-collapse-item>
          </a-collapse>
        </a-space>
      </a-modal>
      <a-modal :visible="open" title="详情" @ok="handleOk" @cancel="open = false" width="80%">
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['1']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请信息" key="1">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>申请批次号</span>{{ datail.apply_number }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>合同使用城市</span> {{ datail.use_city_address }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }" v-if="datail?.apply_contents">
          <a-collapse :default-active-key="['2']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请纸质合同信息" key="2">
              <GiTable row-key="id" :data="JSON.parse(datail.apply_contents)" :columns="columns1"
                :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
                <template #action="{ record }">
                  <a-space>
                    <a-link @click="showModal1(record)"> 预览 </a-link>
                  </a-space>
                </template>
              </GiTable>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['3']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请明细" key="3">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>申请人</span>{{ datail.apply_worker_name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>申请时间</span> {{ datail.create_time }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>撤销备注</span> {{ datail.refuse_reason }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['4']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="邮寄登记信息" key="4">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>收件人姓名</span>{{ datail.name }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>收件人手机号</span> {{ datail.mobile }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>收件地址</span> {{ datail.address }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
      </a-modal>
      <a-modal :visible="open2" title="撤销申请" @ok="handleOk2" @cancel="open2 = false" width="80%">
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['1']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="申请信息" key="1">
              <a-row class="grid-demo1">
                <a-col :span="12">
                  <div><span>申请批次号</span>{{ datail.apply_number }}</div>
                </a-col>
                <a-col :span="12">
                  <div><span>合同使用城市</span> {{ datail.use_city_address }}</div>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['2']" expand-icon-position="right" :accordion="true"
            v-if="datail?.apply_contents">
            <a-collapse-item header="申请纸质合同信息" key="2">
              <GiTable row-key="id" :data="JSON.parse(datail.apply_contents)" :columns="columns1"
                :scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
                :disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
                <template #action="{ record }">
                  <a-space>
                    <a-link @click="showModal1(record)"> 预览 </a-link>
                  </a-space>
                </template>
              </GiTable>
            </a-collapse-item>
          </a-collapse>
        </a-space>
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-collapse :default-active-key="['4']" expand-icon-position="right" :accordion="true">
            <a-collapse-item header="撤销原因" key="4">
              <a-textarea placeholder="请输入撤销原因" v-model="contartCX" :max-length="255" allow-clear show-word-limit />
            </a-collapse-item>
          </a-collapse>
        </a-space>
      </a-modal>
      <a-modal :visible="open3" title="作废剩余待登记合同" @ok="handleZF" @cancel="open3 = false" width="80%">
        <a-row class="grid-demo1">
          <a-col :span="24">
            <div><span>申请批次号</span>{{ datail?.apply_number }}</div>
          </a-col>
          <a-col :span="24">
            <div>
              <span>作废原因</span>
              <a-textarea placeholder="请输入作废原因" v-model="rejecFrom.reject_reason" :max-length="255" allow-clear
                show-word-limit />
            </div>
          </a-col>
        </a-row>
      </a-modal>
      <a-modal :visible="open1" title="预览" @cancel="open1 = false" width="80%">
        <iframe src="templateFileUrl" frameborder="0" style="width: 100%; height: 500px"></iframe>
        <template #footer>
          <a-button key="back" type="primary" @click="open1 = false">关闭</a-button>

        </template>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  ContentsList,
  getAreas,
  applyUseContracts,
  getStoreContractList,
  rejectContracts,
  getApplyUseContentsDetail
} from '@/apis'

import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { Message, Modal, type FormInstance, type TreeNodeData } from '@arco-design/web-vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import { useForm } from '@/hooks'
import has from '@/utils/has'
import { DisContratStatus } from '@/constant/common'
defineOptions({ name: 'MonitorOnline' })
const open = ref<boolean>(false)
const open1 = ref<boolean>(false)
const open2 = ref<boolean>(false)
const open3 = ref<boolean>(false)

const openAdd = ref<boolean>(false)
const userStore = useUserStore()
const currentToken = userStore.token
const templateFileUrl = ref('')
const contartCX = ref('')
const shopList = ref([])
const options = ref([])
const options1 = ref([])
const isUpdate = ref(false)
const dataList1 = ref([])
const rejecFrom = reactive({
  apply_id: '',
  reject_reason: ''
})
const rules: FormInstance['rules'] = {
  use_city_address: [{ required: true, message: '请选择城市' }],
  name: [{ required: true, message: '请输入名称' }],
  city_address: [{ required: true, message: '请选择收件人地区' }],
  address: [{ required: true, message: '请输入收件人地址' }],
  mobile: [
    { required: true, message: '请输入收件人联系方式' },
    {
      validator: (value, cb) => {
        // 定义正则表达式，用于验证电话号码
        const phoneRegex = /^[1][3-9][0-9]{9}$/
        if (!phoneRegex.test(value)) {
          cb('请输入有效的收件人电话号码')
        } else {
          cb()
        }
      }
    }
  ]
}
const format = (options) => {
  const labels = options.map((option) => option.label)
  form.use_city_address = labels.join('-')
  return labels.join('-')
}
const format1 = (options) => {
  const labels = options.map((option) => option.label)
  form.city_address = labels.join('-')
  return labels.join('-')
}
const fieldNames = { value: 'label', label: 'label' }
const datail = ref({})
const formRef = ref<FormInstance>()
const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '申请批次号', dataIndex: 'apply_no', ellipsis: true, tooltip: true },

  { title: '申请人', dataIndex: 'apply_worker_name', ellipsis: true, tooltip: true },
  { title: '申请时间', dataIndex: 'create_time', ellipsis: true, tooltip: true },
  { title: '处理状态', slotName: 'status', ellipsis: true, tooltip: true },

  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 450,
    fixed: 'right',
    show: true
  }
]
const columns1: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
  },
  { title: '合同模板名称', dataIndex: 'name', ellipsis: true, tooltip: true },

  { title: '一式份数', dataIndex: 'one_number', slotName: 'one_number', ellipsis: true, tooltip: true },
  { title: '申请总套数', dataIndex: 'apply_number', slotName: 'apply_number', ellipsis: true, tooltip: true },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 100,
    fixed: 'right',
    show: true
  }
]
onMounted(() => {
  getAreasList()
  getContartList()
})
const { form, resetForm } = useForm({
  use_city_address: '',
  name: '',
  mobile: '',
  city_address: '',
  address: '',
  apply_contents: '',
  refuse_reason: ''
})
const queryForm = reactive<OnlineUserQuery>({
  status: ''
})

//获取行政区
const getAreasList = async () => {
  try {
    const res = await getAreas({
      post_params: {}
    })
    options.value = res.data.areas
    options1.value = res.data.areas.map((province) => ({
      id: province.id,
      value: province.value,
      label: province.label,
      children: province.children.map((city) => ({
        id: city.id,
        value: city.value,
        label: city.label
      }))
    }))
    // console.log(res)
  } finally {
  }
}

//获取申领合同列表

const getContartList = async () => {
  try {
    const res = await getStoreContractList({
      post_params: {}
    })

    dataList1.value = res.data.map((item) => ({
      contract_id: item.id,
      one_number: 1,
      name: item.name,
      apply_number: 1,
      content_file: item.content_file
    }))
  } finally {
  }
}
//获取合同申领详情
const getContarDetail = async (id: any) => {
  try {
    const res = await getApplyUseContentsDetail({
      post_params: {
        id: id
      }
    })
    datail.value = res.data
  } finally {
  }
}
//作废合同
const handleZF = async () => {
  try {
    const res = await rejectContracts({
      post_params: rejecFrom
    })
    if (res.code == 1) {
      Message.success('作废合同成功')
      search()
    }
  } finally {
  }
}

//新增一式份数
function numAdd(item) {
  item.one_number++
}

//减少一式份数
function numschu(item) {
  if (item.one_number > 0) {
    item.one_number--
  } else {
    item.one_number = 1
  }
}
//新增申请总套数
function numzAdd(item) {
  item.apply_number++
}
//减少申请总套数
function numzschu(item) {
  if (item.apply_number > 0) {
    item.apply_number--
  } else {
    item.apply_number = 1
  }
}
//打开弹窗
const showModal = (item) => {
  getContarDetail(item.id)
  open.value = true
}
const showModal3 = (item) => {
  getContarDetail(item.id)
  rejecFrom.apply_id = item.id
  open3.value = true
}

const showModal2 = (item) => {
  getContarDetail(item.id)
  open2.value = true
}
//关闭
const handleOk = () => {
  setTimeout(() => {
    open.value = false
  }, 2000)
}
//打开弹窗
const showModal1 = (e) => {
  // console.log(e)
  open1.value = true
  templateFileUrl.value = e.contract_images
}

//关闭
const handleOk1 = () => {
  setTimeout(() => {
    open1.value = false
  }, 2000)
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    const apply_contents = dataList1.value.map((item: any) => {
      return {
        contract_id: item.contract_id,
        one_number: item.one_number,
        apply_number: item.apply_number
      }
    })

    if (isInvalid) return false
    if (isUpdate.value) {
      await applyUseContracts({
        post_params: {
          ...form,
          apply_contents: apply_contents
        }
      })
      Message.success('修改成功')
      search()
    } else {
      // if (rawPassword) {
      //   form.password = encryptByRsa(rawPassword) || ''
      // }
      await applyUseContracts({
        post_params: {
          ...form,
          apply_contents: apply_contents
        }
      })
      Message.success('新增成功')
      search()
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}
const emit = defineEmits<{
  (e: 'save-success'): void
}>()

// 重置
const reset1 = () => {
  formRef.value?.resetFields()
  openAdd.value = false
  handleOk()
  resetForm()
}

//撤销申请
const handleOk2 = async () => {
  if (contartCX.value.length == 0) return Message.error('请输入撤销申请理由')

  try {
    await applyUseContracts({
      post_params: {
        id: datail.value.id,
        refuse_reason: contartCX.value,
        status: 'z'
      }
    })
    Message.success('撤销申请成功')


    search()
    open2.value = false
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable((p) => ContentsList({ post_params: { ...queryForm, currentPage: p.page, perPage: p.size } }), {
  immediate: true
})

// 重置
const reset = () => {
  queryForm.status = ''
  search()
}
// 复核
const fhfrom = (item) => {
  Modal.warning({
    title: '提示',
    content: '是否同意合同复核通过',
    hideCancel: false,
    maskClosable: false,
    okText: '同意', // 设置确认按钮文字
    cancelText: '拒绝', // 设置取消按钮文字，如果不需要则去掉
    onOk() {
      onfhe({
        id: item.id,
        status: 'a'
      })
    },
    onCancel() {
      onfhe({
        id: item.id,
        status: 'c'
      })
      // console.log('Cancel button clicked');
    }
  })
}
function onfhe(data) {
  try {
    applyUseContracts({
      post_params: data
    })
    if (data.status == 'a') {
      Message.success('复核通过成功')
    } else {
      Message.success('拒绝复核')
    }

    search()
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}
</script>

<style lang="scss" scoped>
.name {
  // width: 130px;
  text-align: right;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}

:deep(.arco-collapse-item-header:before) {
  background-color: #2911df;
  border-radius: 4px;
  content: '';
  height: 18px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
}

:deep(.arco-collapse-item-header) {
  padding-left: 20px;
}

.grid-demo1 {
  div {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  span {
    text-align: right;
    font-weight: 800;
    margin-right: 30px;
  }
}
</style>
