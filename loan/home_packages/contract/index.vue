<template>
	<view class="container">
		<navbar title="合同确认"></navbar>

		<view class="content" v-if="state.info.order_material">
			<view class="item">
				<view class="label">身份证号码</view>
				{{$cardUtil(state.info.order_material.card_number)}}
			</view>
			<view class="item">
				<view class="label">合同编号</view>
				{{state.info.contract_num}}
			</view>
			<view class="item">
				<view class="label">合同金额(元)</view>
				{{state.info.order_material.apply_money}}
			</view>
			<view class="item">
				<view class="label">合同金额(大写)</view>
				{{convertCurrency(state.info.order_material.apply_money)}}
			</view>
			<view class="item">
				<view class="label">计息方式</view>
				{{state.info.rate_type==="day"?'按天':state.info.rate_type==="month"?'按月':state.info.rate_type==="year"?'按年':''}}
			</view>
			<view class="item">
				<view class="label">借款期数</view>
				{{state.info.order_material.loan_time}}
			</view>
			<view class="item">
				<view class="label">年利率(%)</view>
				{{state.info.order_material.loan_rate}}
			</view>
			<view class="item">
				<view class="label">还款方式</view>
				{{state.info.order_material.repayment_type}}
			</view>
		</view>

		<u-checkbox-group v-model="state.checked">
			<view style="display: flex;font-size: 3.2vw;color: #333333;padding: 0 6.4vw;margin-bottom: 8vw;">
				<u-checkbox :name="1" shape="circle"></u-checkbox>
				<view style="flex: 1;">本人已阅读并理解<text style="color: #1592E6;"
						@click="$navigateTo('/pages/rich_text/index',{url:'/loan/Setting/getDigitalAgreeContent',title:'电子签意授权书'})">《电子签意授权书》</text><text
						style="color: #1592E6;"
						@click="$navigateTo('/pages/rich_text/index',{url:'/loan/Setting/getUserMessageAuthContent',title:'征信授权书'})">《征信授权书》</text>并愿意遵守相关规则
				</view>
			</view>
		</u-checkbox-group>

		<view class="autograph"
			@click="$navigateTo('/home_packages/autograph/index',{name:state.info.order_material.leader_name||state.info.order_material.name})">
			点击完成手绘签名
			<image :src="formData.sign_image" mode="" v-if="formData.sign_image!==''"></image>
		</view>

		<optionBt @confirm="nextStep()" confirmText="提交" confirmBgColor="#1592E6" showCancel cancelText="返回"
			cancelColor="#999999" cancelBgColor="#F6F7FB" @cancel="$back()">
		</optionBt>

		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-04-01 10:58:07-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { onShow } from "@dcloudio/uni-app"
	import { reactive, getCurrentInstance } from "vue";

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		checked: [],
		autograph: "",
		info: {} as any,

		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",

		flag: true
	})

	const formData = reactive({
		verify_code: uni.getStorageSync("user_order_info").verify_code,
		auth_mobile: uni.getStorageSync("user_order_info").auth_mobile,
		order_id: "",
		sign_image: ""
	})

	globalProxy.$request("/loan/Order/getUnSignOrderDetail").then((res : Result) => {
		state.info = res.data;
		formData.order_id = res.data.id
	})

	onShow(() => {
		if (uni.getStorageSync("autograph") === "empty") {
			state.autograph = "";
			uni.removeStorageSync("autograph");
			return;
		}
		if (uni.getStorageSync("autograph")) {
			state.autograph = uni.getStorageSync("autograph")
			const name_array = state.autograph.split("/");
			const name = name_array[name_array.length - 1]
			uni.getFileSystemManager().getFileInfo({
				filePath: state.autograph,
				success: (res : any) => {
					globalProxy.$request("", {
						file: state.autograph,
						fileType: "file",
						params: {
							fileSize: parseFloat((res.size / 1024).toFixed(2)),
							fileName: name,
						}
					}).then((result : Result) => {
						formData.sign_image = result.data.url;
					})
				}
			})
			uni.removeStorageSync("autograph");
		}
	})

	const convertCurrency = (money : any) => {
		var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
		var cnIntRadice = ['', '拾', '佰', '仟']
		var cnIntUnits = ['', '万', '亿', '兆']
		var cnDecUnits = ['角', '分', '毫', '厘']
		var cnInteger = '整'
		var cnIntLast = '元'
		var maxNum = 999999999999999.9999
		let integerNum : string
		let decimalNum : string
		var chineseStr = ''
		let parts : string[]
		if (money === '') {
			return ''
		}
		money = parseFloat(money)
		if (money >= maxNum) {
			return ''
		}
		if (money === 0) {
			chineseStr = cnNums[0] + cnIntLast + cnInteger
			return chineseStr
		}
		money = money.toString()
		if (money.indexOf('.') === -1) {
			integerNum = money
			decimalNum = ''
		} else {
			parts = money.split('.')
			integerNum = parts[0]
			decimalNum = parts[1].substr(0, 4)
		}
		if (parseInt(integerNum, 10) > 0) {
			var zeroCount = 0
			var IntLen = integerNum.length
			for (var i = 0; i < IntLen; i++) {
				var n = integerNum.substr(i, 1)
				var p = IntLen - i - 1
				var q = p / 4
				var m = p % 4
				if (n === '0') {
					zeroCount++
				} else {
					if (zeroCount > 0) {
						chineseStr += cnNums[0]
					}
					zeroCount = 0
					chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
				}
				if (m === 0 && zeroCount < 4) {
					chineseStr += cnIntUnits[q]
				}
			}
			chineseStr += cnIntLast
		}
		if (decimalNum !== '') {
			var decLen = decimalNum.length
			for (i = 0; i < decLen; i++) {
				n = decimalNum.substr(i, 1)
				if (n !== '0') {
					chineseStr += cnNums[Number(n)] + cnDecUnits[i]
				}
			}
		}
		if (chineseStr === '') {
			chineseStr += cnNums[0] + cnIntLast + cnInteger
		} else if (decimalNum === '') {
			chineseStr += cnInteger
		}
		return chineseStr
	}

	const openTips = (text : string) => {
		state.tipsText = text;
		state.tips_popup = true;
		if (state.tips_timer !== null) {
			clearTimeout(state.tips_timer);
		}
		state.tips_timer = setTimeout(() => {
			state.tips_popup = false;
		}, 2000)
	}

	const nextStep = () => {
		if (!state.flag) return;
		if (state.checked[0] !== 1) {
			openTips("请阅读并同意相关授权书");
			return;
		}
		if (formData.sign_image === "") {
			openTips("资料未填写完成")
			return
		}
		state.flag = false;
		uni.showLoading({
			title: "请稍后",
			mask: true
		})
		globalProxy.$request("/loan/Order/signOrder", formData).then(() => {
			uni.hideLoading();
			uni.showToast({
				mask: true,
				title: "签约成功",
				icon: "success",
				duration: 2000
			})
			setTimeout(() => {
				state.flag = true;
				uni.switchTab({
					url: "/pages/user_home/index"
				})
			}, 2000)
		}).catch((err:any) => {
			// console.log('失败',err);
			uni.hideLoading();
			uni.showToast({
				mask: true,
				title: err.message,
				icon: "none",
				duration: 2000
			})
			state.flag = true;
		})
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		.tips_popup {
			position: fixed;
			bottom: 12vh;
			left: 50%;
			transform: translateX(-50%);
			width: 54.13vw;
			height: 8vw;
			background: rgba(102, 102, 102, .8);
			border-radius: 1.33vw;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			font-size: 3.47vw;
			color: #FFFFFF;
		}

		>.autograph {
			height: 40vw;
			background: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			font-size: 4.8vw;
			color: #999999;
			position: relative;

			>image {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				background: #FFFFFF;
			}
		}

		>.content {
			margin: 4vw 0;
			padding: 2.67vw 6.4vw;
			background: #FFFFFF;

			>.item {
				display: flex;
				align-items: center;
				margin-bottom: 4.3vw;
				font-weight: 500;
				font-size: 3.2vw;
				color: #333333;

				&:last-child {
					margin-bottom: 0;
				}

				>.label {
					width: 25vw;
				}
			}
		}
	}
</style>