<template>
	<view class="confirminfo">
		<view class="head">
			<view class="top_dot">
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot current"></view>
			</view>
			<view class="bottom_text">
				<view class="text finish">基本信息</view>
				<view class="text finish">……………</view>
				<view class="text finish">补充资料</view>
				<view class="text current">信息确认</view>
			</view>
		</view>

		<information v-if="props.type===1" showFlag></information>
		<information1 v-if="props.type===2" showFlag></information1>
		<detailed v-if="props.type===1" showFlag></detailed>
		<detailed1 v-if="props.type===2" showFlag></detailed1>
		<!-- <bankcard showFlag></bankcard> -->
		<borrowing showFlag></borrowing>
		<borrower showFlag></borrower>
		<rongdan showFlag></rongdan>
		<houseproperty showFlag></houseproperty>
		<!-- <capture showFlag></capture> -->
		<otherinfo showFlag></otherinfo>

		<view style="height: 20vw;"></view>
		<optionBt showCancel cancelText="信息编辑" cancelColor="#999999" cancelBgColor="#F6F7FB" @cancel="skipStep()"
			@confirm="nextStep()" confirmBgColor="#109181" confirmText="提交" v-if="state.botShow"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-03-30 15:41:06-->
<script setup lang="ts">
	import information from "./information.vue";
	import information1 from "./information1.vue";
	import detailed from "./detailed.vue";
	import detailed1 from "./detailed1.vue";
	// import bankcard from "./bankcard.vue";
	import borrowing from "./borrowing.vue";
	import borrower from "./borrower.vue"
	import rongdan from "./rongdan.vue";
	import houseproperty from "./houseproperty.vue";
	// import capture from "./capture.vue";
	import otherinfo from "./otherinfo.vue";

	import optionBt from "@/components/option-bt.vue"

	import { reactive, getCurrentInstance } from "vue"

	const emits = defineEmits(["next", "back"]);

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const state = reactive({
		front: "",
		behind: "",
		timeNum: 59,
		codeTimer: null,
		codeText: "发送验证码",
		checked: [1],
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",

		botShow: true
	})

	const props = defineProps({
		type: {
			type: Number
		}
	})

	uni.request({
		url: "https://api.qfcss.cn/decoration/Setting/ctlLoan",
		method: "POST",
		success: (res : any) => {
			if (res.data.data.result === "N") {
				state.botShow = false
			} else {
				state.botShow = true;
			}
		},
		complete: (err : any) => {
			if (err.statusCode === 404) {
				state.botShow = true;
			}
		}
	})

	// const sendCode = () => {
	// 	if (formData.phone === "") {
	// 		openTips("请输入手机号");
	// 		return;
	// 	}
	// 	console.log(state.codeTimer);
	// 	if (state.codeTimer !== null) return;
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

	const nextStep = () => {
		globalProxy.$request("/loan/Order/submitOrder", {
			order_id: uni.getStorageSync("order_id")
		}).then(() => {
			emits("next");
		})
	}

	const skipStep = () => {
		uni.removeStorageSync("companyArray");
		uni.removeStorageSync("personArray");
		uni.removeStorageSync("ownerArray");
		uni.removeStorageSync("houseArray");
		emits("back");
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
</script>
<style lang='scss'>
	.confirminfo {
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
			margin-bottom: 2.67vw;

			>.info_item1 {
				margin-bottom: 5.6vw;

				>.value {
					width: 100%;
					font-size: 3.2vw;
					color: #333333;
					padding-top: 2.8vw;
					display: flex;
					align-items: center;
					justify-content: space-between;

					>image {
						width: 26.67vw;
						height: 22.67vw;
						border-radius: 1.33vw;
					}

					>.upload {
						width: 26.67vw;
						height: 22.67vw;
						border-radius: 1.33vw;
						border: 1px dotted #999999;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						font-size: 3.2vw;
						color: #999999;
					}

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

			>.option1 {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 5.6vw;

				>.add_item {
					width: 80vw;
					height: 8vw;
					border-radius: 1.33vw;
					border: 1px dotted #999999;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.2vw;
					color: #999999;
				}
			}

			>.table_item1 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 5.2vw;
				padding: 0 0 0 2.67vw;

				>.item {
					font-size: 2.67vw;
					color: #333333;
					display: flex;
					align-items: center;
					justify-content: center;

					>image {
						width: 5vw;
						height: 5vw;
						margin-right: 3.33vw;
					}

					&:nth-child(1) {
						width: 23vw;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					&:nth-child(2) {
						width: 14vw;
					}
				}
			}

			>.table_title1 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 1.4vw 2.67vw;
				border-bottom: solid 1px #999999;
				margin-top: 3vw;

				>.item {
					font-size: 3.2vw;
					color: #333333;

					&:last-child {
						width: 13vw;
						text-align: right;
					}
				}
			}

			>.option {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 5.6vw;

				>.add_item {
					width: 40vw;
					height: 8vw;
					border-radius: 1.33vw;
					border: 1px dotted #999999;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.2vw;
					color: #999999;
				}
			}

			>.table_item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 5.2vw;
				padding: 0 2.67vw;

				>.item {
					font-size: 2.67vw;
					color: #333333;
					display: flex;
					align-items: center;
					justify-content: center;

					&:nth-child(1) {
						width: 16.4vw;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					&:nth-child(2) {
						width: 14vw;
					}
				}
			}

			>.table_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 1.4vw 2.67vw;
				border-bottom: solid 1px #999999;
				margin-top: 3vw;

				>.item {
					font-size: 3.2vw;
					color: #333333;
				}
			}

			>.info_item {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-bottom: 3.4vw;
				margin-top: 5.47vw;

				>.value {
					width: 66.67vw;
					font-size: 3.2vw;
					color: #333333;
					padding-bottom: 2.8vw;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: solid 1px #666666;

					image {
						width: 5.33vw;
						height: 5.33vw;
					}

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

			>.idcard {
				margin: 4vw 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.item {
					width: 40.8vw;
					height: 22.93vw;
					border-radius: 1.33vw;
					border: 1px dotted #999999;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-weight: bold;
					font-size: 3.2vw;
					color: #999999;
					position: relative;
					overflow: hidden;

					>image {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.73vw;
				color: #333333;
				display: flex;
				align-items: center;

				&::before {
					content: "";
					width: 1.07vw;
					height: 5.33vw;
					background: #F97E39;
					border-radius: 1.33vw;
					margin-right: 1.47vw;
				}
			}
		}

		>.head {
			background: #FFFFFF;
			margin: 2.67vw 0;
			padding: 2.67vw 4vw;

			>.top_dot {
				width: calc(100% - 8.14vw);
				padding: 0 4.07vw;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.line {
					width: 8vw;
					height: 0.53vw;
					background: #999999;
					border-radius: 1.33vw;
				}

				>.dot {
					width: 2.67vw;
					height: 2.67vw;
					background: #999999;
					border-radius: 1.33vw;
				}

				>.current {
					background: #F97E39;
				}

				>.finish {
					background: #109181;
				}
			}

			>.bottom_text {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 400;
				font-size: 2.67vw;
				color: #999999;

				>.current {
					color: #F97E39;
				}

				>.finish {
					color: #109181;
				}
			}
		}
	}
</style>