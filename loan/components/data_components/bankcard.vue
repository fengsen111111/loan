<template>
	<view class="bankcard">
		<view class="head" v-if="!props.showFlag">
			<view class="top_dot">
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot current"></view>
				<view class="line"></view>
				<view class="dot"></view>
				<view class="line"></view>
				<view class="dot"></view>
			</view>
			<view class="bottom_text">
				<view class="text finish">基本信息</view>
				<view class="text finish">详细信息</view>
				<view class="text current">银行卡核身</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">银行卡核身</view>
			<view class="info_item">
				<view class="label">账户名</view>
				<view class="value" style="border-bottom:none">
					{{state.orderInfo.name}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">证件号</view>
				<view class="value" style="border-bottom:none">
					{{state.orderInfo.id_card}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">银行卡号</view>
				<view class="value">
					<input type="text" placeholder="请输入银行卡号" v-model="formData.bank_number" :disabled="props.showFlag">
					<image src="@/static/scans.png" mode="" @click="openScan()"></image>
				</view>
			</view>
			<view class="info_item" @click="showPicker()">
				<view class="label">开户银行</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.bank_name}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label">手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.bank_mobile" maxlength="11"
						:disabled="props.showFlag">
				</view>
			</view>
			<!-- <view class="info_item" v-if="!props.showFlag">
				<view class="label" data-required>验证码</view>
				<view class="value">
					<input type="number" placeholder="请输入验证码" v-model="formData.bank_verify_code" @input="verify()">
					<view class="getCode" @click="sendCode()"
						:style="{color:state.codeTimer?'#999999':'',border:state.codeTimer?'solid 1px #999999':''}">
						{{state.codeText}}
					</view>
				</view>
			</view> -->
		</view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				选择开户银行
				<view class="confirm" @click="picker_confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>
	</view>
</template>
<!--创建时间：2024-03-29 15:45:25-->
<script setup lang="ts">
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { reactive, getCurrentInstance, onMounted } from "vue"

	const emits = defineEmits(["next"]);
	const props = defineProps({
		showFlag: { type: Boolean }
	})

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
		orderInfo: uni.getStorageSync("orderInfo"),
		column: [],
		pub_picker: false,
		select_value: 0,
		verifyFlag: true
	})

	const formData = reactive({
		bank_name: "",
		bank_number: "",
		bank_mobile: "",
	})

	onMounted(() => {
		globalProxy.$request("/loan/Bank/getBankList").then((res : Result) => {
			state.column = res.data.list
		})
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 3
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
		})
	})



	const showPicker = () => {
		if (props.showFlag) return;
		state.pub_picker = true;
	}
	const bindChange = (val : any) => {
		state.select_value = val.detail.value[0]
	}

	const picker_confirm = () => {
		formData.bank_name = state.column[state.select_value].name;
		state.select_value = 0;
		state.pub_picker = false
	}

	// const sendCode = async () => {
	// 	if (formData.bank_mobile === "") {
	// 		openTips("请输入手机号");
	// 		return;
	// 	}
	// 	if (state.codeTimer !== null) return;

	// 	// globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.bank_mobile }).then((res : Result) => {
	// 	// 	formData.bank_verify_code = res.data.code
	// 	// })
	// 	await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.bank_mobile });
	// 	// formData.bank_verify_code = res.data.code;

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
		// if (!state.verifyFlag || formData.bank_verify_code.length < 6) {
		// 	openTips("验证码校验不通过");
		// 	formData.bank_verify_code = "";
		// 	return;
		// }
		// if (formData.bank_name === "" || formData.bank_number === "" || formData.bank_mobile === "") {
		// 	openTips("资料未填写完成");
		// 	return;
		// }
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 3,
			...formData
		}).then(() => {
			emits("next");
		})
	}
	// const verify = () => {
	// 	if (formData.bank_verify_code.length >= 6) {
	// 		globalProxy.$request("/loan/Setting/checkVerifyCode", {
	// 			mobile: formData.bank_mobile,
	// 			code: formData.bank_verify_code
	// 		}).then((res : Result) => {
	// 			if (res.data.result === 1) {
	// 				state.verifyFlag = true;
	// 			} else {
	// 				state.verifyFlag = false;
	// 				openTips(res.data.message);
	// 			}
	// 		})
	// 	}
	// }
	const openScan = () => {
		if (props.showFlag) return;
		uni.chooseImage({
			count: 1,
			success: (res : any) => {
				uni.showLoading({
					title: "上传中，请稍后……"
				})
				const name_array = res.tempFilePaths[0].split("/");
				const name = name_array[name_array.length - 1]
				globalProxy.$request("", {
					file: res.tempFiles[0].path,
					fileType: "file",
					params: {
						fileSize: parseFloat((res.tempFiles[0].size / 1024).toFixed(2)),
						fileName: name,
					}
				}).then((result : Result) => {
					uni.request({
						url: "https://yhk.market.alicloudapi.com/rest/160601/ocr/ocr_bank_card.json",
						header: {
							"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
						},
						method: "POST",
						data: {
							image: result.data.url,
						},
						success: (scan : any) => {
							let scanData = scan.data;
							// formData.bank_name = scanData.bank_name;
							formData.bank_number = scanData.card_num;
						}
					})
					uni.hideLoading()
				})
			}
		})
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
	.bankcard {
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

		.picker-selected {
			height: 20vw;

			&:before {
				content: "";
				top: 0;
				position: absolute;
				border: none;
			}

			&::after {
				content: "";
				bottom: 0;
				position: absolute;
				border: none;
			}
		}

		>.mask {
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			width: 100%;
			height: 100%;
			z-index: 98;
		}

		>.picker {
			width: 100%;
			position: fixed;
			bottom: 0;
			z-index: 99;
			background: #FFFFFF;

			>.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 3vw 4vw;
				font-weight: bold;
				font-size: 4vw;
				color: #333333;

				>.cancel {
					font-size: 3.75vw;
					color: #666666;
				}

				>.confirm {
					font-size: 3.75vw;
					color: #3c9cff;
				}
			}

			.item {
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;
			margin-bottom: 2.67vw;

			>.info_item {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
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

					>input {
						flex: auto
					}

					>image {
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

					&[data-required]::before {
						content: "*";
						font-size: 3.2vw;
						color: #FF8177;
						margin-right: 1.6vw;
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