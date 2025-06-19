<template>
	<view class="container">
		<navbar :title="props.type===1?'新增房产信息':'编辑房产信息'"></navbar>
		<view class="content">
			<view class="info_item" @click="chooseAddress()">
				<!-- <view class="label" data-required>房屋坐落城市</view> -->
				<view class="label">房屋坐落城市</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.city_address}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<!-- <view class="label" data-required>街道及门牌号</view> -->
				<view class="label">街道及门牌号</view>
				<view class="value">
					<input type="text" placeholder="请输入街道及门牌号" v-model="formData.address" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="showPicker('house_mortgage_order')">
				<view class="label" data-required>抵押顺位</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.house_mortgage_order}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required style="width: 20vw;">房屋建筑面积(m²)</view>
				<view class="value">
					<input type="digit" placeholder="请输入房屋建筑面积" v-model="formData.area" style="width: 100%;">
				</view>
			</view>
			<view class="info_item" @click="showPicker('house_has_type')">
				<view class="label" data-required>持有方式</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.house_has_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('house_use_type')">
				<view class="label" data-required>使用现状</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.house_use_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('house_power_type')">
				<view class="label" data-required>权利性质</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.house_power_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>评估价格(元)</view>
				<view class="value">
					<input type="digit" placeholder="请输入评估价格" @change="moneyChange" v-model="formData.price"
						style="width: 100%;" />
				</view>
			</view>
			<view class="info_itemTwo">
				<view class="label"></view>
				<view class="value">
					<view style="color: #FF0000;">{{state.dxMoney}}</view>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>证书编号</view>
				<view class="value">
					<input type="text" placeholder="请输入证书编号" v-model="formData.card_number" style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label">权证名称</view>
				<view class="value">
					<input type="text" placeholder="请输入权证名称" v-model="formData.card_name" style="width: 100%;">
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>产权人</view>
				<view class="value" style="border-bottom:none;display: block;">
					<view v-for="(i,j) in formData.owners" :key="j"
						style="display: flex;align-items: center;justify-content: space-between;"
						:style="j<formData.owners.length - 1?'margin-bottom: 10px;':''">
						<text>{{i.name}}</text>
						<view class="right">
							<u-icon name="trash" size="5vw" color="#FF8177" @click="deleteInfo(j)"></u-icon>
							<image src="@/home_packages/static/icon-adduser.png" mode="" @click="navTo()" v-if="j===0">
							</image>
						</view>
					</view>
					<view style="display: flex;align-items: center;justify-content: space-between;"
						v-if="formData.owners.length === 0">
						<text></text>
						<view class="right">
							<image src="@/home_packages/static/icon-adduser.png" mode="" @click="navTo()"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- add -->
			<view class="info_item">
				<view class="label">受托人</view>
				<view class="value" style="border-bottom:none;display: block;">
					<view v-for="(i,j) in formData.weituo_person" :key="j"
						style="display: flex;align-items: center;justify-content: space-between;"
						:style="j<formData.weituo_person.length - 1?'margin-bottom: 10px;':''">
						<text>{{i.name}}</text>
						<view class="right">
							<u-icon name="trash" size="5vw" color="#FF8177" @click="deleteInfoTwo(j)"></u-icon>
							<image src="@/home_packages/static/icon-adduser.png" mode="" @click="navToTwo()"
								v-if="j===0">
							</image>
						</view>
					</view>
					<view style="display: flex;align-items: center;justify-content: space-between;"
						v-if="formData.weituo_person.length === 0">
						<text></text>
						<view class="right">
							<image src="@/home_packages/static/icon-adduser.png" mode="" @click="navToTwo()"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="label">OCR识别</view>
			<view class="idcard">
				<view class="item" @click="uploadImg()">
					点击上传图片
					<image :src="state.houseImg" mode="" v-if="state.houseImg"></image>
				</view>
			</view>
		</view>
		<view style="height: 20vw;"></view>
		<optionBt @confirm="nextStep()" confirmText="确定"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>

		<u-picker :show="state.address_show" title="坐落城市" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
			@change="changeHandler" keyName="label" closeOnClickOverlay @close="close()" @cancel="close()"></u-picker>

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
<!--创建时间：2024-03-30 14:50:02-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import { back } from "@/utils/jump";
	import { Result } from "@/utils/interface"
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { reactive, defineProps, getCurrentInstance, onMounted, nextTick, ref } from "vue"

	const props = defineProps({
		type: { type: Number },
		houseIndex: { type: Number }
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

		houseImg: "",

		// 公共回显值
		pub_value: [],
		// 公共picker
		pub_picker: false,
		// 公共picker列表
		column: {} as any,

		pub_name: "",
		select_value: 0,

		address_show: false,
		columns: [],
		firstIndex: 0,

		dxMoney: ''//大写金额
	})

	const formData = reactive({
		city_address: "",
		address: "",
		house_mortgage_order: "",
		area: "",
		house_has_type: "",
		house_use_type: "",
		house_power_type: "",
		price: "",
		card_number: "",
		card_name: "",
		owners: [],
		weituo_person: []
	})

	onMounted(() => {
		if (props.type === 2) {
			Object.assign(formData, uni.getStorageSync("houseArray")[props.houseIndex]);
		} else {
			uni.removeStorageSync("ownerArray")
		}
	})

	const moneyChange = () => {
		ToString(formData.price)
	}

	// const ToString = (n:any) => {
	// 	if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
	// 		state.dxMoney = "数据非法"; // 判断数据是否大于0
	// 		return false
	// 	}
	// 	var unit = "千佰拾亿千佰拾万千佰拾元角分", str = "";
	// 	n += "00";
	// 	var indexpoint = n.indexOf('.');
	// 	// 如果是小数，截取小数点前面的位数
	// 	if (indexpoint >= 0) {
	// 		n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2);
	// 	}
	// 	unit = unit.substr(unit.length - n.length);
	// 	for (var i = 0; i < n.length; i++) {
	// 		str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i); // 遍历转化为大写的数字
	// 	}
	// 	state.dxMoney = str.replace(/零(千|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"); // 替换掉数字里面的零字符，得到结果
	// 	return false
	// }
	const ToString = (n : any) : string => {
		if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
			state.dxMoney = "数据非法";
			return "数据非法";
		}
		const digit = "零壹贰叁肆伍陆柒捌玖";
		const unit = "仟佰拾亿仟佰拾万仟佰拾元角分";
		let str = "";
		n = n.toString();
		const indexpoint = n.indexOf(".");
		if (indexpoint >= 0) {
			const integer = n.substring(0, indexpoint);
			const decimal = n.substr(indexpoint + 1, 2).padEnd(2, "0"); // 保留两位
			n = integer + decimal;
		} else {
			n = n + "00";
		}
		const unitSlice = unit.substr(unit.length - n.length);
		for (let i = 0; i < n.length; i++) {
			const num = parseInt(n.charAt(i), 10);
			str += digit.charAt(num) + unitSlice.charAt(i);
		}
		state.dxMoney = str
			.replace(/零(仟|佰|拾|角)/g, "零")
			.replace(/(零)+/g, "零")
			.replace(/零(万|亿|元)/g, "$1")
			.replace(/^元零?|零分/g, "")
			.replace(/元$/g, "元整");
	};

	const deleteInfo = (index : number) => {
		formData.owners.splice(index, 1);
	}

	const navTo = () => {
		uni.setStorageSync("ownerArray", formData.owners);
		uni.setStorageSync("fczdz", (formData.city_address + formData.address).replace(/-/g, ""));
		uni.navigateTo({
			url: "/home_packages/ownership/index"
		})
	}
	// 受托人
	const deleteInfoTwo = (index : number) => {
		formData.weituo_person.splice(index, 1);
	}
	const navToTwo = () => {
		uni.setStorageSync("weituo_personArray", formData.weituo_person);
		uni.navigateTo({
			url: "/home_packages/weituo_person/index"
		})
	}

	const nextStep = () => {
		// formData.city_address === "" ||  formData.card_name === "" || 
		if (formData.address === "" || formData.area === "" || formData.card_number === "" || formData.house_has_type === "" ||
			formData.house_mortgage_order === "" || formData.house_power_type === "" ||
			formData.house_use_type === "" || formData.owners.length === 0 || formData.price === "") {
			openTips("资料未填写完成");
			return;
		}
		let array : any;
		if (props.type === 2) {
			array = uni.getStorageSync("houseArray");
			array[props.houseIndex] = formData;
		} else {
			if (uni.getStorageSync("houseArray")) {
				array = uni.getStorageSync("houseArray");
				array.push(formData)
			} else {
				array = [];
				array.push(formData)
			}
		}
		uni.setStorageSync("houseArray", array);
		uni.removeStorageSync("ownerArray")
		uni.removeStorageSync("weituo_personArray")
		back();
	}

	const uploadImg = () => {
		uni.chooseImage({
			count: 1,
			success: (res : any) => {
				state.houseImg = res.tempFiles[0].path;
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
						url: "https://bdcqz.market.alicloudapi.com/ocrservice/estateCert",
						header: {
							"Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
						},
						method: "POST",
						data: {
							url: result.data.url
						},
						success: (scan : any) => {
							let scanData = scan.data.data;
							formData.address = scanData["坐落"];
							formData.area = scanData["房屋建筑面积"];
							// formData.house_power_type = scanData["权利性质"];
							formData.card_number = scanData["证号"];
							// formData.name = scanData[0].word.substr(scanData[0].word.lastIndexOf("：") + 1);
							// formData.card_number = scanData[scanData.length - 1].word
						}
					})
					uni.hideLoading()
				})
			}
		})
	}

	onShow(() => {
		if (uni.getStorageSync("ownerArray")) {
			formData.owners = uni.getStorageSync("ownerArray")
		}
		if (uni.getStorageSync("weituo_personArray")) {
			formData.weituo_person = uni.getStorageSync("weituo_personArray")
		}
	})

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
		state.pub_name = name;
		state.pub_picker = true
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
			if (state.columns[0][index].children.length) {
				uPickerRef.value.setColumnValues(1, state.columns[0][index].children)
				uPickerRef.value.setColumnValues(2, state.columns[0][index].children[0].children)
			} else {
				uPickerRef.value.setColumnValues(1, [])
				uPickerRef.value.setColumnValues(2, [])
			}
			state.firstIndex = index;
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
			margin: 2.67vw 0;

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

			>.info_itemTwo {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-top: 1.25vw;

				>.value {
					width: 66.67vw;
					font-size: 3.2vw;
					color: #333333;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				>.label {
					font-size: 3.2vw;
					color: #333333;
				}
			}

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

					.right {
						display: flex;
						flex-direction: row-reverse;
						align-items: center;
						justify-content: space-between;
						width: 20vw;
					}

					image {
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