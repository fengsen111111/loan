<template>
	<view class="houseproperty">
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
				<view class="text current">房产信息</view>
				<view class="text">补充资料</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">房产信息</view>
			<view class="table_title">
				<view class="item">证书编号</view>
				<view class="item">产权人</view>
				<view class="item">受托人</view>
				<view class="item">房屋坐落</view>
				<view class="item" v-if="!props.showFlag">操作</view>
			</view>

			<view class="table_item" v-for="(item,index) in formData.houses" :key="index">
				<view class="item">{{item.card_number}}</view>
				<view class="item">
				   <view class="" v-for="(iss,iss_index) in item.owners" :key="iss_index">{{iss.name}}</view>
				</view>
				<view class="item">
				   <view class="" v-for="(iss,iss_index) in item.weituo_person" :key="iss_index">{{iss.name}}</view>
				</view>
				<view class="item">{{item.address}}</view>
				<view class="item" style="display: flex;align-items: center;justify-content: space-between;"
					v-if="!props.showFlag">
					<image src="@/static/house_edit.png" mode="" @click="changeHouse(index)"></image>
					<u-icon name="trash" size="5vw" color="#FF8177"></u-icon>
				</view>
			</view>

			<div class="option" v-if="!props.showFlag">
				<div class="add_item" @click="$navigateTo('/home_packages/add_house/index',{type:1})">新增房产信息</div>
			</div>
		</view>
		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
		<optionBt :showCancel="state.order_type" cancelText="跳过" cancelColor="#999999" cancelBgColor="#F6F7FB"
			@confirm="nextStep()" @cancel="skipStep()" v-if="!props.showFlag">
		</optionBt>
	</view>
</template>
<!--创建时间：2024-03-30 10:28:21-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { reactive, defineEmits, onMounted, getCurrentInstance } from "vue"
    uni.removeStorageSync("houseArray")
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
		order_type: uni.getStorageSync("order_type") !== 'b'
	})

	const formData = reactive({
		houses: uni.getStorageSync("houseArray")
	})
	onShow(() => {
		if (uni.getStorageSync("houseArray")) {
			formData.houses = uni.getStorageSync("houseArray");
		}
	})

	const changeHouse = (index : number) => {
		uni.navigateTo({
			url: "/home_packages/add_house/index?type=2&houseIndex=" + index
		})
	}
	const deleteData = (index : number) => {
		formData.houses.splice(index, 1);
		if (formData.houses.length === 0) {
			uni.removeStorageSync("houseArray")
		} else {
			uni.setStorageSync("houseArray", formData.houses);
		}
	}

	const skipStep = () => {
		emits("next");
	}

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 7
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
			uni.setStorageSync("houseArray", res.data.order_material.houses);
		})
	})

	const nextStep = () => {
		if (formData.houses.length === 0) {
			openTips("资料未填写完成");
			return;
		}
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 7,
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
</script>
<style lang='scss'>
	.houseproperty {
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

			>.option {
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

			>.table_item {
				/* display: flex; */
				align-items: center;
				/* justify-content: space-between; */
				display: grid;
				grid-template-columns:repeat(4,minmax(0,1fr));
				padding:10rpx 0rpx;
				text-align: center;
				margin-top: 5.2vw;
				padding: 0 0 0 2.67vw;

				>.item {
					font-size: 2.67vw;
					color: #333333;
					text-align: center;

					>image {
						width: 5vw;
						height: 5vw;
						margin-left: 3.33vw;
					}

					&:nth-child(1) {
						/* width: 23vw; */
						/* overflow: hidden; */
						/* white-space: nowrap; */
						/* text-overflow: ellipsis; */
					}

					&:nth-child(2) {
						/* width: 14vw; */
					}

					&:nth-child(3) {
						/* width: 19vw; */
					}
				}
			}

			>.table_title {
				/* display: flex; */
				align-items: center;
				/* justify-content: space-between; */
				/* padding: 1.4vw 2.67vw; */
				display: grid;
				grid-template-columns:repeat(4,minmax(0,1fr));
				padding:10rpx 0rpx;
				text-align: center;
				border-bottom: solid 1px #999999;
				margin-top: 3vw;

				>.item {
					font-size: 3.2vw;
					color: #333333;

					/* &:last-child {
						width: 13vw;
						text-align: right;
					} */
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