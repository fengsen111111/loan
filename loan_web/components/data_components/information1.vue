<template>
	<view class="info1">
		<view class="head" v-if="!props.showFlag">
			<view class="top_dot">
				<view class="dot current"></view>
				<view class="line"></view>
				<view class="dot"></view>
				<view class="line"></view>
				<view class="dot"></view>
				<view class="line"></view>
				<view class="dot"></view>
			</view>
			<view class="bottom_text">
				<view class="text current">基本信息</view>
				<view class="text">详细信息</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">企业注册信息</view>

			<view class="idcard">
				<view class="item" @click="uploadImg()">
					点击上营业执照
					<image :src="formData.license_image" mode="" v-if="formData.license_image"></image>
				</view>
			</view>
			<view class="info_item">
				<view class="label" style="width: 22vw;">公司名称</view>
				<view class="value">
					<input type="text" placeholder="请输入公司名称" v-model="formData.name" :disabled="props.showFlag"
						style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label" style="width: 22vw;">统一社会信用代码</view>
				<view class="value">
					<input type="text" placeholder="请输入统一社会信用代码" v-model="formData.card_number"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label" style="width: 22vw;">注册资本（万元）</view>
				<view class="value">
					<input type="number" placeholder="请输入注册资本" v-model="formData.register_money"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="showPicker()">
				<view class="label">注册资本币种</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.register_money_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label">经营范围</view>
				<view class="value" style="border-bottom:none">
					<textarea type="text" placeholder="请输入经营范围" v-model="formData.work_area" :disabled="props.showFlag"
						maxlength="-1"></textarea>
				</view>
			</view>
		</view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				选择注册资本币种
				<view class="confirm" @click="picker_confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>
	</view>
</template>
<!--创建时间：2024-03-29 10:54:48-->
<script setup lang="ts">
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"

	import { reactive, defineEmits, getCurrentInstance, onMounted, defineProps } from "vue"

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

		pub_picker: false,
		column: [],
		select_value: 0
	})

	const formData = reactive({
		license_image: "",
		register_money: "",
		register_money_type: "",
		work_area: "",
		name: "",
		card_number: ""
	}) as any

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

	const showPicker = () => {
		if (props.showFlag) return;
		state.pub_picker = true;
	}
	const bindChange = (val : any) => {
		state.select_value = val.detail.value[0]
	}

	const picker_confirm = () => {
		formData.register_money_type = state.column[state.select_value].name;
		state.select_value = 0;
		state.pub_picker = false
	}

	globalProxy.$request("/loan/Dictionary/getDictionary").then((res : Result) => {
		res.data.records.map((item : any) => {
			if (item.key === "company_register_currency_type") {
				state.column = item.values.map(i => {
					return {
						name: i
					}
				})
			}
		})
	})

	onMounted(() => {
		if (uni.getStorageSync("order_id")) {
			formData.id = uni.getStorageSync("order_id")
			globalProxy.$request("/loan/Order/getOrderDetail", {
				order_id: formData.id,
				page_number: 1
			}).then((res : Result) => {
				if (res.data.order_material.length === 0) return;
				Object.assign(formData, res.data.order_material);
			})
		}
	})

	const nextStep = () => {
		if (formData.name === "" || formData.card_number === "" || formData.register_money === "" || formData.register_money_type === "" || formData.work_area === "") {
			openTips("资料未填写完成");
			return;
		}
		uni.setStorageSync("orderInfo", {
			name: formData.name,
			id_card: formData.card_number
		})
		globalProxy.$request("/loan/Order/makeOrder", {
			goods_id: uni.getStorageSync("goods_id"),
			type: "company",
			page_number: 1,
			...formData
		}).then((res : Result) => {
			uni.setStorageSync("order_id", res.data.id);
			uni.setStorageSync("order_time", res.data.create_time)
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

	const uploadImg = () => {
		if (props.showFlag) return;
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
					formData.license_image = result.data.url;
					uni.request({
						url: "https://bizlicense.market.alicloudapi.com/rest/160601/ocr/ocr_business_license.json",
						header: {
							"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
						},
						method: "POST",
						data: {
							image: result.data.url
						},
						success: (scan : any) => {
							let scanData = scan.data;
							formData.work_area = scanData.business;
							formData.name = scanData.name;
							formData.card_number = scanData.reg_num;
							// formData.name = scanData[0].word.substr(scanData[0].word.lastIndexOf("：") + 1);
							// formData.card_number = scanData[scanData.length - 1].word
						}
					})
					uni.hideLoading()
				})
			}
		})
	}
</script>
<style lang='scss'>
	.info1 {
		margin-bottom: 2.67vw;

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

		.protocol {
			display: flex;
			align-items: center;
			font-size: 2.67vw;
			color: #333333;
			padding-left: 4vw;
			margin-top: 5.33vw;
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;

			>.info_item {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-bottom: 8.4vw;

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

			>.idcard {
				margin: 4vw 0;
				display: flex;
				align-items: center;
				justify-content: center;

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