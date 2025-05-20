<template>
	<div>
		<GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
			:scroll="{ x: '100%', y: '100%', minWidth: 3000 }" :pagination="pagination"
			:disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
			<template #custom-left>

				<a-row class="grid-demo2" :gutter="24">
					<a-col :span="8">
						<div style="display: flex">
							<div class="name">主体名称</div>
							<a-input v-model="queryForm.name" placeholder="请输入主体名称" allow-clear @change="search">
								<template #prefix></template>
							</a-input>
						</div>
					</a-col>
					<a-col :span="8">
						<div style="display: flex">
							<div class="name">联系人</div>
							<a-input v-model="queryForm.user_name" placeholder="请输入联系人" allow-clear @change="search">
								<template #prefix></template>
							</a-input>
						</div>
					</a-col>

					<a-col :span="8">
						<div style="display: flex">
							<div class="name">产品名称</div>
							<a-cascader :options="Goods" v-model="queryForm.goods_id" placeholder="请选择产品名称" />
						</div>
					</a-col>
					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">产品对象</div>
							<a-cascader :options="GoodsdxList" v-model="queryForm.type" placeholder="请选择产品对象"
								@change="search" />
						</div>
					</a-col>
					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">产品类型</div>
							<a-cascader :options="GoodstypeList" v-model="queryForm.goods_type" placeholder="请选择产品类型"
								@change="search" />
						</div>
					</a-col>

					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">合同编号</div>
							<a-input v-model="queryForm.contract_num" placeholder="请输入合同编号" allow-clear
								@change="search">
								<template #prefix></template>
							</a-input>
						</div>
					</a-col>
					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">联系电话</div>
							<a-input v-model="queryForm.user_mobile" placeholder="请输入联系电话" allow-clear @change="search">
								<template #prefix></template></a-input>
						</div>
					</a-col>

					<a-col :span="8">
						<div style="display: flex; margin-left: 40px">
							<div class="name">进件时间</div>
							<a-date-picker v-model="queryForm.create_time" @change="search" />
						</div>
					</a-col>
					<a-col :span="2">
						<a-button @click="reset">重置</a-button>
					</a-col>

					<div class="btn" @click="expandMore">{{ isExpanded ? '收起' : '展开更多' }}</div>
				</a-row>



			</template>
			<template #status="{ record }">
				{{
          record.status == 'a'
            ? '填单中'
            : record.status == 'b'
              ? '审核中'
              : record.status == 'c'
                ? '签约中 '
                : record.status == 'd'
                  ? '公证中'
                  : record.status == 'e'
                    ? '放款中'
                    : record.status == 'f'
                      ? '业务完成,转债中'
                      : record.status == 'g'
                        ? '流程完结'
                        : record.status == 'z'
                          ? '订单作废'
                          : ''
        }}
			</template>

			<template #type="{ record }">
				{{
          record.type == 'person'
            ? '个人'
            : record.type == 'company'
              ? '企业 '
              : ''
        }}
			</template>
			<template #goods_type="{ record }">
				{{
          record.goods_type == 'borrow'
            ? '借款'
            : record.goods_type == 'mortgage'
              ? '抵押 '
              : ''
        }}
			</template>


			<template #action="{ record }">
				<a-space> <a-link @click="showModal1(record)">放款</a-link> </a-space>
				<a-space> <a-link @click="cancelFK(record)">结束放款</a-link> </a-space>
				<a-space> <a-link @click="showModal(record)">详情 </a-link> </a-space>
				<a-space> <a-link @click="showModal2(record)">合同详情 </a-link> </a-space>
			</template>
		</GiTable>
		<a-modal :visible="open" title="详情" @ok="handleOk" width="40%" @cancel="open = false">
			<div>
				<iframe :src="detailCon?.detail_url" width="100%" height="600px" frameborder="0"></iframe>
			</div>
			<template #footer>
				<a-button key="back" @click="open = false">取消</a-button>
				<a-button key="submit" type="primary" @click="open = false">关闭</a-button>
			</template>
		</a-modal>
		<a-modal :visible="open1" title="线上放款" @ok="handleOk1" @cancel="disDigo" width="80%">
			<a-row class="grid-demo">
				<a-col :span="24" style="margin-bottom:0px">
					<div style="display: flex; width: 400px;margin-bottom:10px">
						<span style="width: 100px">姓名</span>
						<div>{{ detailCon?.name }}</div>
					</div>
					<div style="display: flex; width: 400px;margin-bottom:10px">
						<span style="width: 100px">合同编号</span>
						<div>{{ detailCon?.contract_num }}</div>
					</div>
				</a-col>

				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width: 150px">助贷方</span>
						<a-cascader :options="capitalList" :field-names="fieldNames" v-model="Form.capital_id"
							placeholder="请选择助贷方" />
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width: 150px">放款方式</span>
						<a-select v-model="Form.type" placeholder="请选择放款方式" :options="data" allow-clear />
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width: 170px">放款金额</span>
						<a-input v-model="Form.price" placeholder="请输入放款金额" allow-clear />
					</div>
				</a-col>
			</a-row>
		</a-modal>
		<a-modal :visible="open2" title="合同详情" width="80%" @cancel="open2 = false">
			<GiTable row-key="id" :data="dataList1" :columns="columns1" :loading="loading"
				:scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
				:disabledTools="['fullscreen', 'refresh', 'size', 'setting']">
				<template #action="{ record }">
					<a-space> <a-link @click="showdownload(record)">下载合同</a-link> </a-space>
				</template>
			</GiTable>
			<template #footer>
				<a-button key="back" @click="open2 = false">取消</a-button>
				<a-button key="submit" type="primary" @click="open2 = false">关闭</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
	import {
		endOrder,
		storeGetOrderList,
		storeGetGoodsList,
		storeGetOrderDetail,
		listRole,
		getStoreCapitalList,
		choiceCapitalAndPay
	} from '@/apis'
	import { Message } from '@arco-design/web-vue'
	import type { TableInstanceColumns } from '@/components/GiTable/type'
	import { useUserStore } from '@/stores'
	import { useTable } from '@/hooks'
	import { isMobile } from '@/utils'
	import has from '@/utils/has'
	import { DisEnableStatusList } from '@/constant/common'
	const isExpanded = ref(false) // 控制是否展开
	const userStore = useUserStore()
	const Goods = ref([])
	const getdept = ref([])
	const open = ref<boolean>(false)
	const open1 = ref<boolean>(false)
	const open2 = ref<boolean>(false)
	const detailCon = ref<any>({})
	const iframeRef = ref(null)
	const currentToken = userStore.token
	const iframeShow = ref(true)
	const capitalList = ref([])
	const dataList1 = ref([])
	const capittype = ref('')
	const capital_id = ref('')
	const fieldNames = { value: 'id', label: 'name' }
	const Form : any = ref({})
	const columns1 : TableInstanceColumns[] = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
		},
		{ title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
		{ title: '链接', align: 'center', dataIndex: 'url', ellipsis: true, tooltip: true },

		{
			title: '操作',
			slotName: 'action',
			align: 'center',
			fixed: 'right',
			show: true
		}
	]
	const columns : TableInstanceColumns[] = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
		},
		{ title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
		{ title: '进件时间', align: 'center', dataIndex: 'create_time', ellipsis: true, tooltip: true },
		{ title: '进度', align: 'center', slotName: 'status', ellipsis: true, tooltip: true },
		{ title: '产品名称', align: 'center', dataIndex: 'goods_name', ellipsis: true, tooltip: true },
		{ title: '产品对象', align: 'center', slotName: 'type', ellipsis: true, tooltip: true },
		{ title: '产品类型', align: 'center', slotName: 'goods_type', ellipsis: true, tooltip: true },
		{ title: '主体名称', align: 'center', dataIndex: 'name', ellipsis: true, tooltip: true },
		{ title: '联系人', align: 'center', dataIndex: 'user_name', ellipsis: true, tooltip: true },
		{ title: '联系电话', align: 'center', dataIndex: 'user_mobile', ellipsis: true, tooltip: true },
		{ title: '贷款金额', align: 'center', dataIndex: 'apply_money', ellipsis: true, tooltip: true },
		{ title: '期数', align: 'center', dataIndex: 'loan_time', ellipsis: true, tooltip: true },
		{ title: '利率', align: 'center', dataIndex: 'loan_rate', ellipsis: true, tooltip: true },
		{ title: '已放款金额', align: 'center', dataIndex: 'payed_money', ellipsis: true, tooltip: true },
		{ title: '待放款金额', align: 'center', dataIndex: 'wait_pay_money', ellipsis: true, tooltip: true },
		{ title: '放款中金额', align: 'center', dataIndex: 'paing_money', ellipsis: true, tooltip: true },
		{ title: '部门', align: 'center', dataIndex: 'dpt_name', ellipsis: true, tooltip: true },
		{
			title: '操作',
			slotName: 'action',
			align: 'center',
			fixed: 'right',
			show: true
		}
	]
	const data = [
		{
			value: 'a',
			label: '线上放款'
		},
		{
			value: 'b',
			label: '线下放款'
		}
	]
	const GoodsdxList = ref([
		{
			value: 'person',
			label: '个人',

		},
		{
			value: 'company',
			label: '企业',

		}
	])
	const GoodstypeList = ref([
		{
			value: 'borrow',
			label: '借款 ',

		},
		{
			value: 'mortgage',
			label: '抵押',

		}
	])

	const num = ref(0)
	const pdf_num = ref(0)
	const contract_pdf = ref([])

	const queryForm = reactive({
		status: 'g',
		contract_num: '',
		create_time: '',
		check_status: '',
		pay_status: '',
		notarization_status: '',
		goods_id: '',
		type: '',
		goods_type: '',
		name: '',
		user_name: '',
		user_mobile: ''
	})

	const List = reactive([{ name: '合同基本信息' }, { name: '客户详细信息' }, { name: '融担方信息' }])
	const detail = (i) => {
		num.value = i
	}
	const {
		tableData: dataList,
		loading,
		pagination,
		search
	} = useTable((p) => storeGetOrderList({ post_params: { ...queryForm, currentPage: p.page, perPage: p.size } }), {
		immediate: true
	})

	onMounted(() => {
		GoodsList()
		getdeptList()
		CapitalList()
	})
	function handleClick(i) {
		pdf_num.value = i
	}
	//获取接收债权方
	const CapitalList = async () => {
		try {
			const res = await getStoreCapitalList()
			capitalList.value = res.data.list

			return true
		} catch (error) {
			return false
		}
	}

	//获取部门
	const getdeptList = async () => {
		try {
			const res = await listRole({
				post_params: {
					type: 'a'
				}
			})
			getdept.value = res.data.list
		} finally {
		}
	}
	//获取商品信息
	const GoodsList = async () => {
		try {
			const res = await storeGetGoodsList()
			Goods.value = res.data.datas

			return true
		} catch (error) {
			return false
		}
	}

	//打开弹窗
	const showModal = async (item) => {

		detailCon.value = item

		open.value = true
	}
	//打开弹窗
	const showModal1 = async (item) => {
		detailCon.value = item
		open1.value = true
	}
	//放款
	const handleOk1 = async () => {
		try {
			await choiceCapitalAndPay({
				post_params: {
					order_id: detailCon.value.id,
					capital_id: Form.value.capital_id,
					type: Form.value.type,
					price: Form.value.price
				}
			})
			Message.success('放款成功')
			search()
			emit('save-success')
			return true
		} catch (error) {
			return false
		}
	}
	//关闭弹窗
	function disDigo() {
		Form.value.capital_id = ''
		Form.value.type = ''
		Form.value.price = ''
		open1.value = false
	}
	//关闭
	const handleOk = () => {
		open.value = false
	}
	// 重置
	const reset = () => {
		search()
	}
	//展开
	const expandMore = () => {
		console.log(isExpanded.value)
		isExpanded.value = !isExpanded.value // 将展开状态设置为true
	}
	//合同详情
	function showModal2(item) {
		// contract_pdf.value = item.contract_pdf
		const list = item.contract_pdf.map((item1) => {
			return {
				contract_num: item.contract_num,
				url: item1
			}
		})
		dataList1.value = list
		open2.value = true
	}
	//下载

	function showdownload(item) {
		if (item.url.length == 0) return Message.error('暂无合同记录')
		// 生成或获取文件 URL 
		const fileUrl = item.url
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


	// 结束放款
	const cancelFK = (item) => {
		loading.value = true
		endOrder({
			post_params: {
				order_id: item.id
			}
		}).then((res) => {
			console.log('结束放款', res);
			loading.value = false
			search()
		})
	}
</script>

<style lang="scss" scoped>
	.ipt_pwd {
		width: 245px;
		height: 37px;
		position: relative;
		border: 1px solid var(--color-border-3);
		margin-right: 20px;
		padding-left: 10px;
	}

	.name {
		width: 130px;
		text-align: right;
		margin-right: 10px;
		font-weight: 800;
		margin-top: 8px;
	}

	.grid-demo2 .arco-col {
		margin-bottom: 10px;
	}

	#LOGPASS2_SHOW {
		color: #737a87;
		font-size: 14px;
		font-weight: 400;
	}

	.btn {
		cursor: pointer;
		font-size: 12px;
		font-weight: 700;
		margin-left: 20px;
		margin-top: 10px;
		color: rgb(var(--primary-6));
	}

	.mpdal_left {
		width: 100px;
		margin-right: 90px;
	}

	.mpdal_right {
		width: calc(100% - 200px);
	}

	.grid-demo {
		div {
			margin-bottom: 20px;
		}

		span {
			text-align: right;
			font-weight: 800;
			margin-right: 30px;
		}

		.idcard {
			display: flex;
			margin-left: 50px;

			.idcarda {
				text-align: center;
				margin-right: 50px;

				img {
					width: 120px;
					height: 100px;
				}
			}
		}
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