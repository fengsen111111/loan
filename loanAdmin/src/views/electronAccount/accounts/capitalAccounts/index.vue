<template>
	<div class="gi_page">
		<a-card class="general-card">
			<GiTable row-key="id" :data="dataList" :columns="columns" :loading="loading"
				:scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
				:disabledTools="['fullscreen', 'refresh', 'size', 'setting']" @refresh="search">
				<template #custom-left>

				</template>
				<template #status="{ record }">
					<a-tag v-if="record.status == 'Y'" color="arcoblue" size="small">启用</a-tag>
					<a-tag v-else color="red" size="small">禁用</a-tag>
				</template>
				<template #action="{ record }">
					<a-space>
						<a-link title="转账" @click="showModal(record, true)">转账 </a-link>
						<a-link title="提现" @click="showModal(record, false)">提现</a-link>
						<a-link title="交易明细" @click="showModalmx(record)">交易明细 </a-link>
					</a-space>
				</template>
			</GiTable>
		</a-card>
		<a-modal :visible="open" title="交易明细" @ok="handleOk" width="80%" @cancel="open = false">
			<template #footer>
				<a-button key="back" @click="open = false">取消</a-button>
				<a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
			</template>
			<a-space direction="vertical" :style="{ width: '100%' }">
				<a-collapse :default-active-key="['1']" :show-expand-icon="!hideIcon" :expand-icon-position="position">
					<a-collapse-item header="提现记录" key="1">
						<GiTable row-key="id" :data="dataList1" :columns="columns1"
							:scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
							:disabledTools="['fullscreen', 'refresh', 'size', 'setting']">
							<template #status="{ record }">
								{{ record.status == 'a' ? '提现中' : record.status == 'b' ? '提现成功' : '提现失败' }}
							</template>
						</GiTable>
					</a-collapse-item>
				</a-collapse>
			</a-space>
			<a-space direction="vertical" :style="{ width: '100%' }">
				<a-collapse :default-active-key="['1']" :show-expand-icon="!hideIcon" :expand-icon-position="position">
					<a-collapse-item header="转账记录" key="1">
						<GiTable row-key="id" :data="dataList2" :columns="columns2"
							:scroll="{ x: '100%', y: '100%', minWidth: 1000 }" :pagination="false"
							:disabledTools="['fullscreen', 'refresh', 'size', 'setting']">
							<template #custom-left>
								<a-row class="grid-demo2" :gutter="24">
									<a-col :span="18">
										<div style="display: flex; ">
											<div class="name">进件时间</div>
											<DateRangePicker v-model="renTime" @change="timechange" :show-time="false" format="YYYY-MM-DD" />
										</div>
									</a-col>
									<a-col :span="3">
										<a-button @click="downloadExcel" type="primary">导出excel表格</a-button>
									</a-col>
								</a-row>
							</template>
							<template #status="{ record }">
								{{ record.status == 'a' ? '转账中' : record.status == 'b' ? '转账成功' : '转账失败' }}
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
							<template #actionTwo="{ record }">
								<a-space v-if="record.receipt_status == 'c'">
									<a-link @click="showdownload(record)">下载 </a-link>
								</a-space>
							</template>
						</GiTable>
					</a-collapse-item>
				</a-collapse>
			</a-space>
		</a-modal>

		<a-modal :visible="open1" :title="conter ? '转账' : '提现'" @ok="handleOk1" @cancel="HHdemo" :width="conter?'800px':''">
			<a-row class="grid-demo">
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width:110px">助贷方名称:</span>
						<!-- <a-cascader :options="capitalList" :field-names="fieldNames" v-model="Form.capital_id"
              placeholder="请选择助贷方" /> -->
						<div>{{ fieldName }}</div>
					</div>
				</a-col>
				<a-col :span="24">
					<div style="display: flex; width: 420px">
						<span style="width: 170px">输入金额</span>
						<a-input v-model="Form.money" placeholder="请输入金额" type="number" allow-clear> </a-input>
					</div>
				</a-col>
				<a-col :span="24" v-if="!conter">
					<div style="display: flex; width: 390px">
						<span style="width: 160px">绑卡协议号</span>
						<a-cascader :options="bankDate" v-model="Form.linked_agrtno" placeholder="请选择银行卡号/账户" />
					</div>
				</a-col>
				<a-col :span="24" v-show="conter">
					<div style="display: flex; width: 430px">
						<span style="width: 100px">支付密码</span>
						<div style="width: 300px; height: 240px">
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
		<a-modal :visible="open2" title="验证码验证" @ok="handleOk2" width="80%" @cancel="HHdemo1">
			<a-row class="grid-demo">
				<a-col :span="24">
					<div style="display: flex; width: 400px">
						<span style="width: 150px">验证码</span>
						<a-input v-model="VerifyCode" placeholder="请输入验证码" allow-clear type="number"></a-input>

					</div>
				</a-col>
			</a-row>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
	import { getStoreCapitalList, getRandom, getTransferAccountsList, getCapitalWithdrawalList, transferAccounts, withdrawal, submitVerifyCode,getLLBankList } from '@/apis'
	import { Message } from '@arco-design/web-vue'
	import type { TableInstanceColumns } from '@/components/GiTable/type'
	import DateRangePicker from '@/components/DateRangePicker/index.vue'
	import { useUserStore } from '@/stores'
	import { useTable } from '@/hooks'
	import { isMobile } from '@/utils'
	import has from '@/utils/has'
	import { DisEnableStatusList } from '@/constant/common'
	defineOptions({ name: 'MonitorOnline' })
	const data = [
		{
			label: 'Name',
			value: 'Socrates'
		},
		{
			label: 'Mobile',
			value: '123-1234-1234'
		},
		{
			label: 'Residence',
			value: 'Beijing'
		},
		{
			label: 'Hometown',
			value: 'Beijing'
		},
		{
			label: 'Address',
			value: 'Yingdu Building, Zhichun Road, Beijing'
		}
	]
	const fieldName = ref('')
	const capitalList = ref([])
	const fieldNames = { value: 'id', label: 'name' }
	const dataList = ref([])
	const position = ref('right')
	const VerifyCodeid = ref('')
	const VerifyCode = ref('')
	const hideIcon = ref(false)
	const dataList1 = ref([])
	const dataList2 = ref([])
	const open = ref<boolean>(false)
	const open1 = ref<boolean>(false)
	const open2 = ref<boolean>(false)
	const conter = ref(true)
	let Form = reactive({
		capital_id: '',
		money: '',
		password: '',
		random_key: '',
		linked_agrtno:'',//绑卡协议号
	})


	const showModal = (item : any, isshow : boolean) => {
		conter.value = isshow
		Form.capital_id = item.id
		fieldName.value = item.name
		console.log("开始获取随机因子")
		CaptRandom(item)
		document.getElementById('LOGPASS2').value = '';
		open1.value = true
		// console.log('item,show',item,isshow);
		if(conter.value == false){
			_getLLBankList(item)
		}
	}

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

	const handleOk = () => {
		setTimeout(() => {
			open.value = false
		}, 2000)
	}
	const handleOk2 = async () => {
		try {
			const res = await submitVerifyCode({
				post_params: {
					scene: conter.value ? 'a' : 'b',
					transfer_id: conter.value ? VerifyCodeid.value : '',
					withdrawal_id: !conter.value ? VerifyCodeid.value : '',
					verify_code: VerifyCode.value
				}
			})
			Message.success('验证成功')
			HHdemo1()

			return true
		} catch (error) {
			return false
		}
	}
	const handleCancel = () => {
		open.value = false
	}
	const userStore = useUserStore()
	const currentToken = userStore.token
	const columns : TableInstanceColumns[] = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
		},
		{ title: '账户名称', dataIndex: 'name', ellipsis: true, tooltip: true },
		{ title: '账户', dataIndex: 'account', ellipsis: true, tooltip: true },
		{ title: '账户状态', slotName: 'status', ellipsis: true, tooltip: true },
		{ title: '牌照暂存余额', dataIndex: 'license_plate_money', ellipsis: true, tooltip: true },
		{ title: '助贷方余额', dataIndex: 'money', ellipsis: true, tooltip: true },
		{ title: '账号管理链接', width: 200, dataIndex: 'account_url', },
		{
			title: '操作',
			slotName: 'action',
			width: 280,
			align: 'center',
			fixed: 'right'
		}
	]
	const columns1 = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
		},
		{ title: '提现发起时间 ', dataIndex: 'create_time', ellipsis: true, tooltip: true },
		{ title: '提现金额  ', dataIndex: 'money', ellipsis: true, tooltip: true },
		{ title: '提现状态', slotName: 'status', ellipsis: true, tooltip: true },
		{ title: '提现失败原因  ', dataIndex: 'reason', ellipsis: true, tooltip: true },

	]
	const columns2 = [
		{
			title: '序号',
			width: 66,
			align: 'center',
			render: ({ rowIndex }) => h('span', {}, rowIndex + 1)
		},
		{ title: '转账发起时间 ', dataIndex: 'create_time', ellipsis: true, tooltip: true },
		{ title: '转账金额  ', dataIndex: 'money', ellipsis: true, tooltip: true },
		{ title: '转账状态', slotName: 'status', ellipsis: true, tooltip: true },
		{ title: '转账失败原因  ', dataIndex: 'reason', ellipsis: true, tooltip: true },
		{ title: '回执单 ', align: 'center', slotName: 'receipt_status', ellipsis: true, tooltip: true },
		{
			title: '操作',
			slotName: 'actionTwo',
			align: 'center',
			fixed: 'right',
			show: true
		}

	]
	const queryForm = reactive({})
	const options_set = ref({})

	onMounted(() => {
		getList()
		// CapitalList()
	})
	//获取接收债权方
	const CapitalList = async () => {
		try {
			const res = await getStoreCapitalList()
			capitalList.value = res.data.list
			console.log(capitalList.value)
			return true
		} catch (error) {
			return false
		}
	}
	//获取随机因子
	const passwordInstance : any = ref(null);
	const CaptRandom = async (item) => {
		console.log("第一步，暂未调用控件")
		try {
			const res = await getRandom({
				post_params: {
					type: 'a',
					capital_id: item.id
				}
			})
			console.log("第二步，开始初始化控件")
			passwordInstance.value = initPassword(res.data) //初始化
			console.log("初始化控件成功")
			options_set.value = res.data
			Form.random_key = res.data.random_key
			return true
		} catch (error) {
			return false
		}
	}

	// 初始化密码控件
	function initPassword(options) {
		// eslint-disable-next-line
		const passowrd = new showKeyBord({
			png: '//mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/state-secret/img', // 图片路径，用这个就行了，也可以下载到本地
			click_objId: '#keyboardBtn2', // 触发显示键盘的Dom节点Id
			regExp1: '[\\S\\s]', // 输入过程限制的正则，不匹配正则的字符不让输入
			regExp2: '^[\\S\\s]{6,12}$', // 输入完成后的正则，与getValid()对应，判断输入值是否匹配该正则
			Input_texId: '#LOGPASS2', // 接收内容的Dom节点Id
			parent_objId: '#ipt_pwd2', // 将键盘插入到何处的Dom节点Id
			placeholderId: '#LOGPASS2_SHOW', // span标签的id，该span用于模拟Input_texId的placeholder
			len: '12', // 表示最大允许输入多少个字符[可以不传递]
			keyBordLeft: '',
			keyBordTop: '',
			chaosMode: 0, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
			clickStatus: 0, // 按键状态,0:鼠标划过、悬浮时按键无变化;1:鼠标划过、悬浮时按键的颜色变化,默认值0
			titlefont: '安全支付输入',
			backfont: '退 格',
			capsfont: '切换大/小写',
			surefont: '确定',
			isen: false,
			callBack: () => { }, // 密码校验成功回调
			errorCallBack: (e) => {
				console.log(e)
			}, // 密码校验失败回调
			rsaPublicKey: "", // RSA加密必须参数，国密加密可不要
			sm2KeyHex: options.sm2_key_hex, // 国密加密必须参数，RSA加密可不要
			license: options.license // 必须参数
		})
		passowrd.initOptions()
		return passowrd
	}

	function getpassword() {
		console.log("第三步，生成密码")
		// 获取国密密文
		passwordInstance.value.setRandKey(options_set.value.random_value) // 先设置随机key
		const gmpassword = passwordInstance.value.getOutputSM() // 国密加密密码
		// hash用于比对密码是否一致，同一个密码加密密文可能不同，hash一定相同
		const hash = passwordInstance.value.getHash() // RSA加密密码
		// cet.value.hash = hash
		// cet.value.gmpassword = gmpassword
		// console.log('国密密码是', gmpassword)
		// console.log("支付密码HASH是", hash)
		return gmpassword
	}
	const handleOk1 = async () => {
		Form.password = getpassword()
		// console.log(Form.password, Form)
		VerifyCodeid.value = ''
		VerifyCode.value = ''
		if (conter.value) {
			try {
				const res = await transferAccounts({
					post_params: Form
				})
				if (res.data?.id) {
					open2.value = true
					VerifyCodeid.value = res.data.id
				}
				Message.success('支付成功')
				HHdemo()
				return true
			} catch (error) {
				return false
			}
		} else {
			try {
				const res = await withdrawal({
					post_params: Form
				})
				// if (res.data?.id) {
				// 	open2.value = true
				// 	VerifyCodeid.value = res.data.id
				// }
				Message.success('提现成功')
				HHdemo()
				return true
			} catch (error) {
				return false
			}
		}
	}

	const bankDate = ref([])//连连号银行卡列表
	const _getLLBankList = async (item) =>{
		const res = await getLLBankList({
			post_params:{
				type: 'a',//a助贷方提现b订单交易提现
				capital_id: item.id,//助贷方ID
				order_id: '',//订单ID
	  	}
		})
		console.log('res连连银行卡账户',res.data.list);
		bankDate.value = res.data.list.map((iss)=>{
			return {
				value: iss.linked_agrtno,
				label: iss.linked_acctno
			}
		})
  }

	const checkItem = ref({})

	//明细
	const showModalmx = (item : any) => {
		open.value = true
		checkItem.value = item
		getCapitalWithdrawalList({
			post_params: {
				capital_id: item.id
			}
		}).then((res) => {
			dataList1.value = res.data.list
		})
		getTransferAccountsList({
			post_params: {
				capital_id: item.id
			}
		}).then((res) => {
			dataList2.value = res.data.list
		})
	}
	// 重置
	const reset = () => {

	}
	const HHdemo = () => {
		open1.value = false
		Form.capital_id = ''
		Form.money = ''
		Form.password = ''
	}
	const HHdemo1 = () => {
		open2.value = false
		VerifyCode.value = ''
		VerifyCodeid.value = ''
	}
	//获取商品信息
	const getList = async () => {
		try {
			const res = await getStoreCapitalList()
			dataList.value = res.data.list
			return true
		} catch (error) {
			return false
		}
	}

	const handleSelect = (v) => {
		console.log(v)
	}

	// 新增
	const renTime = ref([])
	function timechange(e) {
		// console.log('1',e);
		if(!e){
			queryForm.start_time = ''
			queryForm.end_time = ''
		}else{
			queryForm.start_time = e[0]
			queryForm.end_time = e[1]
		}
		
		getTransferAccountsList({
			post_params: {
				capital_id: checkItem.value.id,
				...queryForm
			}
		}).then((res) => {
			dataList2.value = res.data.list
		})
	}

  import { saveAs } from 'file-saver';
  import * as XLSX from 'xlsx';

	//导出
	async function downloadExcel() {
		try {
			const response = await getTransferAccountsList({
				post_params: {
					capital_id: checkItem.value.id,
					...queryForm
				}
			});

			if (response.data.list.length == 0) return Message.error('暂无信息')
			// 转换数据为二维数组
			response.data.list = response.data.list.map((item) => {
				return {
					create_time:item.create_time,
					money:item.money,
					status:item.status=='a'?'转账中':item.status=='b'?'转账成功':'转账失败',
					reason:item.reason,
					receipt_status:item.receipt_status == 'a'? '未处理' : item.receipt_status == 'b'? '生成中': item.receipt_status == 'c'? '成功': '不支持'
				}
			})
			const formattedData = response.data.list.map(item => [
		  	item.create_time,
			  item.money,
				item.status,
				item.reason,
				item.receipt_status
			]);

			const worksheet = XLSX.utils.aoa_to_sheet([[
				'转账发起时间', '转账金额', '转账状态', '转账失败原因', '回执单'], ...formattedData]);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
			saveAs(blob, '转账记录.xlsx');
		} catch (error) {
			console.error('下载失败:', error);
		}
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
		margin-top: 8px;
		font-size: 12px;
		font-weight: 700;
	}

	#LOGPASS2_SHOW {
		color: #737a87;
		font-size: 14px;
		font-weight: 400;
	}

	.grid-demo {
		div {
			margin-bottom: 10px;
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

	.name {
		width: 70px;
		text-align: right;
		margin-right: 10px;
		margin-top: 8px;
		font-size: 12px;
		font-weight: 700;
	}

	:deep(.arco-collapse-item-header-title:before) {
		background-color: rgb(var(--primary-6));
		border-radius: 4px;
		content: '';
		height: 18px;
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		margin-right: 10px;
	}

	:deep(.arco-collapse-item-header-title) {
		margin-left: 10px;
	}
</style>