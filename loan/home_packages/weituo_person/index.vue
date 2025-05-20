<template>
	<view class="container">
		<navbar title="新增受托人"></navbar>
		<view class="content">
			<view class="label">新增受托人</view>
			<view class="info_item">
				<view class="label" data-required>姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入姓名" v-model="formData.name">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>身份证号码</view>
				<view class="value">
					<input type="idcard" placeholder="请输入身份证号" v-model="formData.id_card" style="width: 100%;">
				</view>
			</view>
		</view>
		<optionBt @confirm="nextStep()" confirmText="确定"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-03-30 13:56:52-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { back } from "@/utils/jump";
	import { reactive, defineProps, getCurrentInstance, nextTick, ref } from "vue"

	const props = defineProps({
		type: { type: Number }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const uPickerRef = ref(null)

	const state = reactive({
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",


	})

	const formData = reactive({
		name: "",
		id_card: "",
	})


	const nextStep = () => {
		if (formData.id_card === "" || formData.name === "") {
			openTips("资料未填写完成");
			return;
		}
		let array : any;
		if (uni.getStorageSync("weituo_personArray")) {
			array = uni.getStorageSync("weituo_personArray");
			array.push(formData)
		} else {
			array = [];
			array.push(formData)
		}
		uni.setStorageSync("weituo_personArray", array)
		back()
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

		input {
			width: 100%;
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;
			margin-top: 2.67vw;

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
	}
</style>