<template>
	<view class="container">
		<navbar :title="props.type===1?'新增企业共借人':'新增企业融担方'"></navbar>
		<view class="content">
			<view class="label">{{props.type===1?'新增企业共借人':'新增企业融担方'}}</view>

			<view class="idcard">
				<view class="item" @click="scanBank()">
					点击上营业执照
					<image :src="formData.company_license_image" mode="" v-if="formData.company_license_image"></image>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>企业名称</view>
				<view class="value">
					<input type="text" placeholder="请输入企业名称" v-model="formData.name">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required style="width: 20vw;">统一社会信用代码</view>
				<view class="value">
					<input type="text" placeholder="请输入统一社会信用代码" v-model="formData.card_number">
				</view>
			</view>
			<view class="info_item" @click="()=>{state.calenderShow = true}">
				<view class="label" data-required>营业期限</view>
				<view class="value" :style="formData.company_end_time?'':'color:#777777'">
					{{formData.company_end_time||"请选择营业期限"}}
				</view>
			</view>
			<view class="info_item" @click="chooseAddress()">
				<view class="label" data-required>办公城市</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.company_work_city}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>办公街道地址</view>
				<view class="value">
					<input type="text" placeholder="请输入详细街道及门牌号" v-model="formData.company_work_address">
				</view>
			</view>
		</view>

		<view class="content">
			<view class="label">企业法人信息</view>
			<view class="info_item">
				<view class="label" data-required>法人姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入法人姓名" v-model="formData.company_leader_name">
				</view>
			</view>
			<view class="info_item" @click="showPicker('company_leader_relationship','emergency_contact_relationship')">
				<view class="label" data-required>与借贷人关系</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.company_leader_relationship}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('company_leader_card_type','leader_card_type')">
				<view class="label" data-required>证件类型</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.company_leader_card_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>证件号码</view>
				<view class="value">
					<input type="number" placeholder="请输入证件号码" v-model="formData.company_leader_card_number">
				</view>
			</view>
		</view>
		<view style="height: 25vw;"></view>
		<optionBt @confirm="nextStep()" confirmText="确定"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<u-picker :show="state.address_show" title="办公城市" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
			@change="changeHandler" keyName="label" closeOnClickOverlay @close="close()" @cancel="close()"></u-picker>

		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				{{state.column[state.key].picker_title}}
				<view class="confirm" @click="picker_confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" :value="state.pub_value"
				@change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column[state.key].list" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>
		<l-calendar :visible="state.calenderShow" @confirm="handleConfirm" :isRange="true"
			@cancel="state.calenderShow = false"></l-calendar>
	</view>
</template>
<!--创建时间：2024-03-30 13:56:52-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { back } from "@/utils/jump";
	import { reactive, defineProps, getCurrentInstance, ref, nextTick } from "vue"

	const props = defineProps({
		type: { type: Number }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

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

		// 公共回显值
		pub_value: [],
		// 公共picker
		pub_picker: false,
		// 公共picker列表
		column: {} as any,

		pub_name: "",
		key: "",
		select_value: 0,

		address_show: false,
		columns: [],
		firstIndex: 0,

		calenderShow: false
	})

	const formData = reactive({
		type: "company",
		name: "",
		card_number: "",
		company_license_image: "",
		company_end_time: "",
		company_work_city: "",
		company_work_address: "",
		company_leader_name: "",
		company_leader_relationship: "",
		company_leader_card_type: "",
		company_leader_card_number: ""
	})

	const uPickerRef = ref(null)

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

	const handleConfirm = (e : any) => {
		formData.company_end_time = e.startDate + "-" + e.endDate;
		state.calenderShow = false
	}

	const picker_confirm = () => {
		formData[state.pub_name] = state.column[state.key].list[state.select_value].name;
		state.select_value = 0;
		state.pub_picker = false
	}

	const showPicker = (name : string, key : string) => {
		state.pub_name = name;
		state.key = key;
		state.pub_picker = true
	}

	const scanBank = () => {
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
					formData.company_license_image = result.data.url;
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
							const regDate = /^(\d{4})(\d{2})(\d{2})$/;
							formData.name = scanData.name;
							formData.card_number = scanData.reg_num;
							formData.company_end_time = scanData.establish_date.replace(regDate, "$1.$2.$3") + " - " + scanData.valid_period.replace(regDate, "$1.$2.$3")
							// formData.name = scanData[0].word.substr(scanData[0].word.lastIndexOf("：") + 1);
							// formData.card_number = scanData[scanData.length - 1].word
						}
					})
					uni.hideLoading()
				})
			}
		})
	}

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


	const nextStep = () => {
		if (formData.card_number === "" || formData.company_end_time === "" || formData.company_leader_card_number === "" || formData.company_leader_card_type === "" || formData.company_leader_name === "" || formData.company_leader_relationship === "" || formData.company_work_address === "" || formData.company_work_city === "") {
			openTips("资料未填写完成")
			return
		}
		let array : any;
		if (props.type === 1) {
			if (uni.getStorageSync("personArray")) {
				array = uni.getStorageSync("personArray");
				array.push(formData)
			} else {
				array = [];
				array.push(formData)
			}
			uni.setStorageSync("personArray", array)
		} else {
			if (uni.getStorageSync("companyArray")) {
				array = uni.getStorageSync("companyArray");
				array.push(formData)
			} else {
				array = [];
				array.push(formData)
			}
			uni.setStorageSync("companyArray", array)
		}
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

	globalProxy.$request("/factory_system/Base/getAreas").then((res : Result) => {
		state.columns = [res.data.areas];
		nextTick(() => {
			uPickerRef.value.setColumnValues(1, state.columns[0][0].children)
			uPickerRef.value.setColumnValues(2, state.columns[0][0].children[0].children)
		})
	})

	const chooseAddress = () => {
		state.address_show = true
	}
	const close = () => {
		state.address_show = false
	}
	const confirm = (e : any) => {
		formData.company_work_city = ""
		e.value.map((item : any, index : number) => {
			formData.company_work_city += (index === e.value.length - 1 ? item.label : item.label + "-");
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
				margin: 5.73vw 0;
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
	}
</style>