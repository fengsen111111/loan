<template>
	<view class="borrower">
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
				<view class="text current">共借人信息</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">贷款信息</view>
			<view class="table_title">
				<view class="item">共借人名称</view>
				<view class="item">证件类型</view>
				<view class="item" :style="props.showFlag?'width:18vw;text-align:center':''">证件号码</view>
				<view class="item" v-if="!props.showFlag">操作</view>
			</view>
			<view class="table_item" v-for="(item,index) in formData.other_persons" :key="index">
				<view class="item">{{item.name}}</view>
				<view class="item">{{item.type === 'person'?'身份证':'营业执照'}}</view>
				<view class="item">{{$cardUtil(item.card_number)}}</view>
				<view class="item" v-if="!props.showFlag"><u-icon name="trash" size="5vw" color="#FF8177"
						@click="deleteData(index)"></u-icon>
				</view>
			</view>

			<div class="option" v-if="!props.showFlag">
				<div class="add_item" @click="$navigateTo('/home_packages/add_personal/index',{type:1})">新增个人共借人</div>
				<div class="add_item" @click="$navigateTo('/home_packages/add_enterprise/index',{type:1})">新增企业共借人</div>
			</div>
		</view>
		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<optionBt showCancel cancelText="跳过" cancelColor="#999999" cancelBgColor="#F6F7FB" @confirm="nextStep()"
			@cancel="skipStep()" v-if="!props.showFlag">
		</optionBt>
	</view>
</template>
<!--创建时间：2024-03-30 10:28:21-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import optionBt from "@/components/option-bt.vue"
	import { reactive, defineEmits, getCurrentInstance, onMounted } from "vue"
	import { Result } from "@/utils/interface";

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
		tipsText: "资料未填写完成"
	})

	const formData = reactive({
		other_persons: uni.getStorageSync("personArray")
	})

	const deleteData = (index : number) => {
		formData.other_persons.splice(index, 1);
		if (formData.other_persons.length === 0) {
			uni.removeStorageSync("personArray")
		} else {
			uni.setStorageSync("personArray", formData.other_persons);
		}
	}

	onShow(() => {
		if (uni.getStorageSync("personArray")) {
			formData.other_persons = uni.getStorageSync("personArray");
		}
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 5
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
		})
	})

	const skipStep = () => {
		emits("next");
	}

	const nextStep = () => {
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 5,
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
	.borrower {

		>.content {
			padding: 4vw;
			background: #FFFFFF;
			margin-bottom: 2.67vw;

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
					text-align: center;

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