<template>
	<view class="container" v-if="state.id">
		<navbar title="订单详情"></navbar>
		<!-- 注意：需要更改uview-plus源码 -->
		<u-read-more closeText="更多信息" openText="收起更多" showHeight="260" color="#FF8177" toggle textIndent="0px">
			<view class="infoBox" v-if="state.info.order_material">
				<view class="item">
					<view class="label">姓名</view>
					{{state.info.order_material.name}}
				</view>
				<view class="item">
					<view class="label">手机号</view>
					{{state.info.order_material.mobile || state.info.order_material.leader_mobile}}
					<image src="@/static/call.png" mode=""></image>
				</view>
				<view class="item">
					<view class="label">产品名称</view>
					{{state.goods_name}}
				</view>
				<view class="item">
					<view class="label">合同编号</view>
					{{state.info.contract_num}}
				</view>
				<view class="item">
					<view class="label">申请额度(元)</view>
					{{state.info.order_material.apply_money}}
				</view>
				<view class="item">
					<view class="label"></view>
					<view style="color: #FF0000;">{{state.dxMoney}}</view>
				</view>
				<view class="item">
					<view class="label">计息方式</view>
					{{state.info.rate_type==="day"?'按天':state.info.rate_type==="month"?'按月':state.info.rate_type==="year"?'按年':''}}
				</view>
				<view class="item">
					<view class="label">年利率(%)</view>
					{{state.info.loan_rate}}
				</view>
			</view>
			<information v-if="state.com_type===1" showFlag></information>
			<information1 v-if="state.com_type===2" showFlag></information1>
			<detailed v-if="state.com_type===1" showFlag></detailed>
			<detailed1 v-if="state.com_type===2" showFlag></detailed1>
			<bankcard showFlag></bankcard>
			<borrowing showFlag></borrowing>
			<borrower showFlag></borrower>
			<rongdan showFlag></rongdan>
			<houseproperty showFlag></houseproperty>
			<capture showFlag></capture>
			<otherinfo showFlag></otherinfo>
		</u-read-more>
		<view class="content" v-if="state.info.id">
			<view class="label">进度详情</view>

			<view class="step">
				<view class="left" :style="{height:state.leftheight+'px'}">
					<view class="item finish" v-if="state.type[state.info.status]>1">1</view>
					<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===1"></u-icon>
					<view class="line"></view>
					<view class="item " :class="state.type[state.info.status]>2?'finish':''">2</view>
					<view class="line"></view>
					<template v-for="(i,j) in state.info.check_logs" :key="j">
						<view class="item"
							:class="state.type[state.info.status]>2||j<(state.info.check_logs.length - 1)?'finish':''"
							v-if="state.type[state.info.status]!==2||j<(state.info.check_logs.length - 1)">{{j+2}}
						</view>
						<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
							v-if="state.type[state.info.status]===2&&j===(state.info.check_logs.length - 1)"></u-icon>
						<view class="line"></view>
					</template>
					<view class="item" :class="state.type[state.info.status]>3?'finish':''"
						v-if="state.type[state.info.status]!==3">{{state.info.check_logs.length+2}}</view>
					<!-- <u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===3"></u-icon> -->
					<view class="item " :class="state.type[state.info.status]>3?'finish':''">3</view>
					<view class="line"></view>
					<view class="item" :class="state.type[state.info.status]>4?'finish':''"
						v-if="state.type[state.info.status]!==4">{{state.info.check_logs.length+3}}</view>
					<!-- 	<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===4"></u-icon> -->
					<view class="item " :class="state.type[state.info.status]>4?'finish':''">4</view>
				</view>
				<view class="right" id="setupContent">
					<view class="item current" v-if="state.type[state.info.status] === 1">
						<view class="title">进件</view>
						待提交，任务处理人: {{state.info.businesser_name}}
					</view>
					<view class="item finish1" v-if="state.type[state.info.status]  > 1">
						<view class="title">进件</view>
						{{state.info.create_time}} 提交成功，任务处理人: {{state.info.businesser_name}}
					</view>
					<!-- <view class="item" :class="state.type[state.info.status]===2?'current':state.type[state.info.status]>2?'finish1':''">
						<view class="title">审批</view>
						<text v-if="state.info.status === 'b'">资料待复核</text>
						<text v-if="state.type[state.info.status]>2">资料审核通过，任务处理人:{{state.info.checker_name}}</text>
						<text v-if="state.info.status === 'z'">资料审核未通过，驳回人：{{state.info.checker_name}}</text>
						<view v-for="(i,j) in state.info.check_logs" :key="index">
							<text>{{i.check_process==='a'?'资料复核':i.check_process==='b'?'风险审查':'合同复核'}}，</text>
							<text>任务处理人：{{i.handler_name||'暂无'}}，</text>
							<text>处理时间：{{i.handle_time||'暂无'}}，</text>
							<text>当前状态：{{i.status}}，</text>
							<text>备注：{{i.remark||'无'}}</text>
						</view>
					</view> -->

					<view class="item" v-if="state.type[state.info.status] === 1">
						<view class="title">风险审查</view>
						<text>任务未触达</text>
					</view>
					<view class="item current" v-if="state.type[state.info.status] === 2 && state.info.checker_id == 0">
						<view class="title">风险审查</view>
						<text>待认领</text>
					</view>

					<view class="item current" v-if="state.type[state.info.status] === 2 && state.info.checker_id > 0">
						<view class="title">风险审查</view>
						<text>资料已认领，任务处理人：{{state.info.checker_name}}</text>
					</view>

					<view class="item finish1" v-if="state.type[state.info.status] > 2">
						<view class="title">风险审查</view>
						<text>资料已通过，任务处理人：{{state.info.checker_name}}</text>
					</view>

					<view class="item"
						:class="state.type[state.info.status]===3?'current':state.type[state.info.status]>3?'finish1':''">
						<view class="title">合同签约</view>
						<text v-if="state.type[state.info.status]<3">任务未触达</text>
						<text v-if="state.type[state.info.status]===3">待签约</text>
						<text v-if="state.type[state.info.status]>3">合同签约完成</text>
					</view>
					<view class="item"
						:class="state.type[state.info.status]===4?'current':state.type[state.info.status]>4?'finish1':''">
						<view class="title">放款</view>
						<text v-if="state.type[state.info.status]<4">任务未触达</text>
						<text v-if="state.info.status === 'd'">公证中</text>
						<text v-if="state.info.status === 'e'">公证完成，等待放款</text>
						<text v-if="state.info.status === 'f'">转债中</text>
						<text v-if="state.info.status === 'g'">流程完结</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<!--创建时间：2024-03-31 11:34:41-->
