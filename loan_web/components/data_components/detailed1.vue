<template>
	<view class="detailed">
		<view class="head" v-if="!props.showFlag">
			<view class="top_dot">
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
				<view class="text current">详细信息</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>
		<view class="content">
			<view class="label">法定代表人信息</view>
			<view class="info_item">
				<view class="label" data-required>法人姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入法人姓名" v-model="formData.leader_name" :disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item" @click="showPicker('leader_card_type')">
				<view class="label">证件类型</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.leader_card_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>证件号码</view>
				<view class="value">
					<input type="text" placeholder="请输入证件号码" v-model="formData.leader_card_number"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>手机号码</view>
				<view class="value">
					<input type="text" placeholder="请输入手机号码" v-model="formData.leader_mobile"
						:disabled="props.showFlag">
				</view>
			</view>
		</view>

		<view class="content">
			<view class="label">企业联系信息</view>
			<view class="info_item" @click="chooseAddress('company_city_address')">
				<view class="label">注册地址城市</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.company_city_address}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label">注册详细地址</view>
				<view class="value">
					<input type="text" placeholder="请输入注册详细地址" v-model="formData.company_address"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item" @click="chooseAddress('company_work_city_address')">
				<view class="label">办公地址城市</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.company_work_city_address}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label">办公详细地址</view>
				<view class="value">
					<input type="text" placeholder="请输入办公详细地址" v-model="formData.company_work_address"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label">联系电话</view>
				<view class="value">
					<input type="text" placeholder="请输入联系电话" v-model="formData.company_mobile"
						:disabled="props.showFlag">
				</view>
			</view>
		</view>

		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<u-picker :show="state.address_show" :title="state.address_title" ref="uPickerRef" :columns="state.columns"
			@confirm="confirm" @change="changeHandler" keyName="label" closeOnClickOverlay @close="close()"
			@cancel="close()"></u-picker>

		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				{{state.column[state.pub_name].picker_title}}
				<view class="confirm" @click="picker_confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" :value="state.pub_value"
				@change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column[state.pub_name].list" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>
	</view>
</template>
<!--创建时间：2024-03-29 14:40:27-->
<script lang="ts" setup>
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { reactive, defineEmits, onMounted, getCurrentInstance, ref, nextTick } from "vue"


	const props = defineProps({
		showFlag: { type: Boolean }
	})

	const state = reactive({
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",

		// 公共回显值
		pub_value: [],
		// 公共picker
		pub_picker: false,
		// 公共picker列表
		column: {} as any,

		pub_name: "",
		select_value: 0,

		address_title: "",
		address_show: false,
		columns: [],
		firstIndex: 0
	})

	const emits = defineEmits(["next"]);
	const uPickerRef = ref(null);

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const formData = reactive({
		card_type: "",
		card_number: "",
		leader_name: "",
		leader_card_type: "",
		leader_card_number: "",
		leader_mobile: "",
		company_city_address: "",
		company_address: "",
		company_work_city_address: "",
		company_work_address: "",
		company_mobile: ""
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 2
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
		})
	})

	const nextStep = () => {
		if (formData.leader_name === "" || formData.leader_mobile === "" || formData.leader_card_number === "") {
			openTips("资料未填写完成");
			return;
		}
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 2,
			...formData
		}).then(() => {
			emits("next");
		})
	}

	globalProxy.$request("/loan/Dictionary/getDictionary").then((res : Result) => {
		let obj = {}
		res.data.records.map((item : any) => {
			obj[item.key] = {
				picker_title: item.name,
				list: item.values.map((i : string) => {
					return {
						name: i
					}
				})
			}
		})

		state.column = obj;
	})

	const bindChange = (val : any) => {
		state.select_value = val.detail.value[0]
	}

	const picker_confirm = () => {
		formData[state.pub_name] = state.column[state.pub_name].list[state.select_value].name;
		state.select_value = 0;
		state.pub_picker = false
	}

	const showPicker = (name : string) => {
		if (props.showFlag) return;
		state.pub_name = name;
		state.pub_picker = true
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

	globalProxy.$request("/factory_system/Base/getAreas").then((res : Result) => {
		state.columns = [res.data.areas];
		nextTick(() => {
			uPickerRef.value.setColumnValues(1, state.columns[0][0].children)
			uPickerRef.value.setColumnValues(2, state.columns[0][0].children[0].children)
		})
	})

	const chooseAddress = (name : string) => {
		if (props.showFlag) return;
		state.address_show = true;
		state.pub_name = name;
	}
	const close = () => {
		state.address_show = false
	}
	const confirm = (e : any) => {
		formData[state.pub_name] = "";
		e.value.map((item : any, index : number) => {
			formData[state.pub_name] += (index === e.value.length - 1 ? item.label : item.label + "-");
		})
		close()
	}
	const changeHandler = (e : any) => {
		const { columnIndex, index } = e;
		if (columnIndex === 0) {
			uPickerRef.value.setColumnValues(1, state.columns[0][index].children)
			uPickerRef.value.setColumnValues(2, state.columns[0][index].children[0].children)
			state.firstIndex = index
		}
		if (columnIndex === 1) {
			uPickerRef.value.setColumnValues(2, state.columns[0][state.firstIndex].children[index].children)
		}
	}
</script>
<style lang='scss'>
	.detailed {
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

		input {
			width: 100%;
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