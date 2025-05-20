<template>
	<view class="container">
		<navbar title="进度查询"></navbar>
		<view class="content">

			<view class="list" v-for="(item,index) in state.list" :key="index">
				<view class="title">
					<view class="left">
						<view class="info"
							:style="item.type==='person'?'max-width:17vw;min-width:17vw;width:fit-content':'max-width:40vw;min-width:17vw;width:fit-content'">
							{{item.name}}
						</view>
						{{item.type==='person'?$cardUtil(item.card_number):''}}
						<view class="type"
							:style="{border:'solid 1px '+state.status_type[item.status].color,color:state.status_type[item.status].color}">
							{{state.status_type[item.status].name}}
						</view>
						<view class="type"
							v-if="item.status==='d'||item.status==='e'||item.status==='f'||item.status==='g'"
							:style="{border:'solid 1px '+state.notarization_status[item.notarization_status].color,color:state.notarization_status[item.notarization_status].color}">
							{{state.notarization_status[item.notarization_status].name}}
						</view>
					</view>
					<view class="right" @click="navTo(item)">
						<text>详情</text>
						<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
					</view>
				</view>
				<view class="con">
					<view class="left">
						<view class="label">产品名称</view>
						{{item.goods_name}}
					</view>
					<view class="right" :style="item.type==='person'?'background: #FF8177;':'background: #F3A469;'">
						{{item.type==="person"?'个人':'企业'}}
					</view>
				</view>
				<view class="con">
					<view class="left">
						<view class="label">合同编号</view>
						{{item.contract_num}}
					</view>
				</view>
				<view class="con">
					<view class="left">
						<view class="label">申请时间</view>
						{{item.create_time}}
					</view>
					<view class="rightText" @click="copyHref(item.open_ll_account_url)"
						v-if="(item.status === 'b'||item.status === 'c')&&item.open_ll_status==='Y'&&state.appType===2&&item.ll_account_status == 'a'">
						开户管理
					</view>
					
					<view class="rightText" @click="show_reason(item.open_ll_account_url)"
						v-if="(item.status === 'b'||item.status === 'c')&&item.open_ll_status==='Y'&&state.appType===2&&item.ll_account_status == 'c'">
						开户管理
					</view>
					<view class="rightText" @click="copyHref(item.manage_ll_account_url)"
						v-if="item.status!=='a'&&item.status!=='b'&&item.status!=='c'&&item.open_ll_status==='Y'&&state.appType===1&&item.ll_account_status == 'b'">
						账户管理
					</view>
				</view>
			</view>

			<view class="empty" v-if="state.list.length===0">
				<image src="@/static/empty123.png" mode=""></image>
				暂无任何内容;
			</view>
		</view>


		<view class="picker" v-if="state.pub_picker">
			<view class="title">
				<view class="cancel" @click="state.pub_picker=false">取消</view>
				搜索类型
				<view class="confirm" @click="confirm()">确定</view>
			</view>
			<picker-view style="min-height: 50vw;" indicator-style="picker-selected" :value="state.pub_value"
				@change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in state.column" :key="index">{{item.name}}</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="mask" v-if="state.pub_picker" @click="state.pub_picker=false"></view>
	</view>
