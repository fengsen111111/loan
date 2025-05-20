<template>
	<view class="container">
		<navbar title="待办件详情"></navbar>
		<view class="content" v-if="state.info.order_material">

			<view class="info">
				<view class="item">
					<view class="label">姓名</view>
					{{state.info.order_material.name}}
				</view>
				<view class="item">
					<view class="label">手机号</view>
					{{state.info.order_material.mobile}}
					<image src="@/static/call.png" mode="" @click="callPhone()"></image>
				</view>
				<view class="item">
					<view class="label">产品名称</view>
					{{props.goods_name}}
				</view>
				<view class="item">
					<view class="label">合同编号</view>
					{{state.info.contract_num}}
				</view>
				<view class="item">
					<view class="label">申请额度(元)</view>
					{{state.info.order_material.apply_money}}
				</view>
				<view class="item">
					<view class="label">计息方式</view>
					{{state.info.rate_type==="day"?'按天':state.info.rate_type==="month"?'按月':state.info.rate_type==="year"?'按年':''}}
				</view>
				<view class="item">
					<view class="label">年利率(%)</view>
					{{state.info.loan_rate}}
				</view>
			</view>
			<view class="option">
				<view class="left" @click="option('a')">受理</view>
				<view class="right" @click="option('b')">作废</view>
			</view>
		</view>
	</view>
</template>
<!--创建时间：2024-03-30 18:11:53-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface"

	const props = defineProps({
		id: { type: String },
		goods_name: { type: String }
	})

	const state = reactive({
		info: {} as any
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: props.id
		}).then((res : Result) => {
			state.info = res.data
		})
	})

	const callPhone = () => {
		uni.makePhoneCall({
			phoneNumber: "18398229564"
		})
	}

	const option = (type : string) => {
		globalProxy.$request("/loan/Order/checkOrder", {
			order_id: state.info.id,
			status: type
		}).then(() => {
			uni.showToast({
				title: "操作成功",
				icon: "success",
				duration: 1500
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 2000)
		})
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 2.67vw 4vw;

			>.option {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 3.2vw;

				>.left {
					width: 42.67vw;
					height: 8vw;
					background: #109181;
					border-radius: 4vw;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.47vw;
					color: #FFFFFF;
				}

				>.right {
					width: 42.67vw;
					height: 8vw;
					background: #999999;
					border-radius: 4vw;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.47vw;
					color: #FFFFFF;
				}
			}

			>.info {
				padding: 2.67vw 8vw;
				background: #FFFFFF;
				border-radius: 1.33vw;

				>.item {
					display: flex;
					align-items: center;
					font-size: 3.2vw;
					color: #666666;
					margin-bottom: 4vw;

					>image {
						width: 5.33vw;
						height: 5.33vw;
						margin-left: 5vw;
					}

					&:last-child {
						margin-bottom: 0;
					}

					>.label {
						width: 30vw;
						color: #333333;
					}
				}
			}
		}
	}
</style>