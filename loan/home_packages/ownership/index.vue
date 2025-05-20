<template>
	<view class="container">
		<navbar title="新增产权人"></navbar>
		<view class="content">
			<view class="label">新增产权人</view>

			<view class="idcard">
				<view class="item" @click="uploadImg('front')">
					点击上传身份证正面
					<text>（人像）</text>
					<image :src="formData.card_image_front" mode="" v-if="formData.card_image_front"></image>
				</view>
				<view class="item" @click="uploadImg('back')">
					点击上传身份证背面
					<text>（国徽）</text>
					<image :src="formData.card_image_back" mode="" v-if="formData.card_image_back"></image>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入姓名" v-model="formData.name">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>手机号</view>
				<view class="value">
					<input type="text" placeholder="请输入手机号" v-model="formData.mobile">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>身份证号码</view>
				<view class="value">
					<input type="idcard" placeholder="请输入身份证号" v-model="formData.id_card" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="()=>{state.calenderShow = true}">
				<view class="label" data-required>证件有效期</view>
				<view class="value" :style="formData.id_card_end_time?'':'color:#777777'">
					{{formData.id_card_end_time||"请选择证件有效期"}}
				</view>
			</view>
			<!-- <view class="info_item">
				<view class="label" data-required>手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.mobile" maxlength="11">
				</view>
			</view> -->
			<!-- <view class="info_item" @click="chooseAddress()">
				<view class="label" data-required>现居住地城市</view>
				<view class="value" style="border: none;">
					<text>{{formData.city_address}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view> -->
			<view class="info_item">
				<view class="label" data-required>完整居住地址</view>
				<view class="value">
					<input type="text" placeholder="请输入省市地街道小区门牌号完整地址" v-model="formData.address">
				</view>
			</view>
		</view>
		<optionBt @confirm="nextStep()" confirmText="确定"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
		<u-picker :show="state.address_show" title="居住地城市" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
			@change="changeHandler" keyName="label" closeOnClickOverlay @close="close()" @cancel="close()"></u-picker>
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

	const uPickerRef = ref(null)

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

		address_show: false,
		columns: [],
		firstIndex: 0,

		calenderShow: false
	})

	const formData = reactive({
		card_image_front: "",
		card_image_back: "",
		name: "",
		mobile:'',
		id_card: "",
		id_card_end_time: "",
		address:'',
		// city_address:''
	})

	const handleConfirm = (e : any) => {
		formData.id_card_end_time = e.startDate + " - " + e.endDate;
		state.calenderShow = false
	}

	// const sendCode = () => {
	// 	if (formData.mobile === "") {
	// 		openTips("请输入手机号");
	// 		return;
	// 	}
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
		if (formData.card_image_back === "" ||formData.address === "" || formData.card_image_front === "" || formData.id_card === "" || formData.mobile === "" || formData.id_card_end_time === "" || formData.name === "") {
			openTips("资料未填写完成");
			return;
		}
		let array : any;
		if (uni.getStorageSync("ownerArray")) {
			array = uni.getStorageSync("ownerArray");
			array.push(formData)
		} else {
			array = [];
			array.push(formData)
		}
		uni.setStorageSync("ownerArray", array)
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
						formData.card_image_front = result.data.url;
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
								formData.id_card = scanData.num
							},
							fail: () => {
								openTips("请按要求上传身份证人像面（正面）")
							}
						})
					} else if (type === "back") {
						formData.card_image_back = result.data.url
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
								formData.id_card_end_time = scanData.start_date.replace(regDate, "$1.$2.$3") + " - " + scanData.end_date.replace(regDate, "$1.$2.$3")
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
		formData.city_address = ""
		e.value.map((item : any, index : number) => {
			formData.city_address += (index === e.value.length - 1 ? item.label : item.label + "-");
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