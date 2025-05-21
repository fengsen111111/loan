<template>
	<div>
		<GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
			:scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="pagination"
			:disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
			<template #custom-left>

				<a-row class="grid-demo2" :gutter="24">
					<a-col :span="8">
						<div style="display: flex">
							<div class="name">客户名称</div>
							<a-input v-model="queryForm.name" placeholder="请输入客户名称" allow-clear @change="search">
								<template #prefix></template>
							</a-input>
						</div>
					</a-col>
					<a-col :span="8">
						<div style="display: flex">
							<div class="name">客户联系方式</div>
							<a-input v-model="queryForm.mobile" placeholder="请输入客户联系方式" allow-clear @change="search">
								<template #prefix></template>
							</a-input>
						</div>
					</a-col>


					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">状态</div>
							<a-cascader :options="GoodsdxList" v-model="queryForm.status" placeholder="请选择状态"
								@change="search" />
						</div>
					</a-col>
					<a-col :span="8" v-if="isExpanded">
						<div style="display: flex">
							<div class="name">付款方式</div>
							<a-cascader :options="GoodstypeList" v-model="queryForm.pay_type" placeholder="请选择付款方式"
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

					<a-col :span="8">
						<div style="display: flex; margin-left: 40px">
							<div class="name">进件时间</div>
							<a-range-picker v-model="create_time" @change="onChange" />

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
            ? '进行中'
            : record.status == 'b'
              ? '成功'
              : record.status == 'c'
                ? '失败'

                : ''
        }}
			</template>
			<template #receipt_status="{ record }">
				{{
          record.receipt_status == 'a'
            ? '未处理'
            : record.receipt_status == 'b'
              ? '生成中'
              : record.receipt_status == 'c'
                ? '成功'

                : '不支持'
        }}
			</template>
			<template #action="{ record }">
				<a-space v-if="record.status == 'b' && record.withdrawal_status == 'N' && record.is_ll_account == 'Y'">
					<a-link @click="withdrawal(record)">提现 </a-link>
				</a-space>
				<!-- <a-space v-if="record.receipt_status == 'c'">
					<a-link @click="showdownload(record)">下载 </a-link>
				</a-space> -->
				<!-- <a-space v-else-if="record.receipt_status == 'd'">
					<a-link>不支持生成回执单 </a-link>
				</a-space> -->
				<a-space v-if="record.receipt_file">
					<a-link @click="showdownload(record)">放款回执单 </a-link>
				</a-space>
				<a-space v-if="record.withdrawal_receipt_file">
					<a-link @click="showdownloadTx(record)">提现回执单 </a-link>
				</a-space>

				<!-- <a-space v-else>
					<a-link> </a-link>
				</a-space> -->
			</template>
		</GiTable>

		<a-modal :visible="txVis" title="提现放款" @ok="handleTx" @cancel="cancelTx">
			<a-row class="grid-demo">
				<!-- <a-col :span="24"> -->
				<!-- <div style="display: flex; width: 400px"> -->
				<!-- <span style="width:110px">助贷方名称:</span> -->
				<!-- <span style="width:110px">借款人名称:</span> -->
				<!-- <span style="width:110px">收款信息:</span> -->
				<!-- <a-cascader :options="capitalList" :field-names="fieldNames" v-model="Form.capital_id"
	          placeholder="请选择助贷方" /> -->
				<!-- <div>{{ fieldName }}</div> -->
				<!-- </div> -->
				<!-- </a-col> -->
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width:110px">账户名称:</span>
						<div>{{ fieldName }}</div>
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width:110px">银行卡号:</span>
						<div>{{ info.linked_acctno }}</div>
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width:110px">开户行名:</span>
						<div>{{ info.linked_brbankname }}</div>
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width:110px">放款金额:</span>
						<div>
							<a-input v-model="widMoney" placeholder="请输入金额" disabled type="number" allow-clear>
							</a-input>
							<div>{{ numberToChinese(widMoney) }}</div>
						</div>
					</div>
				</a-col>
				<!-- <a-col :span="24">
					<div style="display: flex; width: 420px">
						<span style="width: 170px">放款金额</span>
						<a-input v-model="widMoney" placeholder="请输入金额" disabled type="number" allow-clear> </a-input>
					</div>
				</a-col> -->
				<a-col :span="24" v-show="false">
					<div style="display: flex; width: 430px">
						<span style="width: 100px">支付密码</span>
						<div style="width: 300px; height: 200px">
							<div id="ipt_pwd2" class="ipt_pwd">
								<span id="LOGPASS2_SHOW">请输入密码</span>
								<input id="LOGPASS2" class="default input_search" type="password" />
								<div id="keyboardBtn2" class="ipt_pwd_rjp default"></div>
							</div>
						</div>
					</div>
				</a-col>

			</a-row>

		</a-modal>

	</div>
