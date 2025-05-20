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
			<view class="label">其他信息</view>
			<view class="info_item" @click="showPicker('marriage')">
				<view class="label" data-required>婚姻状态</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.marriage}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('educational')">
				<view class="label">最高学历</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.educational}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('degree')">
				<view class="label">最高学位</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.degree}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('occupation')">
				<view class="label" data-required>职业</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.occupation}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>现居住地城市</view>
				<view class="value">
					<input type="text" placeholder="请输入地址" v-model="formData.city_address" :disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>详细地址</view>
				<view class="value">
					<input type="text" placeholder="请输入详细街道及门牌号" v-model="formData.address" :disabled="props.showFlag">
				</view>
			</view>
		</view>

		<view class="content">
			<view class="label">工作信息</view>
			<view class="info_item">
				<view class="label" data-required>公司名称</view>
				<view class="value">
					<input type="text" placeholder="请输入公司名称" v-model="formData.company_name" :disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item" @click="showPicker('industry')">
				<view class="label">选择所属行业</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.industry}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('post')">
				<view class="label">职务</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.post}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('professional_title')">
				<view class="label">职称</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.professional_title}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
		</view>

		<view class="content" v-if="formData.marriage!=='未婚'">
			<view class="label">配偶信息</view>
			<view class="info_item">
				<view class="label">配偶姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入配偶姓名" v-model="formData.spouse_name" :disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label">配偶身份证号码</view>
				<view class="value">
					<input type="idcard" placeholder="请输入配偶身份证号码" v-model="formData.spouse_id_card"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label">配偶手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入配偶手机号" v-model="formData.spouse_mobile"
						:disabled="props.showFlag">
				</view>
			</view>
		</view>

		<view class="content">
			<view class="label">紧急联系人</view>
			<view class="info_item">
				<view class="label" data-required>联系人姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入联系人姓名" v-model="formData.emergency_contact_name"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>联系人手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入联系人手机号" v-model="formData.emergency_contact_mobile"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item" @click="showPicker('emergency_contact_relationship')">
				<view class="label" data-required>与借贷人关系</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.emergency_contact_relationship}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="label">其他联系人</view>
			<view class="info_item">
				<view class="label">联系人姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入联系人姓名" v-model="formData.other_contact_name"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label">联系人手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入联系人手机号" v-model="formData.other_contact_mobile"
						:disabled="props.showFlag">
				</view>
			</view>
		</view>
		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

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
	import { reactive, defineEmits, getCurrentInstance, onMounted } from "vue"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

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
		select_value: 0
	})

	const emits = defineEmits(["next"]);

	const formData = reactive({
		marriage: "",
		educational: "",
		degree: "",
		occupation: "",
		city_address: "",
		address: "",
		company_name: "",
		industry: "",
		post: "",
		professional_title: "",
		spouse_name: "",
		spouse_id_card: "",
		spouse_mobile: "",
		emergency_contact_name: "",
		emergency_contact_mobile: "",
		emergency_contact_relationship: "",
		other_contact_name: "",
		other_contact_mobile: "",
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
		if (formData.marriage === "" || formData.occupation === "" || formData.city_address === "" || formData.address === "" || formData.company_name === "" || formData.emergency_contact_name === "" || formData.emergency_contact_mobile === "" || formData.emergency_contact_relationship === "") {
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

	const showPicker = (name : string) => {
		if (props.showFlag) return;
		state.pub_name = name;
		state.pub_picker = true
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