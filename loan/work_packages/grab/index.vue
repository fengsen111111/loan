<template>
	<view class="container">
		<navbar title="可抢件"></navbar>
		<view class="content">
			<view class="search">
				<view class="left" @click="state.pub_picker=true">
					<text style="margin-right: 1.33vw;">{{state.search_name}}</text>
					<u-icon name="arrow-down" size="3vw" color="#666666"></u-icon>
				</view>
				<u-icon name="search" size="5vw" color="#666666"></u-icon>
				<input style="flex: 1;" type="text" placeholder="请输入关键字" placeholder-class="inputClass"
					v-model="state.search_word" />
				<view class="search_btn" @click="netWork(1)">搜索</view>
			</view>

			<view class="list" v-for="(item,index) in state.list" :key="index" @click="navTo(item)">
				<view class="title">
					<view class="left">
						<view class="info">{{item.name}}</view>
						{{item.type==='person'?$cardUtil(item.card_number):''}}
					</view>
					<view class="right" @click="rob(item.id,item.contract_num)">
						抢件
					</view>
				</view>
				<view class="con">
					<view class="left">
						<view class="label">产品名称</view>
						{{item.goods_name}}
					</view>
					<view class="right" style="background: #FF8177;">个人</view>
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
				</view>
			</view>

			<view class="empty" v-if="state.list.length===0">
				<image src="@/static/empty123.png" mode=""></image>
				暂无任何内容
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

		<view class="tips_pop" v-if="state.tips_pop">
			<view class="title">
				<view style="width: 5vw;"></view>
				{{state.tips_flag?'抢件成功':'抢件失败'}}
				<u-icon name="close" size="5vw" color="#666666" @click="state.tips_pop=false"></u-icon>
			</view>
			<u-icon :name="state.tips_flag?'checkmark-circle':'close-circle'" size="50vw"
				:color="state.tips_flag?'#109181':'#FF3030'"></u-icon>
			<view class="info">
				合同编号&emsp;&emsp;&emsp;{{state.contract_num}}
			</view>
			<view class="submit" @click="state.tips_pop=false">确定</view>
		</view>
		<view class="mask" v-if="state.tips_pop" @click="state.tips_pop=false"></view>
	</view>
</template>
<!--创建时间：2024-03-30 17:00:49-->
<script setup lang="ts">
	import { onReachBottom } from "@dcloudio/uni-app"
	import navbar from "@/components/navbar.vue"
	import { reactive, getCurrentInstance, onMounted } from "vue";
	import { Result } from "@/utils/interface"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		list: [],
		search_type: "name",
		search_name: "选择按姓名",
		search_word: "",
		pub_picker: false,
		pub_value: [],
		column: [
			{
				name: "选择按姓名",
				value: "name"
			},
			{
				name: "选择按证件号",
				value: "card_number"
			},
			{
				name: "选择按手机号",
				value: "mobile"
			},
			{
				name: "选择按合同编号",
				value: "contract_num"
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
				color: "#FF8177",
				name: "流程完结"
			},
			f: {
				color: "#FF8177",
				name: "转债中"
			},
			z: {
				color: "#FF8177",
				name: "合同作废"
			}
		},
		tips_pop: false,
		tips_flag: false,
		contract_num: ""
	})

	onMounted(() => {
		netWork(1);
	})

	const rob = (id : number, contract_num : string) => {
		state.contract_num = contract_num;
		globalProxy.$request("/loan/Order/hasOrder", {
			order_id: id
		}).then((res : Result) => {
			if (res.data.business_code === 1) {
				state.tips_flag = true;
			}
			state.tips_pop = true;
			netWork(1)
		})
	}

	const navTo = (obj : any) => {
		let type = obj.type === "person" ? 1 : 2
		uni.navigateTo({
			url: "/mine_packages/order_detail/index?id=" + obj.id + "&type=" + type + "&goods_name=" + obj.goods_name
		})
	}

	const netWork = (type : number) => {
		if (type === 1) {
			state.page = 1
		}
		uni.showLoading({
			title: "请稍后"
		})
		globalProxy.$request("/loan/Order/getOrderList", {
			currentPage: state.page,
			perPage: state.pageSize,
			user_type: uni.getStorageSync("userInfo").user_type.length > 1 ? 'b' : 'a',
			status: "b",
			search_type: state.search_type,
			search_data: state.search_word
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

	const bindChange = (res : any) => {
		state.pub_value = res.detail.value
	}

	const confirm = () => {
		state.search_type = state.column[state.pub_value[0]].value;
		state.search_name = state.column[state.pub_value[0]].name;
		state.pub_picker = false
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

		.tips_pop {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
			background: #FFFFFF;
			border-radius: 1.33vw;
			padding: 2.67vw;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			>.title {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
				margin-bottom: 9vw;
			}

			>.info {
				font-size: 3.2vw;
				color: #333333;
				margin: 5.6vw 0 6.4vw;
			}

			>.submit {
				width: 84vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

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

						>.info {
							min-width: 20vw;
							font-weight: bold;
							font-size: 4vw;
							color: #333333;
						}
					}

					>.right {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 13.33vw;
						height: 5.33vw;
						background: #F97E39;
						border-radius: 4vw;
						font-weight: bold;
						font-size: 3.47vw;
						color: #FFFFFF;
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