<script setup lang="ts">
	import information from "@/components/data_components/information.vue";
	import information1 from "@/components/data_components/information1.vue";
	import detailed from "@/components/data_components/detailed.vue";
	import detailed1 from "@/components/data_components/detailed1.vue";
	import bankcard from "@/components/data_components/bankcard.vue";
	import borrowing from "@/components/data_components/borrowing.vue";
	import borrower from "@/components/data_components/borrower.vue"
	import rongdan from "@/components/data_components/rongdan.vue";
	import houseproperty from "@/components/data_components/houseproperty.vue";
	import capture from "@/components/data_components/capture.vue";
	import otherinfo from "@/components/data_components/otherinfo.vue";
	import { reactive, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface.ts"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const state = reactive({
		id: "",
		com_type: null,
		goods_name: "",
		leftheight: 0,
		step: 1,
		info: {} as any,
		type: {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
			e: 4,
			f: 4,
			g: 5,
			z: 2
		},
		dxMoney: ''
	})

	const getUrlParams = () : any => {
		let url = location.href;
		var params = {};
		if (url.indexOf("?") !== -1) {
			var queryString = url.split("?")[1];
			var pairs = queryString.split("&");
			for (var i = 0; i < pairs.length; i++) {
				var pair = pairs[i].split("=");
				var key = decodeURIComponent(pair[0]);
				var value = decodeURIComponent(pair[1]);
				params[key] = value;
			}
		}
		return params;
	}

	const callPhone = () => {
		uni.makePhoneCall({
			phoneNumber: state.info.order_material.mobile
		})
	}

	if (getUrlParams().order_id) {
		uni.showLoading({
			title: "请稍后",
			mask: true
		})
		state.goods_name = getUrlParams().goods_name;
		state.id = getUrlParams().order_id;
		state.com_type = Number(getUrlParams().type);

		uni.setStorageSync("order_id", state.id)
	} else {
		alert("参数传递有误，请检查后重试")
	}
	onMounted(() => {
		console.log(state.id)
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: state.id
		}).then((res : Result) => {
			// res.data.status = 'g'
			state.info = res.data
		    ToString(state.info.order_material.apply_money)//申请额度
			uni.setStorageSync("orderInfo", res.data);
			setTimeout(() => {
				uni.createSelectorQuery().select("#setupContent").boundingClientRect().exec(res => {
					if (res[0]) {
						uni.hideLoading();
						state.leftheight = res[0].height - 15;
					}
				})
			}, 200)
		})
	})

	// const ToString = (n : any) => {
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
</script>
<style lang='scss'>
	.u-read-more {
		margin-bottom: 2vw;
	}

	.finish {
		/* color: #333333 !important; */
		background: #109181 !important;
	}

	.finish1 {
		color: #109181
	}

	.current {
		color: #F97E39
	}

	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 2.67vw 4vw;
			background: #FFFFFF;

			>.step {
				display: flex;

				>.right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					min-height: 57vw;
					margin-left: 1.33vw;
					margin-top: -5px;

					>.item {
						font-size: 2.67vw;
						margin-bottom: 40px;

						&:last-child {
							margin-bottom: 0;
						}

						>.title {
							font-weight: bold;
							font-size: 3.47vw;
						}
					}
				}

				.left {
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: space-between;

					.line {
						width: 0.53vw;
						min-height: 8vw;
						background: #999999;
						border-radius: 0.27vw;
					}

					.item {
						width: 4vw;
						height: 4vw;
						background: #999999;
						border-radius: 50%;
						font-weight: 400;
						font-size: 2.67vw;
						color: #FFFFFF;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.73vw;
				color: #333333;
				display: flex;
				align-items: center;
				margin-bottom: 4vw;

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

		.infoBox {
			padding: 2.67vw 8vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			margin: 4vw 0 2vw;

			>.more {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 3.2vw;
				color: #FF8177;
				margin-top: 6.13vw;
			}

			>.item {
				display: flex;
				align-items: center;
				font-size: 3.2vw;
				color: #666666;
				margin-bottom: 4vw;

				>image {
					width: 5.33vw;
					height: 5.33vw;
					margin-left: 5vw;
				}

				&:last-child {
					margin-bottom: 0;
				}

				>.label {
					width: 30vw;
					color: #333333;
				}
			}
		}
	}
</style>