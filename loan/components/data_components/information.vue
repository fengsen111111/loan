<template>
	<view class="info">
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
			<view class="label">基本信息</view>

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
				<view class="label">姓名</view>
				<view class="value">
					<input type="text" placeholder="请输入姓名" v-model="formData.name" :disabled="props.showFlag">
				</view>
			</view>
			<view class="info_item">
				<view class="label">身份证号码</view>
				<view class="value">
					<input type="idcard" placeholder="请输入身份证号" v-model="formData.card_number" :disabled="props.showFlag"
						style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label">身份证地址</view>
				<view class="value">
					<input type="idcard" placeholder="请输入身份证地址" v-model="formData.id_card_address"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="()=>{props.showFlag?'':state.calenderShow = true}">
				<view class="label">证件有效期</view>
				<view class="value" :style="formData.id_card_end_time?'':'color:#777777'">
					{{formData.id_card_end_time||"请选择证件有效期"}}
				</view>
			</view>
			<view class="info_item">
				<view class="label">是否开通<br />连连账号</view>
				<view class="value">
					<u-radio-group v-model="formData.open_ll_status" shape="circle" activeColor="#F97E39"
						:disabled="props.showFlag">
						<u-radio name="Y" label="开通" labelSize="3.2vw"></u-radio>
						<u-radio name="N" label="不开通" labelSize="3.2vw"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="info_item" v-if="formData.open_ll_status === 'Y'">
				<view class="label">账号类型</view>
				<view class="value">
					<u-radio-group v-model="formData.ll_user_type" shape="circle" activeColor="#F97E39"
						:disabled="props.showFlag">
						<u-radio name="INNERUSER" label="个人用户" labelSize="3.2vw"></u-radio>
						<u-radio name="INNERCOMPANY" label="企业用户" labelSize="3.2vw"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="info_item" v-if="formData.open_ll_status === 'Y'">
				<view class="label">户名</view>
				<view class="value">
					<input type="text" placeholder="请输入户名" v-model="formData.ll_bank_acctname"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" v-if="formData.open_ll_status === 'Y'">
				<view class="label">开户证件号</view>
				<view class="value">
					<input type="text" placeholder="请输入开户证件号" v-model="formData.ll_bank_card_number"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label">手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.mobile" maxlength="11"
						:disabled="props.showFlag">
				</view>
			</view>
			<!-- <view class="info_item" v-if="!props.showFlag">
				<view class="label">验证码</view>
				<view class="value">
					<input type="number" placeholder="请输入验证码" v-model="formData.verify_code" @input="verify()">
					<view class="getCode" @click="sendCode()"
						:style="{color:state.codeTimer?'#999999':'',border:state.codeTimer?'solid 1px #999999':''}">
						{{state.codeText}}
					</view>
				</view>
			</view> -->
		</view>
		<u-checkbox-group v-model="state.checked" v-if="!props.showFlag">
			<view class="protocol">
				<u-checkbox :name="1" shape="circle" activeColor="#F97E39" style="margin-right: 2.67vw;"></u-checkbox>
				本人已阅读并理解<text style="color:#1592E6"
					@click="$navigateTo('/pages/rich_text/index',{url:'/loan/Setting/getUserProtocol'})">《用户服务与隐私保护协议》</text>并愿意遵守相关规则。
			</view>
		</u-checkbox-group>
		<view style="height: 30vw;"></view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag&&state.botShow"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
		<l-calendar :visible="state.calenderShow" @confirm="handleConfirm" :isRange="true" idCard
			@cancel="state.calenderShow = false"></l-calendar>
	</view>
