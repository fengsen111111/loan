<template>
	<view class="container">
		<navbar :title="props.type===1?'新增个人共借人':'新增个人融担方'"></navbar>
		<view class="content">
			<view class="label">{{props.type===1?'新增个人共借人':'新增个人融担方'}}</view>

			<view class="idcard">
				<view class="item" @click="uploadImg('front')">
					点击上传身份证正面
					<text>（人像）</text>
					<image :src="formData.person_id_card_image_front" mode=""
						v-if="formData.person_id_card_image_front"></image>
				</view>
				<view class="item" @click="uploadImg('back')">
					点击上传身份证背面
					<text>（国徽）</text>
					<image :src="formData.person_id_card_image_back" mode="" v-if="formData.person_id_card_image_back">
					</image>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入姓名" v-model="formData.name">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>身份证号码</view>
				<view class="value">
					<input type="idcard" placeholder="请输入身份证号" v-model="formData.card_number" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="()=>{state.calenderShow = true}">
				<view class="label" data-required>证件有效期</view>
				<view class="value" :style="formData.person_id_card_end_time?'':'color:#777777'">
					{{formData.person_id_card_end_time||"请选择证件有效期"}}
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.person_mobile" maxlength="11">
				</view>
			</view>
			<view class="info_item" @click="showPicker('person_relationship','emergency_contact_relationship')">
				<view class="label" data-required>与借贷人关系</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.person_relationship}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('person_marriage','marriage')">
				<view class="label" data-required>婚姻状态</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.person_marriage}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="chooseAddress()">
				<view class="label">现居住地城市</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.person_city_address}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>详细地址</view>
				<view class="value">
					<input type="text" placeholder="请输入详细街道及门牌号" v-model="formData.person_address">
				</view>
			</view>
		</view>
		<optionBt @confirm="nextStep()" confirmText="确定"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<u-picker :show="state.address_show" title="居住城市" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
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
		<l-calendar :visible="state.calenderShow" @confirm="handleConfirm" :isRange="true" idCard
			@cancel="state.calenderShow = false"></l-calendar>
	</view>
</template>
<!--创建时间：2024-03-30 13:56:52-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { back } from "@/utils/jump";
	import { reactive, defineProps, getCurrentInstance, nextTick, ref } from "vue"

	const props = defineProps({
		type: { type: Number }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const uPickerRef = ref(null);

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
		type: "person",
		name: "",
		card_number: "",
		person_mobile: "",
		person_id_card_image_front: "",
		person_id_card_image_back: "",
		person_id_card_end_time: "",
		person_relationship: "",
		person_marriage: "",
		person_city_address: "",
		person_address: ""
	})

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

	const handleConfirm = (e : any) => {
		formData.person_id_card_end_time = e.startDate + " - " + e.endDate;
		state.calenderShow = false
	}

	const bindChange = (val : any) => {
		state.select_value = val.detail.value[0]
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


	const nextStep = () => {
		// || formData.person_city_address === ""
		if (formData.card_number === "" || formData.name === "" || formData.person_address === ""  || formData.person_id_card_end_time === "" || formData.person_marriage === "" || formData.person_mobile === "" || formData.person_relationship === "" || formData.type === "") {
			openTips("资料未填写完成");
			return;
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
		formData.person_city_address = ""
		e.value.map((item : any, index : number) => {
			formData.person_city_address += (index === e.value.length - 1 ? item.label : item.label + "-");
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
	const uploadImg = (type : string) => {
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
					if (type === "front") {
						formData.person_id_card_image_front = result.data.url;
						uni.request({
							url: "https://cardnumber.market.alicloudapi.com/rest/160601/ocr/ocr_idcard.json",
							header: {
								"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
							},
							method: "POST",
							data: {
								image: result.data.url,
								configure: {
									side: "face"
								}
							},
							success: (scan : any) => {
								let scanData = scan.data;
								formData.name = scanData.name;
								formData.card_number = scanData.num
							},
							fail: () => {
								openTips("请按要求上传身份证人像面（正面）")
							}
						})
					} else if (type === "back") {
						formData.person_id_card_image_back = result.data.url
						uni.request({
							url: "https://cardnumber.market.alicloudapi.com/rest/160601/ocr/ocr_idcard.json",
							header: {
								"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
							},
							method: "POST",
							data: {
								image: result.data.url,
								configure: {
									side: "back"
								}
							},
							success: (scan : any) => {
								let scanData = scan.data;
								const regDate = /^(\d{4})(\d{2})(\d{2})$/;
								formData.person_id_card_end_time = scanData.start_date.replace(regDate, "$1.$2.$3") + " - " + scanData.end_date.replace(regDate, "$1.$2.$3")
							},
							fail: () => {
								openTips("请按要求上传身份证国徽面（背面）")
							}
						})
					}
					uni.hideLoading()
				})
			}
		})
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
	}
</style>