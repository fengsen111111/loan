<template>
	<view class="container">
		<navbar title="选择银行卡"></navbar>
		<view class="list">
			<view class="item" v-for="(item,index) in state.list" :key="index" @click="change_card(index)">
				<!-- <image :src="item.bank_logo" mode=""></image> -->
				<view class="center">
					<view class="bank_info">
						<view class="title">{{item.bank_name}}</view>
						{{$cardUtil(item.bank_acctno)}}
					</view>
					<!-- {{item.bank_card_type}} -->
				</view>
				<image src="@/home_packages/static/select_icon.png" mode="" v-if="state.select_card===index"></image>
			</view>

			<view class="add" @click="$navigateTo('/home_packages/add_bank_card/index')">新增银行卡</view>
		</view>
		<optionBt confirmText="确定" @confirm="nextStep()"></optionBt>
	</view>
</template>
<!--创建时间：2024-03-30 09:52:17-->
<script setup lang="ts">
	import { onShow, onLoad } from "@dcloudio/uni-app"
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { back } from "@/utils/jump";

	import { reactive, getCurrentInstance } from "vue";

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})


	const state = reactive({
		select_card: 0,
		list: [] as any,
		type: 1
	})

	onLoad((e) => {
		state.type = e.type
	})

	onShow(() => {
		globalProxy.$request("/loan/User/getOrderBankList", {
			order_id: uni.getStorageSync("order_id")
		}).then((res : Result) => {
			state.list = res.data.list
		})
	})

	const change_card = (index : number) => {
		state.select_card = index;
	}

	const nextStep = () => {
		uni.setStorageSync("bankInfo" + state.type, state.list[state.select_card])
		back()
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.list {
			padding: 4vw;

			>.add {
				width: 92vw;
				height: 16vw;
				border-radius: 2.67vw;
				border: 1px dotted #999999;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 3.73vw;
				color: #999999;
			}

			>.item {
				padding: 6.67vw 4vw;
				background: #FFFFFF;
				border-radius: 2.67vw;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4vw;

				>image:first-child {
					width: 10.67vw;
					height: 10.67vw;
					margin-right: 4vw;
				}

				>image:last-child {
					width: 4vw;
					height: 4vw;
				}

				>.center {
					flex: 1;
					font-size: 2.67vw;
					color: #333333;

					>.bank_info {
						display: flex;
						align-items: center;
						font-size: 3.2vw;

						>.title {
							font-weight: bold;
							font-size: 3.73vw;
							margin-right: 2.67vw;
						}
					}
				}
			}
		}
	}
</style>