</template>
<!--创建时间：2024-03-29 10:54:48-->
<script setup lang="ts">
	import { dateFormat } from "../../utils/dateFormat";
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"

	// import { aliOCR } from "@/utils/aliOCR";

	import { reactive, getCurrentInstance, onMounted } from "vue"

	const emits = defineEmits(["next"]);
	const props = defineProps({
		showFlag: { type: Boolean }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const state = reactive({
		timeNum: 59,
		codeTimer: null,
		codeText: "发送验证码",
		checked: [],
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",
		calenderShow: false,
		verifyFlag: true,
		botShow: true
	})

	const formData = reactive({
		card_image_front: "",
		card_image_back: "",
		name: "",
		card_number: "",
		id_card_address: "",
		open_ll_status: "Y",
		ll_user_type: "INNERUSER",
		ll_bank_acctname: "",
		ll_bank_card_number: "",
		id_card_end_time: "",
		mobile: "",
		verify_code: ""
	}) as any


	const sendCode = async () => {
		if (formData.mobile === "") {
			openTips("请输入手机号");
			return;
		}
		if (state.codeTimer !== null) return;

		await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.mobile });
		// formData.verify_code = res.data.code;

		state.codeText = state.timeNum + "s后重发";
		state.codeTimer = setInterval(() => {
			if (state.timeNum > 1) {
				state.timeNum--;
				state.codeText = state.timeNum + "s后重发";
			} else {
				clearInterval(state.codeTimer);
				state.codeTimer = null;
				state.codeText = "重新发送";
				state.timeNum = 59;
			}
		}, 1000)
	}

	const handleConfirm = (e : any) => {
		formData.id_card_end_time = e.startDate + " - " + e.endDate;
		state.calenderShow = false
	}

	onMounted(() => {
		uni.request({
			url: "https://api.qfcss.cn/decoration/Setting/ctlLoan",
			method: "POST",
			success: (res : any) => {
				if (res.data.data.result === "N") {
					state.botShow = false
				} else {
					state.botShow = true;
				}
			},
			complete: (err : any) => {
				if (err.statusCode === 404) {
					state.botShow = true;
				}
			}
		})
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
		if (state.checked[0] !== 1) {
			openTips("请阅读并同意《用户服务与隐私保护协议》");
			return;
		}
		// if (!state.verifyFlag || formData.verify_code.length < 6) {
		// 	openTips("验证码校验不通过");
		// 	formData.verify_code = "";
		// 	return;
		// }
		// || formData.verify_code === ""
		if (formData.name === "" || formData.card_number === "" || formData.id_card_end_time === "" || formData.mobile === "") {
			openTips("资料未填写完成");
			return;
		}
		if (formData.open_ll_status === "Y") {
			if (formData.ll_bank_acctname === "" || formData.ll_bank_card_number === "") {
				openTips("资料未填写完成");
				return;
			}
		}
		uni.setStorageSync("orderInfo", {
			name: formData.name,
			id_card: formData.card_number,
			mobile: formData.mobile
		})
		globalProxy.$request("/loan/Order/makeOrder", {
			goods_id: uni.getStorageSync("goods_id"),
			type: "person",
			page_number: 1,
			...formData
		}).then((res : Result) => {
			uni.setStorageSync("order_id", res.data.id);
			uni.setStorageSync("order_time", dateFormat(new Date(), "date"));
			uni.setStorageSync("open_ll_status", formData.open_ll_status);

			uni.setStorageSync("setInfoFormData", formData);
			emits("next");
		})
	}

	const verify = () => {
		if (formData.verify_code.length >= 6) {
			globalProxy.$request("/loan/Setting/checkVerifyCode", {
				mobile: formData.mobile,
				code: formData.verify_code
			}).then((res : Result) => {
				if (res.data.result === 1) {
					state.verifyFlag = true;
				} else {
					state.verifyFlag = false;
					openTips(res.data.message);
				}
			})
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
		if (props.showFlag) return
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
						// aliOCR("RecognizeIdcard",result.data.url).then(res=>{
						// 	console.log(res)
						// })
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
								formData.card_number = scanData.num;
								formData.id_card_address = scanData.address;

								// 
								// if (formData.open_ll_status === 'Y') {
								formData.ll_bank_acctname = scanData.name;
								formData.ll_bank_card_number = scanData.num;
								// }
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
</script>
<style lang='scss'>
	.info {
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
				margin-bottom: 6.4vw;

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