</template>
<!--创建时间：2024-03-30 17:00:49-->
<script setup lang="ts">
	import { onReachBottom } from "@dcloudio/uni-app"
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import { reactive, onMounted, getCurrentInstance } from "vue"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const props = defineProps({
		card_number: { type: String }
	})

	const state = reactive({
		appType: uni.getStorageSync("appType"),
		list: [],
		search_type: "选择按姓名",
		pub_picker: false,
		pub_value: [],
		column: [
			{
				name: "选择按姓名"
			},
			{
				name: "选择按证件号"
			},
			{
				name: "选择按手机号"
			},
			{
				name: "选择按申请编号"
			},
		],
		page: 1,
		pageSize: 10,
		total: 0,

		status_type: {
			a: {
				color: "#FF8177",
				name: "待提交"
			},
			b: {
				color: "#F97E39",
				name: "待审核"
			},
			c: {
				color: "#FF8177",
				name: "待签约"
			},
			d: {
				color: "#FF8177",
				name: "公证中"
			},
			e: {
				color: "#FF8177",
				name: "待放款"
			},
			g: {
				color: "#109181",
				name: "流程完结"
			},
			f: {
				color: "#FF8177",
				name: "转债中"
			},
			z: {
				color: "#FF3030",
				name: "合同作废"
			}
		},
		notarization_status: {
			a: {
				color: "#FF8177",
				name: "未提交"
			},
			b: {
				color: "#FF8177",
				name: "公证中"
			},
			c: {
				color: "#109181",
				name: "审核完成"
			},
			d: {
				color: "#109181",
				name: "已下证"
			},
			z: {
				color: "#FF3030",
				name: "公证异常"
			}
		},
	})

	const bindChange = (res : any) => {
		state.pub_value = res.detail.value
	}

	const confirm = () => {
		state.search_type = state.column[state.pub_value[0]].name;
		state.pub_picker = false
	}

	const navTo = (obj : any) => {
		let type = obj.type === "person" ? 1 : 2
		uni.navigateTo({
			url: "/mine_packages/order_detail/index?id=" + obj.id + "&type=" + type + "&goods_name=" + obj.goods_name
		})
	}
	
	const show_reason = (url:string)=>{
		uni.showToast({
			title: url,
			duration: 2000,
			icon: 'none'
		});
	}

	const copyHref = (url : string) => {
		console.log(url)
		uni.navigateTo({
			url: "/pages/web_view/index?url=" + encodeURIComponent(url)
		})
	}

	onMounted(() => {
		netWork()
	})

	const netWork = () => {
		uni.showLoading({
			title: "请稍后"
		})
		globalProxy.$request("/loan/Order/getOrderList", {
			currentPage: state.page,
			perPage: state.pageSize,
			user_type: uni.getStorageSync("userInfo").user_type.length > 1 ? 'b' : 'a',
			search_type: "card_number",
			search_data: props.card_number
		}).then((res : Result) => {
			state.total = res.data.count;
			if (state.page === 1) {
				state.list = res.data.list;
			} else {
				state.list = state.list.concat(res.data.list)
			}
			uni.hideLoading()
		})
	}
	onReachBottom(() => {
		if (state.page + 1 <= Math.ceil(state.total / state.pageSize)) {
			state.page++;
			netWork(2);
		}
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 4vw;

			>.empty {
				position: absolute;
				top: 50vw;
				left: 50%;
				transform: translateX(-50%);
				font-weight: bold;
				font-size: 3.2vw;
				color: #999999;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				>image {
					width: 36vw;
					height: 24vw;
					margin-bottom: 3.2vw;
				}
			}

			.list {
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding-bottom: 2.8vw;
				margin-bottom: 4vw;

				>.con {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 2.8vw;
					padding: 0 4vw;

					>.rightText {
						font-size: 3.2vw;
						color: #0055ff;
						text-decoration: underline;
					}

					>.left {
						display: flex;
						align-items: center;
						font-size: 3.2vw;
						color: #666666;

						>.label {
							width: 22vw;
							color: #333333;
						}
					}

					>.btn {
						font-weight: bold;
						font-size: 3.47vw;
						color: #1592E6;
					}

					>.right {
						width: 16vw;
						height: 5.33vw;
						border-radius: 1.33vw;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						font-size: 3.2vw;
						color: #FFFFFF;
					}
				}

				>.title {
					padding: 4vw 2.67vw;
					border-bottom: solid 1px #999999;
					display: flex;
					align-items: center;
					justify-content: space-between;

					>.left {
						display: flex;
						align-items: center;
						font-size: 3.2vw;
						color: #666666;

						>.type {
							padding: 0 2.67vw;
							border-radius: 0.8vw;
							font-weight: bold;
							font-size: 2.67vw;
							color: #F97E39;
							margin-left: 2.33vw;
						}

						>.info {
							width: 17vw;
							font-weight: bold;
							font-size: 4vw;
							color: #333333;
						}
					}

					>.right {
						display: flex;
						align-items: flex-end;
						font-size: 3.2vw;
						color: #FF8177;
					}
				}
			}

			>.search {
				display: flex;
				align-items: center;
				background: #FFFFFF;
				border-radius: 4.53vw;
				margin-bottom: 5.33vw;

				>.left {
					display: flex;
					align-items: center;
					border-right: solid 1px #999999;
					padding: 0 1.33vw 0 2.67vw;
					font-weight: 400;
					font-size: 3.2vw;
					color: #333333;
				}

				>.search_btn {
					width: 13.33vw;
					height: 8vw;
					background: #F97E39;
					border-radius: 4vw;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.47vw;
					color: #FFFFFF;
				}
			}
		}
	}

	.inputClass {
		font-weight: 400;
		font-size: 3.2vw;
		color: #999999;
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

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		width: 100%;
		height: 100%;
		z-index: 98;
	}

	.picker {
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
				color: #109181;
			}
		}

		.item {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>