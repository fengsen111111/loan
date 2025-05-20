<template>
	<view class="container">
		<navbar title="产品详情"></navbar>
		<view class="content">
			<view class="title">{{state.info.name}}</view>
			<view class="box">
				<view class="label">
					产品简介
				</view>
				<view class="info_list">
					额度范围:<text>{{state.info.top_limit}}</text>
				</view>
				<view class="info_list">
					支持期限:<text>{{state.info.loan_cycle}}</text>
				</view>
				<view class="info_list">
					利率:<text>{{state.info.rate_range}}</text>
				</view>
				<view class="info_list">
					出款时效:<text>{{state.info.loan_times}}</text>
				</view>
				<view class="info_list">
					贷款方式:<text>{{state.info.type==="a"?'借款':state.info.type==="b"?'抵押':''}}</text>
				</view>
				<view class="info_list">
					还款方式:<text>{{state.info.repayment_method}}</text>
				</view>
				<view class="info_list">
					产品特色:<view>{{state.info.special_des}}</view>
				</view>
			</view>

			<view class="box">
				<view class="label">
					准入条件
				</view>
				<view class="info_list">
					年龄范围:<text>{{state.info.age_demand}}</text>
				</view>
				<view class="info_list">
					征信要求:<view>{{state.info.credit_demand}}</view>
				</view>
				<view class="info_list">
					抵/质押物要求:<view>{{state.info.goods_demand}}</view>
				</view>
				<view class="info_list">
					其他:<view>{{state.info.other}}</view>
				</view>
			</view>
		</view>
		<optionBt showCancel cancelText="一键分享" cancelBgColor="#109181" cancelColor="#FFFFFF" @cancel="share()"
			@confirm="nextStep()"></optionBt>

		<view class="share_popup" v-if="state.share_popup">
			<view class="close" @click="state.share_popup = false">
				<u-icon name="close" size="5vw" color="#666666"></u-icon>
			</view>
			<image src="../../static/work_active.png" mode=""></image>
			<view class="svae_img">保存图片</view>
		</view>
		<view class="mask" v-if="state.share_popup"></view>
	</view>
</template>

<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { navigateTo } from "@/utils/jump";

	import { reactive, defineProps, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		info: {} as any,
		share_popup: false
	})

	const props = defineProps({
		id: {
			type: String,
		},
		type: {
			type: Number
		},
		order_id: {
			type: String
		}
	})

	onMounted(() => {
		globalProxy.$request("/loan/Goods/getGoodsDetail", {
			goods_id: props.id
		}).then((res : Result) => {
			state.info = res.data
			uni.setStorageSync("order_type", state.info.type)
			uni.setStorageSync("loan_time", state.info.loan_cycle)
			uni.setStorageSync("rate_range", state.info.rate_range)
		})
	})

	const share = () => {
		state.share_popup = true
	}

	const nextStep = () => {
		if (props.order_id) {
			uni.setStorageSync("order_id", props.order_id)
		} else {
			uni.removeStorageSync("order_id")
		}
		uni.removeStorageSync("companyArray");
		uni.removeStorageSync("personArray");
		uni.removeStorageSync("ownerArray");
		uni.removeStorageSync("houseArray");
		navigateTo('/home_packages/data_entry/index', { id: props.id, type: props.type })
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.mask {
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, .5);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 98;
		}

		>.share_popup {
			position: fixed;
			width: 80vw;
			height: 80vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			z-index: 99;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: center;
			justify-content: center;

			>.svae_img {
				position: absolute;
				bottom: -15.67vw;
				left: 50%;
				transform: translateX(-50%);
				width: 26.67vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 3.73vw;
				color: #FFFFFF;
			}

			>image {
				width: 43vw;
				height: 43vw;
			}

			>.close {
				position: absolute;
				top: 3.87vw;
				right: 3.87vw;
			}
		}

		>.content {
			padding: 4vw;

			>.box {
				padding: 4vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin: 2.67vw 0;

				>.info_list {
					font-weight: bold;
					font-size: 3.2vw;
					color: #333333;
					margin-bottom: 2.8vw;

					>text {
						font-weight: 500;
						font-size: 3.2vw;
						color: #333333;
						margin-left: 2.67vw;
					}

					>view {
						font-weight: 500;
						font-size: 3.2vw;
						color: #333333;
						margin: 1.47vw 0;
					}
				}

				>.label {
					display: flex;
					align-items: center;
					font-weight: bold;
					font-size: 3.73vw;
					color: #333333;
					margin-bottom: 2.67vw;

					&:before {
						content: "";
						width: 1.07vw;
						height: 5.33vw;
						background: #F97E39;
						border-radius: 1.33vw;
						margin-right: 2.67vw;
					}
				}
			}

			>.title {
				height: 8vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding: 0 4vw;
				display: flex;
				align-items: center;
				font-weight: bold;
				font-size: 3.73vw;
				color: #333333;
			}
		}
	}
</style>