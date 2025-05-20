<template>
	<view class="capture">
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
				<view class="text finish">……………</view>
				<view class="text current">采集影像</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">采集影像</view>
			<view class="info_item">
				<view class="label">产调证明({{formData.house_images.length}}/3)</view>
				<view class="value">
					<image :src="item" mode="" @click="preImg(item)" v-for="(item,index) in formData.house_images" :key="index"></image>
					<view class="upload" v-if="formData.house_images.length<3&&!props.showFlag"
						@click="uploadImg('house_images')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">客户合影({{formData.worker_customer_images.length}}/3)</view>
				<view class="value">
					<image :src="item" mode="" @click="preImg(item)" v-for="(item,index) in formData.worker_customer_images" :key="index">
					</image>
					<view class="upload" v-if="formData.worker_customer_images.length<3&&!props.showFlag"
						@click="uploadImg('worker_customer_images')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">首付款凭证({{formData.house_pay_images.length}}/3)</view>
				<view class="value">
					<image :src="item" mode="" @click="preImg(item)" v-for="(item,index) in formData.house_pay_images" :key="index"></image>
					<view class="upload" v-if="formData.house_pay_images.length<3&&!props.showFlag"
						@click="uploadImg('house_pay_images')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">买卖合同({{formData.house_contract_images.length}}/3)</view>
				<view class="value">
					<image :src="item" @click="preImg(item)" mode="" v-for="(item,index) in formData.house_contract_images" :key="index">
					</image>
					<view class="upload" v-if="formData.house_contract_images.length<3&&!props.showFlag"
						@click="uploadImg('house_contract_images')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
		</view>
		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-03-30 15:22:39-->
<script setup lang="ts">
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { reactive, defineEmits, getCurrentInstance, onMounted } from "vue"

	const emits = defineEmits(["next"]);
	const props = defineProps({
		showFlag: { type: Boolean }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const state = reactive({
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成"
	})

	const formData = reactive({
		house_images: [],
		worker_customer_images: [],
		house_pay_images: [],
		house_contract_images: []
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 8
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
		})
	})
	
	const preImg = (url : string) => {
		// console.log('放大',url); 
		uni.previewImage({
			current: url,
			urls: [url]
		})
	}
	

	const nextStep = () => {
		if (formData.house_images.length === 0 || formData.worker_customer_images.length === 0 || formData.house_pay_images.length === 0 || formData.house_contract_images.length === 0) {
			openTips("资料未填写完成");
			return;
		}
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 8,
			...formData
		}).then(() => {
			emits("next");
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
	const uploadImg = (names : string) => {
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
					formData[names].push(result.data.url);
					uni.hideLoading()
				})
			}
		})
	}
</script>
<style lang='scss'>
	.capture {
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

			>.info_item {
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