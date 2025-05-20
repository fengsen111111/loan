<template>
	<view class="container">
		<navbar title="新增银行卡"></navbar>
		<view class="content">
			<view class="label">新增银行卡</view>
			<view class="info_item" style="align-items: center;">
				<view class="label" data-required style="padding-bottom: 2.8vw;white-space: nowrap;">收款方类型</view>
				<view class="value" style="border-bottom:none;">
					<u-radio-group v-model="formData.payee_type" active-color="#F97E39" size="16px">
						<u-radio label="对私银行账户" name="BANKACCT_PRI" label-size="12px"></u-radio>
						<u-radio label="对公银行账户" name="BANKACCT_PUB" label-size="12px"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>账户名</view>
				<view class="value">
					<input type="text" style="width: 100%;" placeholder="请输入账户名" v-model="formData.bank_acctname">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>银行卡号</view>
				<view class="value">
					<input type="text" style="width: 100%;" placeholder="请输入银行卡号" v-model="formData.bank_acctno">
					<image src="@/home_packages/static/scan.png" mode="" @click="scanBank()"></image>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>开户银行</view>
				<view class="value">
					<input type="text" placeholder="请输入开户银行" v-model="formData.bank_name" @input="selectBank()"
						style="width: 100%;">
					<view class="select" :style="formData.bank_name&&state.selectFlag?'max-height:80vw':'max-height:0'">
						<scroll-view scroll-y="true" style="max-height: 80vw;">
							<view class="sel_item" v-for="(item,index) in state.column" :key="index"
								@click="activeBank(item.node)">
								{{item.node.bank_name}}
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<view v-show="formData.payee_type === 'BANKACCT_PUB'">
				<view class="info_item" @click="showPicker()">
					<view class="label" data-required>开户行地址</view>
					<view class="value" style="border-bottom:none">
						<text>{{state.address_label}}</text>
						<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
					</view>
				</view>
				<view class="info_item">
					<view class="label" data-required>支行名称</view>
					<view class="value">
						<input type="text" placeholder="请输入支行名称" v-model="formData.brabank_name"
							@input="selectBankName()" style="width: 100%;">
						<view class="select"
							:style="formData.brabank_name&&state.selectNameFlag?'max-height:80vw':'max-height:0'">
							<scroll-view scroll-y="true" style="max-height: 80vw;">
								<view class="sel_item" v-for="(item,index) in state.columnName" :key="index"
									@click="activeBankName(item)">
									{{item.brabank_name}}
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="info_item">
				<view class="label" data-required>账户名</view>
				<view class="value" style="border-bottom:none">
					{{formData.name}}
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>证件号</view>
				<view class="value" style="border-bottom:none">
					{{formData.card_number}}
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>银行卡号</view>
				<view class="value">
					<input type="text" placeholder="请输入银行卡号" v-model="formData.bank_number">
					<image src="@/home_packages/static/scan.png" mode="" @click="scanBank()"></image>
				</view>
			</view>
			<view class="info_item" @click="showPicker()">
				<view class="label" data-required>开户银行</view>
				<view class="value" style="border-bottom:none">
					<text>{{state.bank_name}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>手机号</view>
				<view class="value">
					<input type="number" placeholder="请输入手机号" v-model="formData.mobile" maxlength="11">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>验证码</view>
				<view class="value">
					<input type="number" placeholder="请输入验证码" v-model="formData.verify_code" @input="verify()">
					<view class="getCode" @click="sendCode()"
						:style="{color:state.codeTimer?'#999999':'',border:state.codeTimer?'solid 1px #999999':''}">
						{{state.codeText}}
					</view>
				</view>
			</view> -->
		</view>
		<optionBt confirmText="确定" @confirm="nextStep()"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				选择开户银行
				<view class="confirm" @click="picker_confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column" :key="index">
						{{item.node.bank_name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>

		<u-picker :show="state.address_show" title="开户行地址" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
			@change="changeHandler" keyName="label" closeOnClickOverlay @close="close()" @cancel="close()"></u-picker>
	</view>
</template>
<!--创建时间：2024-03-30 10:19:01-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import optionBt from "@/components/option-bt.vue"
	import { back } from "@/utils/jump";
	import bankList from "../json/banks_code.json";
	import addressList from "../json/address.json";

	import { reactive, getCurrentInstance, ref, nextTick } from "vue";

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

		bank_name: "",
		selectFlag: false,
		selectNameFlag: false,
		column: [],
		columnName: [],
		pub_picker: false,
		select_value: 0,
		verifyFlag: true,

		address_show: false,
		columns: [],
		firstIndex: 0,
		address: {} as any,
		address_label: ""
	})

	const uPickerRef = ref(null);

	const formData = reactive({
		order_id: uni.getStorageSync("order_id"),
		payee_type: "BANKACCT_PRI",
		bank_acctno: "",
		bank_name: "",
		bank_code: "",
		bank_acctname: "",
		cnaps_code: "",
		brabank_name: ""
	})

	const changeAddress = (arr : Array<object>) => {
		return arr.map((item : any) => {
			if (item.regionEntitys && item.regionEntitys.length) {
				return {
					label: item.region,
					value: item.code,
					children: item.regionEntitys.map((obj : any) => {
						return {
							label: obj.region,
							value: obj.code
						}
					})
				}
			} else {
				return {
					label: item.region,
					value: item.code
				}
			}
		})
	}

	setTimeout(() => {
		state.columns = [changeAddress(addressList)];
		nextTick(() => {
			uPickerRef.value.setColumnValues(1, state.columns[0][0].children)
		})
	}, 200)

	const selectBank = () => {
		if (formData.bank_name) {
			state.selectFlag = true;
			state.column = bankList.filter(item => item.node.bank_name.indexOf(formData.bank_name) !== -1);
		}
	}

	const activeBank = (obj : any) => {
		formData.bank_name = obj.bank_name;
		state.selectFlag = false;
		formData.bank_code = obj.bank_code;
	}
	const selectBankName = () => {
		if (formData.brabank_name) {
			uni.showLoading({
				title: "请稍后"
			})
			globalProxy.$request("/loan/User/getCnapsCode", {
				bank_code: formData.bank_code,
				city_code: state.address.value,
				brabank_name: formData.brabank_name
			}).then((res : any) => {
				state.selectNameFlag = true;
				state.columnName = res.data.list.filter((item : any) => item.brabank_name.indexOf(formData.brabank_name) !== -1);
				uni.hideLoading()
			}).catch(() => {
				uni.hideLoading()
			})

		}
	}

	const activeBankName = (obj : any) => {
		console.log('支行名称',obj);
		formData.brabank_name = obj.brabank_name;
		formData.cnaps_code = obj.cnaps_code;
		state.selectNameFlag = false;
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
					uni.request({
						url: "https://yhk.market.alicloudapi.com/rest/160601/ocr/ocr_bank_card.json",
						header: {
							"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
						},
						method: "POST",
						data: {
							image: result.data.url,
						},
						success: (scan : any) => {
							let scanData = scan.data;
							formData.bank_acctno = scanData.card_num;
							// state.bank_name = scanData.bank_name;
						}
					})
					uni.hideLoading()
				})
			}
		})
	}

	const showPicker = () => {
		state.address_show = true;
	}
	const bindChange = (val : any) => {
		state.select_value = val.detail.value[0]
	}

	const picker_confirm = () => {
		state.bank_name = state.column[state.select_value].name;
		formData.bank_id = state.column[state.select_value].id
		state.select_value = 0;
		state.pub_picker = false
	}

	// const sendCode = async () => {
	// 	if (formData.mobile === "") {
	// 		openTips("请输入手机号");
	// 		return;
	// 	}
	// 	if (state.codeTimer !== null) return;

	// 	await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.mobile });
	// 	// formData.verify_code = res.data.code;

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


	const nextStep = async () => {
		console.log(formData);
		//           银行卡号                         账户名
		if (formData.bank_acctno === "" || formData.bank_acctname === "") {
			openTips("资料未填写完成");
			return;
		}
		//     对公银行账户
		if (formData.payee_type === "BANKACCT_PUB") {
			if(formData.cnaps_code === "" ){
				openTips("输入支行名称模糊查询后必须从弹出的选项中选择正确的一项");
				return;
			}
			//         开户行地址                        银行code码
			if ( state.address_label === "" || formData.bank_code === "") {
				openTips("资料未填写完成");
				return;
			}
		}
		// console.log('验证通过');
		// return false
		// console.log('验证通过');
		globalProxy.$request("/loan/User/addOrderBank", formData).then(() => {
			back()
		})
	}

	// const verify = () => {
	// 	if (formData.verify_code.length >= 6) {
	// 		globalProxy.$request("/loan/Setting/checkVerifyCode", {
	// 			mobile: formData.mobile,
	// 			code: formData.verify_code
	// 		}).then((res : Result) => {
	// 			if (res.data.result === 1) {
	// 				state.verifyFlag = true;
	// 			} else {
	// 				state.verifyFlag = false;
	// 				openTips(res.data.message);
	// 			}
	// 		})
	// 	}
	// }

	const chooseAddress = () => {
		state.address_show = true
	}
	const close = () => {
		state.address_show = false
	}
	const confirm = (e : any) => {
		if (e.value[1]) {
			state.address = e.value[1]
			state.address_label = e.value[0].label + "-" + e.value[1].label;
		} else {
			state.address = e.value[0]
			state.address_label = e.value[0].label
		}
		close()
	}
	const changeHandler = (e : any) => {
		const { columnIndex, index } = e;
		if (columnIndex === 0) {
			if (state.columns[0][index].children.length) {
				uPickerRef.value.setColumnValues(1, state.columns[0][index].children)
			} else {
				uPickerRef.value.setColumnValues(1, [])
			}
			state.firstIndex = index
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
			/* height: 8vw; */
			height: auto;
			padding:10rpx 20rpx;
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

		>.content {
			min-height: 70vh;
			padding: 4vw;
			background: #FFFFFF;
			margin-bottom: 2.67vw;

			.info_item {
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
					position: relative;

					>.select {
						position: absolute;
						overflow: hidden;
						top: calc(100% + 1px);
						background: #FFFFFF;
						box-shadow: 0 6px 6px hsl(0deg 0% 0% / .075);
						width: 100%;
						transition: all .3s;
						z-index: 99;

						.sel_item {
							margin: 3vw 3vw 0;
							border-bottom: solid 1px #666666;
							padding: 0 3vw 3vw;

							&:last-child {
								border-bottom: none;
							}
						}
					}

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