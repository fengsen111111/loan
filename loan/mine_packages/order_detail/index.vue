<template>
	<view class="container">
		<navbar title="订单详情"></navbar>
		<!-- {{props.type}} -->
		<!-- 注意：需要更改uview-plus源码 -->
		<u-read-more closeText="更多信息" openText="收起更多" showHeight="240" color="#FF8177" toggle textIndent="0px">
			<view class="infoBox" v-if="state.info.order_material">
				<view class="item">
					<view class="label">姓名</view>
					{{state.info.order_material.name}}
				</view>
				<view class="item">
					<view class="label">手机号</view>
					{{state.info.order_material.mobile || state.info.order_material.leader_mobile}}
					<image src="@/static/call.png" mode="" @click="callPhone()"></image>
				</view>
				<view class="item">
					<view class="label">产品名称</view>
					{{props.goods_name}}
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
					<view class="label">计息方式</view>
					{{state.info.rate_type==="day"?'按天':state.info.rate_type==="month"?'按月':state.info.rate_type==="year"?'按年':''}}
				</view>
				<view class="item">
					<view class="label">年利率(%)</view>
					{{state.info.loan_rate}}
				</view>
			</view>
			<information v-if="props.type===1" showFlag></information>
			<information1 v-if="props.type===2" showFlag></information1>
			<detailed v-if="props.type===1" showFlag></detailed>
			<detailed1 v-if="props.type===2" showFlag></detailed1>
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
					<view class="item " :class="state.type[state.info.status]>3?'finish':''">3</view>
					<view class="line"></view>
					<view class="item" :class="state.type[state.info.status]>4?'finish':''"
						v-if="state.type[state.info.status]!==4">{{state.info.check_logs.length+3}}</view>
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
					<view class="item"  v-if="state.type[state.info.status] === 1">
						<view class="title">风险审查</view>
						<text>任务未触达</text>
					</view>
					<view class="item current"  v-if="state.type[state.info.status] === 2 && state.info.checker_id == 0">
						<view class="title">风险审查</view>
						<text>待认领</text>
					</view>
					<view class="item current"  v-if="state.type[state.info.status] === 2 && state.info.checker_id > 0">
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
				<!-- <view class="left" :style="{height:state.leftheight+'px'}">
					<view class="item finish" v-if="state.type[state.info.status]>1">1</view>
					<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===1"></u-icon>
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
					<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===3"></u-icon>
					<view class="line"></view>
					<view class="item" :class="state.type[state.info.status]>4?'finish':''"
						v-if="state.type[state.info.status]!==4">{{state.info.check_logs.length+3}}</view>
					<u-icon name="checkmark-circle-fill" size="5vw" color="#F97E39"
						v-if="state.type[state.info.status]===4"></u-icon>
				</view>
				<view class="right" id="setupContent">
					<view class="item" :class="state.type[state.info.status]===1?'current':'finish1'">
						<view class="title">进件申请</view>
						{{state.info.create_time}} 提交成功，任务处理人: {{state.info.businesser_name}}
					</view>

					<view class="item" v-for="(i,j) in state.info.check_logs" :key="j"
						:class="state.type[state.info.status]===2&&j==state.info.check_logs.length - 1?'current':state.type[state.info.status]>2||j<state.info.check_logs.length - 1?'finish1':''">
						<view class="title">{{i.check_process==='a'?'资料复核':i.check_process==='b'?'风险审查':'合同复核'}}</view>
						<text>资料已{{i.status==='a'?'认领':i.status==='b'?'通过':'拒绝'}}，任务处理人：{{i.handler_name}}</text>
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
				</view> -->
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
	import navbar from "@/components/navbar.vue"
	import { reactive, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const props = defineProps({
		id: { type: String },
		type: { type: Number },
		goods_name: { type: String }
	})

	uni.setStorageSync("order_id", props.id)

	const state = reactive({
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
		}
	})

	const callPhone = () => {
		uni.makePhoneCall({
			phoneNumber: state.info.order_material.mobile
		})
	}
	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: props.id
		}).then((res : Result) => {
			state.info = res.data
			setTimeout(() => {
				uni.createSelectorQuery().select("#setupContent").boundingClientRect().exec(res => {
					if (res[0]) {
						state.leftheight = res[0].height - 15;
					}
				})
			}, 200)
		})
	})
</script>
<style lang='scss'>
	.u-read-more__toggle {
		padding-bottom: 8px;
		background: #FFFFFF;
	}

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