</template>

<script setup lang="ts">
	import { getOrderPayLogList, storeGetOrderDetail, listRole, storeGetGoodsList, withdrawalMoney, getWithdrawalMsg } from '@/apis'
	import { Message } from '@arco-design/web-vue'
	import type { TableInstanceColumns } from '@/components/GiTable/type'
	import DateRangePicker from '@/components/DateRangePicker/index.vue'
	import { useUserStore } from '@/stores'
	import { useTable } from '@/hooks'
	import { isMobile } from '@/utils'
	import has from '@/utils/has'
	import { DisEnableStatusList } from '@/constant/common'
	const detailCon = ref()
	const isExpanded = ref(false) // 控制是否展开
	const userStore = useUserStore()
	const create_time = ref([])
	const Goods = ref([])
	const open = ref<boolean>(false)
	const currentToken = userStore.token
	function numberToChinese(n) {
		const fraction = ['角', '分']
		const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
		const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
		let head = n < 0 ? '负' : ''
		n = Math.abs(n)

		let s = ''
		for (let i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
		}
		s = s || '整'
		n = Math.floor(n)

		for (let i = 0; i < unit[0].length && n > 0; i++) {
			let p = ''
			for (let j = 0; j < unit[1].length && n > 0; j++) {
				p = digit[n % 10] + unit[1][j] + p
				n = Math.floor(n / 10)
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
		}

		return head + s.replace(/(零.)*零元/, '元')
			.replace(/(零.)+/g, '零')
			.replace(/^整$/, '零元整')
	}

	const fieldName = ref('')
	const info = ref({
		linked_brbankname: '',
		linked_acctno: ""
	})
	const txVis = ref(false)
	const wid_id = ref('')
	const widMoney = ref('')

	async function _getWithdrawalMsg(item) {
		try {
			let res = await getWithdrawalMsg({
				post_params: {
					id: item.id,
				}
			})
			console.log('信息', res.data);
			info.value.linked_brbankname = res.data.linked_brbankname
			info.value.linked_acctno = res.data.linked_acctno
			txVis.value = true
		} catch (error) {
			console.log('失败');
			return false
		}
	}
	function withdrawal(item) {
		_getWithdrawalMsg(item)
		widMoney.value = item.price
		fieldName.value = item.name
		wid_id.value = item.id
		// txVis.value = true
	}

	// const interval = ref()
	// function handleTx() {
	// 	if (interval.value) {
	// 		clearInterval(interval.value);
	// 	}

	// 	interval.value = setTimeout(() => {
	// 		handleTx_model()
	// 	}, 2000)
	// }
	// let lastExecuted = 0;
	// function handleTx() {
	// 	const now = Date.now();
	// 	if (now - lastExecuted > 3000) {
	// 		lastExecuted = now;
	// 		handleTx_model();
	// 	}
	// }
	const isWithdrawing = ref(false); // 节流锁

	function handleTx() {
		if (isWithdrawing.value) return; // 锁定中，忽略点击
		isWithdrawing.value = true; // 上锁
		handleTx_model();
	}

	async function handleTx_model() {
		if (!widMoney.value) {
			Message.error('请输入提现金额')
			return false
		}
		try {
			await withdrawalMoney({
				post_params: {
					order_id: wid_id.value,
					money: widMoney.value,
				}
			})
			Message.success('提现成功')
			cancelTx()
		} catch (error) {
			console.log('失败');
			cancelTx()
			return false
		} finally {
			isWithdrawing.value = false; // 无论成功失败，最后都要解锁
		}

		// const res = await withdrawalMoney({
		// 	post_params: {
		// 		order_id: wid_id.value,
		// 		money: widMoney.value,
		// 	}
		// })
		// console.log('提现结果',res);
		// Message.success('提现成功')
		// cancelTx()
	}
	function cancelTx() {
		widMoney.value = ''
		wid_id.value = ''
		fieldName.value = ''
		txVis.value = false
		search()
	}


	const columns : TableInstanceColumns[] = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
		},
		{ title: '合同编号', align: 'center', dataIndex: 'contract_num', ellipsis: true, tooltip: true },
		{
			title: '客户名称', align: 'center', dataIndex: 'name', ellipsis: true, tooltip: true
		},
		{ title: '客户联系电话', align: 'center', dataIndex: 'mobile', ellipsis: true, tooltip: true },
		{ title: '发放时间 ', align: 'center', dataIndex: 'create_time', ellipsis: true, tooltip: true },
		{ title: '进度', align: 'center', slotName: 'status', ellipsis: true, tooltip: true },
		{ title: '本次发放金额 ', align: 'center', dataIndex: 'price', ellipsis: true, tooltip: true },
		{ title: '总金额', align: 'center', dataIndex: 'all_price', ellipsis: true, tooltip: true },
		{
			title: '累积已发放金额', align: 'center', dataIndex: 'pay_price', ellipsis: true, tooltip: true
		},
		{
			title: '待发放金额  ', align: 'center', dataIndex: 'wait_price', ellipsis: true, tooltip: true
		},
		// {
		// 	title: '回执单 ', align: 'center', slotName: 'receipt_status', ellipsis: true, tooltip: true
		// },

		{
			title: '操作',
			width: 180,

			slotName: 'action',
			align: 'center',
			fixed: 'right',
			show: true
		}
	]
	const GoodsdxList = ref([
		{
			value: 'a',
			label: '进行中',

		},
		{
			value: 'b',
			label: '成功 ',

		},
		{
			value: 'c',
			label: '失败',

		}
	])
	const GoodstypeList = ref([
		{
			value: 'a',
			label: '线上放款 ',

		},
		{
			value: 'b',
			label: '线下',

		}
	])


	const num = ref(0)
	const queryForm = reactive({
		name: "",
		mobile: "",
		contract_num: "",
		status: "",
		pay_type: "",
		start_time: '',
		end_time: '',
	})
	const List = reactive([{ name: '合同基本信息' }, { name: '客户详细信息' }, { name: '融担方信息' }])
	const onChange = (i) => {

		queryForm.start_time = i[0]
		queryForm.end_time = i[1]
		search()
	}
	const {
		tableData: dataList,
		loading,
		pagination,
		search
	} = useTable((p) => getOrderPayLogList({ post_params: { ...queryForm, currentPage: p.page, perPage: p.size } }), {
		immediate: true
	})

	onMounted(() => {
		getdeptList()
		GoodsList()
	})
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
	//关闭
	const handleOk = () => {
		open.value = false
	}
	// 重置
	const reset = () => {

		queryForm.name = ''
		queryForm.mobile = ''
		queryForm.contract_num = ''
		queryForm.status = ''
		queryForm.pay_type = ''
		queryForm.start_time = ''
		queryForm.end_time = ''
		search()
	}
	//展开
	const expandMore = () => {
		console.log(isExpanded.value)
		isExpanded.value = !isExpanded.value // 将展开状态设置为true
	}

	//下载

	function showdownload(item) {
		if (item.receipt_file.length == 0) return Message.error('暂无开票具体信息记录')
		// 生成或获取文件 URL 
		const fileUrl = item.receipt_file
		// 创建一个临时链接
		const link = document.createElement('a');
		link.href = fileUrl;
		// link.download = 'filename.ext'; // 可选，指定下载的文件名
		link.click();
	}
	// 提现回执单
	function showdownloadTx(item) {
		if (item.withdrawal_receipt_file.length == 0) return Message.error('暂无开票具体信息记录')
		// 生成或获取文件 URL 
		const fileUrl = item.withdrawal_receipt_file
		// 创建一个临时链接
		const link = document.createElement('a');
		link.href = fileUrl;
		// link.download = 'filename.ext'; // 可选，指定下载的文件名
		link.click();
	}
</script>

<style lang="scss" scoped>
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
			margin-bottom: 5px;
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