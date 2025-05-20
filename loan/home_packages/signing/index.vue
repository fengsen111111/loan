<template>
	<view class="container">
		<navbar title="合同签约核实"></navbar>
		<view class="content" v-if="state.info.order_material">
			<view class="label">核实信息</view>
			<view class="info_item">
				<view class="label">姓名</view>
				<view class="value" style="border-bottom: none;">
					{{state.info.order_material.name}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">身份证号码</view>
				<view class="value" style="border-bottom: none;">
					{{state.info.order_material.card_number}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.auth_mobile" maxlength="11" />
				</view>
			</view>
			<!-- <view class="info_item">
				<view class="label">验证码</view>
				<view class="value">
					<input type="number" placeholder="请输入验证码" v-model="formData.verify_code" @input="verify()" />
					<view class="getCode" @click="sendCode()"
						:style="{color:state.codeTimer?'#999999':'',border:state.codeTimer?'solid 1px #999999':''}">
						{{state.codeText}}
					</view>
				</view>
			</view> -->
		</view>
		<optionBt @confirm="nextStep()" showCancel cancelText="返回" cancelColor="#999999" cancelBgColor="#F6F7FB"
			@cancel="$back()">
		</optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-04-01 10:40:37-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { reactive, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface"
	import { navigateTo } from "@/utils/jump";

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		info: {},
		timeNum: 59,
		codeTimer: null,
		codeText: "发送验证码",
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",
		verifyFlag: true
	})
	const formData = reactive({
		auth_mobile: "",
		verify_code: ""
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getUnSignOrderDetail").then((res : Result) => {
			state.info = res.data
		})
	})

	const nextStep = () => {
		// if (!state.verifyFlag || formData.verify_code.length < 6) {
		// 	openTips("验证码校验不通过");
		// 	formData.verify_code = "";
		// 	return;
		// }
		// if (formData.auth_mobile === "" || formData.verify_code === "") {
		if (formData.auth_mobile === "") {
			openTips("资料未填写完成");
			return;
		}
		uni.setStorageSync("user_order_info", formData)
		navigateTo("/home_packages/contract/index")
	}

	const verify = () => {
		if (formData.verify_code.length >= 6) {
			globalProxy.$request("/loan/Setting/checkVerifyCode", {
				mobile: formData.auth_mobile,
				code: formData.verify_code
			}).then((res : Result) => {
				if (res.data.result === 1) {
					state.verifyFlag = true;
				} else {
					state.verifyFlag = false;
					openTips(res.data.message);
				}
			})
		}
	}

	// const sendCode = async () => {
	// 	if (formData.auth_mobile === "") {
	// 		openTips("请输入手机号");
	// 		return;
	// 	}
	// 	if (state.codeTimer !== null) return;

	// 	await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.auth_mobile });
	// 	// formData.verify_code = res.data.code;

	// 	state.codeText = state.timeNum + "s后重发";
	// 	state.codeTimer = setInterval(() => {
	// 		if (state.timeNum > 1) {
	// 			state.timeNum--;
	// 			state.codeText = state.timeNum + "s后重发";
	// 		} else {
	// 			clearInterval(state.codeTimer);
	// 			state.codeTimer = null;
	// 			state.codeText = "重新发送";
	// 			state.timeNum = 59;
	// 		}
	// 	}, 1000)
	// }
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

		>.content {
			padding: 4vw;
			background: #FFFFFF;

			>.label {
				font-weight: bold;
				font-size: 3.73vw;
				color: #333333;
				display: flex;
				align-items: center;
				margin-bottom: 4vw;

				&::before {
					content: "";
					width: 1.07vw;
					height: 5.33vw;
					background: #F97E39;
					border-radius: 1.33vw;
					margin-right: 1.47vw;
				}
			}

			>.info_item {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-bottom: 8.4vw;

				&:last-child {
					margin-bottom: 0;
				}

				>.value {
					width: 66.67vw;
					font-size: 3.2vw;
					color: #333333;
					padding-bottom: 2.8vw;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: solid 1px #666666;

					>.getCode {
						width: 23.2vw;
						height: 5.33vw;
						border-radius: 1.33vw;
						border: 1px solid #F97E39;
						font-weight: bold;
						font-size: 3.2vw;
						color: #F97E39;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}

				>.label {
					font-size: 3.2vw;
					color: #333333;

					&:before {
						content: "*";
						font-size: 3.2vw;
						color: #FF8177;
						margin-right: 1.6vw;
					}
				}
			}
		}
	}
</style>