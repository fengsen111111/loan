<template>
	<view class="container">
		<navbar title="数据服务授权"></navbar>
		<view class="content">
			<view class="label">核实信息</view>
			<view class="idcard">
				<view class="item" v-if="formData.id_card_image_front">
					<image :src="formData.id_card_image_front" mode=""></image>
				</view>
				<view class="item" v-if="formData.id_card_image_back">
					<image :src="formData.id_card_image_back" mode=""></image>
				</view>
			</view>
			<view class="info_item">
				<view class="label">姓名</view>
				<view class="value" style="border-bottom: none;">
					{{formData.name}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">身份证号码</view>
				<view class="value" style="border-bottom: none;">
					{{formData.id_card}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">手机号</view>
				<view class="value" style="border-bottom: none;">
					{{formData.auth_mobile}}
				</view>
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

		<view class="autograph" @click="$navigateTo('/home_packages/autograph/index',{name:formData.name})">
			点击完成手绘签名
			<image :src="formData.auth_sign_image" mode="" v-if="formData.auth_sign_image!==''"></image>
		</view>

		<optionBt @confirm="nextStep()" confirmText="提交" confirmBgColor="#1592E6" showCancel cancelText="返回"
			cancelColor="#999999" cancelBgColor="#F6F7FB" @cancel="$back()"></optionBt>

		<view class="popup" v-if="state.popup_tips">
			<view class="title">
				<view style="width: 5vw;"></view>
				温馨提示
				<u-icon name="close" size="5vw" color="#666666" @click="state.popup_tips=false"></u-icon>
			</view>
			<view class="text">确认数据服务授权吗?</view>
			<view class="btns">
				<view class="cancel" @click="state.popup_tips=false">取消</view>
				<view class="confirm" @click="confirm()">确定</view>
			</view>
		</view>
		<view class="mask" v-if="state.popup_tips" @click="state.popup_tips=false"></view>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-04-01 10:40:37-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { reactive, getCurrentInstance } from "vue";

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const props = defineProps({
		verify_code: { type: String },
		auth_mobile: { type: String },
		name: { type: String },
		id_card: { type: String },
		id_card_image_front: { type: String },
		id_card_image_back: { type: String },
		auth_sign_image: { type: String },
	})

	const state = reactive({
		timeNum: 59,
		codeTimer: null,
		codeText: "发送验证码",
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",
		autograph: "",
		checked: [],
		popup_tips: false,
		flag: true
	})

	const formData = reactive({
		...props,
		auth_sign_image: ""
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
						formData.auth_sign_image = result.data.url;
					})
				}
			})

			uni.removeStorageSync("autograph");
		}
	})

	const nextStep = () => {
		if (state.checked[0] !== 1) {
			openTips("请阅读并同意相关授权书");
			return;
		}
		if (formData.auth_sign_image === "") {
			openTips("资料未填写完成");
			return;
		}
		state.popup_tips = true;
	}

	const confirm = () => {
		if (!state.flag) return;
		state.popup_tips = false;
		state.flag = false;
		uni.showLoading({
			title: "请稍后"
		})
		globalProxy.$request("/loan/User/authorization", formData).then(() => {
			uni.hideLoading()
			uni.showToast({
				title: "数据服务授权成功",
				icon: "none",
				duration: 2000
			})
			setTimeout(() => {
				state.flag = true;
				uni.switchTab({
					url: "/pages/user_home/index"
				})
			}, 2000)

		})
	}
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

		>.mask {
			position: fixed;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, .5);
			left: 0;
			top: 0;
			z-index: 98;
		}

		>.popup {
			width: 84vw;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: #FFFFFF;
			border-radius: 1.33vw;
			padding: 2.67vw 4vw;
			z-index: 99;

			>.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
			}

			>.text {
				margin: 8vw;
				font-weight: bold;
				font-size: 3.2vw;
				color: #333333;
				text-align: center;
			}

			>.btns {
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.cancel {
					width: 34.67vw;
					height: 8vw;
					background: #F6F7FB;
					border-radius: 4vw;
					text-align: center;
					line-height: 8vw;
					font-weight: bold;
					font-size: 3.47vw;
					color: #999999;
				}

				>.confirm {
					width: 34.67vw;
					height: 8vw;
					background: #F97E39;
					border-radius: 4vw;
					text-align: center;
					line-height: 8vw;
					font-weight: bold;
					font-size: 3.47vw;
					color: #FFFFFF;
				}
			}
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
			padding: 4vw;
			background: #FFFFFF;
			margin-bottom: 4vw;

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