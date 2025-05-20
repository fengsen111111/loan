<template>
	<view class="borrowing">
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
				<view class="text current">贷款信息</view>
				<view class="text">……………</view>
				<view class="text">信息确认</view>
			</view>
		</view>

		<view class="content">
			<view class="label">贷款信息</view>
			<view class="info_item">
				<view class="label" data-required>合同签署地</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.sign_address}}</text>
					<!-- <u-icon name="arrow-down" size="5vw" color="#666666"></u-icon> -->
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>申请金额</view>
				<view class="value">
					<input type="text" placeholder="请输入申请金额" v-model="formData.apply_money" @change="moneyChange"
						:disabled="props.showFlag">
				</view>
			</view>
			<view class="info_itemTwo">
				<view class="label"></view>
				<view class="value">
					<view style="color: #FF0000;">{{state.dxMoney}}</view>
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>执行利率</view>
				<view class="value">
					<input type="digit" :placeholder="'请输入执行利率('+state.rate_range+')'" v-model="formData.loan_rate"
						:disabled="props.showFlag" style="width: 100%;">
				</view>
			</view>
			<!-- <view class="info_item" @click="showPicker('loan_time_type')">
				<view class="label" data-required>期数类型</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.loan_time_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view> -->
			<view class="info_item">
				<view class="label" data-required>贷款期数</view>
				<view class="value">
					<!-- <input type="number" placeholder="请输入贷款期数" v-model="formData.loan_time" :disabled="props.showFlag"
						@blur="changeTime()"> -->
					<input type="number" placeholder="请输入贷款期数" v-model="formData.loan_time" :disabled="props.showFlag"
						@change="onChange()">
					期
				</view>
			</view>
			<view class="info_item">
				<view class="label" data-required>借款期限</view>
				<view class="value" @click="state.calenderShow=true">
					<text :style="formData.start_time?'':'color:#666666'">
						{{formData.start_time?formData.start_time+" - "+formData.end_time:'请选择借款期限'}}
					</text>
				</view>
			</view>
			<view class="info_item" @click="showPicker('repayment_type')">
				<view class="label" data-required>还款方式</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.repayment_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" @click="showPicker('use_type')">
				<view class="label" data-required>申请用途</view>
				<view class="value" style="border-bottom:none">
					<text>{{formData.use_type}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item" v-if="state.showPayment">
				<view class="label" data-required>收款卡</view>
				<view class="value" style="border-bottom:none"
					@click="props.showFlag?'':$navigateTo('/home_packages/select_bank_card/index',{type:1})">
					<text>{{formData.payment_bank_text}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="info_item">
				<view class="label">还款卡</view>
				<view class="value" style="border-bottom:none"
					@click="props.showFlag?'':$navigateTo('/home_packages/select_bank_card/index',{type:2})">
					<text>{{formData.return_bank_text}}</text>
					<u-icon name="arrow-down" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
		</view>

		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
		<u-picker :show="state.address_show" title="合同签署地" ref="uPickerRef" :columns="state.columns" @confirm="confirm"
			@change="changeHandler" keyName="label" closeOnClickOverlay @close="close()" @cancel="close()"></u-picker>
		<!-- <t-calendar :visible="true" @confirm="handleConfirm" type="range"></t-calendar> -->
		<l-calendar :visible="state.calenderShow" @confirm="handleConfirm" isRange
			@cancel="state.calenderShow = false"></l-calendar>

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
<!--创建时间：2024-03-29 16:26:52-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { dateFormat } from "@/utils/dateFormat"
	import { reactive, getCurrentInstance, ref, nextTick, onMounted } from "vue"

	const emits = defineEmits(["next"]);
	const props = defineProps({
		showFlag: { type: Boolean }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

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

		address_show: false,
		columns: [],
		firstIndex: 0,

		calenderShow: false,

		// 公共回显值
		pub_value: [],
		// 公共picker
		pub_picker: false,
		// 公共picker列表
		column: {} as any,

		pub_name: "",
		select_value: 0,

		showPayment: uni.getStorageSync("open_ll_status") === 'N',

		rate_range: "",

		dxMoney: ''//大写金额
	})

	const formData = reactive({
		sign_address: "四川省-成都市-彭州市",
		apply_money: "",
		loan_rate: "",
		loan_time: "",
		start_time: "",
		end_time: "",
		repayment_type: "",
		use_type: "",
		payment_bank_id: "",
		payment_bank_text: "",
		return_bank_id: "",
		return_bank_text: ""
	})

	onShow(() => {
		if (state.showPayment) {
			if (uni.getStorageSync("bankInfo1")) {
				const bankInfo = uni.getStorageSync("bankInfo1")
				formData.payment_bank_id = bankInfo.id
				formData.payment_bank_text = (bankInfo.bank_name || "") + " " + bankInfo.bank_acctno;
				uni.removeStorageSync("bankInfo1")
			}
		}
		if (uni.getStorageSync("bankInfo2")) {
			const bankInfo = uni.getStorageSync("bankInfo2");
			formData.return_bank_id = bankInfo.id
			formData.return_bank_text = (bankInfo.bank_name || "") + " " + bankInfo.bank_acctno;
			uni.removeStorageSync("bankInfo2")
		}
	})


	const addMonths = (date : string, months : number) => {
		let newDate : Date;
		if (isNaN(Number(date))) {
			newDate = new Date(date);
		} else {
			newDate = new Date(Number(date));
			formData.start_time = dateFormat(new Date(Number(date)), "yyyy/MM/dd")
		}
		newDate.setMonth(newDate.getMonth() + months);
		return dateFormat(newDate, "yyyy/MM/dd");
	}

	onMounted(() => {
		// if (uni.getStorageSync("loan_time")) {
		// 	formData.loan_time = uni.getStorageSync("loan_time");
		// 	formData.start_time = uni.getStorageSync("order_time");
		// 	formData.end_time = addMonths(formData.start_time, Number(formData.loan_time));
		// }
		state.rate_range = uni.getStorageSync("rate_range");
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 4
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
		})
	})

	const moneyChange = () => {
		ToString(formData.apply_money)
	}

	const ToString = (n : any) => {
		if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
			state.dxMoney = "数据非法"; // 判断数据是否大于0
			return false
		}
		var unit = "千佰拾亿千佰拾万千佰拾元角分", str = "";
		n += "00";
		var indexpoint = n.indexOf('.');
		// 如果是小数，截取小数点前面的位数
		if (indexpoint >= 0) {
			n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2);
		}
		unit = unit.substr(unit.length - n.length);
		for (var i = 0; i < n.length; i++) {
			str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i); // 遍历转化为大写的数字
		}
		state.dxMoney = str.replace(/零(千|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"); // 替换掉数字里面的零字符，得到结果
		return false
	}


	const nextStep = () => {
		if (formData.sign_address === "" || formData.apply_money === "" || formData.loan_rate === "" || formData.loan_time === "" || formData.start_time === "" || formData.repayment_type === "" || formData.use_type === "") {
			openTips("资料未填写完成");
			return;
		}
		if (state.showPayment && formData.payment_bank_id === "") {
			openTips("资料未填写完成");
			return;
		}
		const value = state.rate_range.split("-");
		const minValue = Number(value[0].split("%")[0]);
		const maxValue = Number(value[1].split("%")[0]);
		if (parseFloat(formData.loan_rate) < minValue) {
			// openTips("执行利率不能小于利率区间");
			openTips("执行利率设置最小值不能超过产品设置的执行利率：" + `${minValue}-${maxValue}`);
			return;
		}
		if (parseFloat(formData.loan_rate) > maxValue) {
			// openTips("执行利率不能大于利率区间");
			openTips("执行利率设置最大值不能超过产品设置的执行利率：" + `${minValue}-${maxValue}`);
			return;
		}
		if (Number(formData.loan_time) > Number(uni.getStorageSync("loan_time"))) {
			openTips("贷款期数超过可贷期数");
			return;
		}
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 4,
			...formData
		}).then(() => {
			emits("next");
		})
	}

	// const changeTime = () => {
	// 	formData.end_time = addMonths(formData.start_time, Number(formData.loan_time));
	// }

	// const handleConfirm = (e : any) => {
	// 	formData.start_time = dateFormat(e.result, "date");
	// 	formData.end_time = addMonths(formData.start_time, Number(formData.loan_time));
	// 	state.calenderShow = false
	// }
	const formatDate = (date) => {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}/${m}/${d}`;
	}
	const addMonthsChange = (date, months) => {
		const newDate = new Date(date); // 创建原始日期的副本
		const d = newDate.getDate();
		newDate.setMonth(newDate.getMonth() + months*1);
		// 修复日期越界问题（比如从1月31日加一个月 -> 变成3月2日）
		if (newDate.getDate() !== d) {
			newDate.setDate(0); // 设为上月最后一天
		}
		return newDate;
	}
	const onChange = () => {
		console.log('贷款期数变化了', formData.loan_time);
		const now = new Date(); // 每次创建新日期，不能复用旧的 Date 对象
		const start = new Date(now); // 保证 start 和 end 是两个独立对象
		formData.start_time = formatDate(start);
		const end = addMonthsChange(start, formData.loan_time); // 不要直接传 now
		formData.end_time = formatDate(end);
		console.log(formData.start_time, formData.end_time);
	}


	const handleConfirm = (e : any) => {
		// console.log('e',e);
		formData.start_time = e.startDate;
		formData.end_time = e.endDate;
		state.calenderShow = false
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
		if (props.showFlag) return
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
		formData.sign_address = ""
		e.value.map((item : any, index : number) => {
			formData.sign_address += (index === e.value.length - 1 ? item.label : item.label + "-");
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
	.borrowing {

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
			margin-bottom: 2.67vw;

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