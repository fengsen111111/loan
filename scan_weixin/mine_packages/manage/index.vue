<template>
	<view class="container">
		<view class="head">
			<view style="width:100%;height: 1.33vw;background: #f5f5f5;"></view>
			<view class="screen flex alignCenter spaceBetween">
				<view class="item" :class="formData.help_user_order === 'N'?'active':''" @click="changeList('N')">
					客户订单
				</view>
				<view class="item" :class="formData.help_user_order === 'Y'?'active':''" @click="changeList('Y')">
					代客订单
				</view>
			</view>
			<view class="title flex alignCenter spaceBetween">
				<view class="inputBox flex alignCenter">
					<u-icon name="search" size="20"></u-icon>
					<input type="text" confirm-type="search" placeholder="输入餐位号" placeholder-class="input_placeholder"
						v-model="formData.code" @confirm="netWork()" />
				</view>
				<view class="screen flex alignCenter" @click="showScreen=true">
					<text>{{formData.status===''?'全部':formData.status==='a'?'空闲':'有客'}}</text>
					<u-icon :name="showScreen?'arrow-up':'arrow-down'"></u-icon>
				</view>

				<view class="popup" v-if="showScreen">
					<view class="item" :class="formData.status===''?'active':''" @click="changeType('')">全部</view>
					<view class="item" :class="formData.status==='a'?'active':''" @click="changeType('a')">空闲</view>
					<view class="item" :class="formData.status==='b'?'active':''" @click="changeType('b')">有客</view>
				</view>
				<view class="mask" @click="showScreen=false" v-if="showScreen"></view>
			</view>
		</view>
		<view class="list" v-for="(item,index) in list" :key="index">
			<view class="item flex alignCenter spaceBetween" v-if="item.work_status==='a'">
				{{item.code}}
				<text>空闲</text>
			</view>
			<view class="busy" v-else>
				<view class="title flex alignCenter spaceBetween">
					{{item.code}}
					<view class="right">
						有客({{item.person_number}}人)
						<text
							@click="$nav('/mine_packages/restaurant/index',{id:item.order_id,time:item.open_time,refundFlag:item.refund_all_status})">
							详情
						</text>
					</view>
				</view>
				<view class="info flex alignCenter spaceBetween">
					开台时间 {{$dateFormat(item.open_time*1000,'date')}}
					<text>商品&nbsp;&nbsp;x{{item.goods_number}}</text>
				</view>
				<view class="option flex alignCenter spaceBetween">
					<view class="left">
						下单金额
						<text>{{item.price}}</text>
					</view>
					<view class="right flex alignCenter">
						<view class="patchwork" @click="print(item)">补打</view>
						<view class="end" @click="end(item)">转台</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="show" mode="center" @close="show = false;seatObj = {}" closeOnClickOverlay round="3vw">
			<view class="seatContent">
				<view class="title flex alignCenter spaceBetween">
					请选择座位
					<u-icon name="close" color="#000000" size="25" @click="show = false;seatObj = {}"></u-icon>
				</view>
				<scroll-view scroll-y="true" style="max-height: 30vh;">
					<view class="list">
						<view class="item" :class="item.id === seatObj.id?'active':''" v-for="(item,index) in seatList"
							:key="index" @click="selectSeat(item)">{{item.code}}</view>
					</view>
				</scroll-view>
				<view class="confirm" @click="confirm()">确认</view>
			</view>
		</u-popup>

		<view class="orderBox" @click="orderShow=true">下单</view>

		<u-popup :show="orderShow" mode="center" @close="orderShow = false" closeOnClickOverlay round="3vw">
			<view class="seatContent">
				<view class="title flex alignCenter spaceBetween">
					代客下单
					<u-icon name="close" color="#000000" size="25" @click="orderShow = false"></u-icon>
				</view>
				<view class="orderContent">
					<u-radio-group v-model="help_user_order" activeColor="rgb(245, 232, 174)" labelColor="#000000">
						<u-radio label="代金券" name="help_user_coupon"></u-radio>
						<u-radio label="团购平台" name="help_user_platform"></u-radio>
					</u-radio-group>

					<view class="order_list" v-show="help_user_order === 'help_user_coupon'">
						<view class="item" :class="typeValue === item?'active':''" v-for="(item,index) in coupons"
							:key="index" @click="selOrder(item)">
							{{item}}
						</view>
					</view>

					<view class="order_list" v-show="help_user_order === 'help_user_platform'">
						<view class="item" :class="typeValue === item?'active':''" v-for="(item,index) in platforms"
							:key="index" @click="selOrder(item)">
							{{item}}
						</view>
					</view>
				</view>
				<view class="confirm" @click="orderConfirm()">确认</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				showScreen: false,
				total: null,
				store_id: "",
				formData: {
					help_user_order: "N",
					handle_type: 'a',
					status: "",
					code: "",
					currentPage: 1,
					perPage: 10
				},
				list: [],
				show: false,
				orderObj: {},
				seatObj: {},
				seatList: [],

				orderShow: false,
				help_user_order: "help_user_coupon",
				coupons: [],
				platforms: [],
				typeValue: ""
			};
		},
		onLoad(option) {
			this.store_id = option.store_id;
			this.$request("/food/Seat/geSeatListNew", {
				store_id: option.store_id
			}).then(res => {
				this.seatList = res.list
			})

			this.$request("/food/Setting/getSetting").then(res => {
				this.coupons = res.coupons;
				this.platforms = res.platforms;
			})
		},
		onShow() {
			this.formData.currentPage = 1;
			this.netWork();
		},
		methods: {
			netWork() {
				this.$request("/food/Seat/geSeatList", this.formData).then(res => {
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
					}
				})
			},
			changeList(val) {
				this.formData.currentPage = 1;
				this.showScreen = false;
				this.formData.help_user_order = val;
				this.netWork();
			},
			changeType(type) {
				this.formData.status = type;
				this.formData.currentPage = 1;
				this.showScreen = false;
				this.netWork();
			},
			print(obj) {
				uni.showLoading({
					mask: true,
					title: "准备打印中"
				})
				this.$request("/food/Order/printOrderAgain", {
					handle_type: 'a',
					order_id: obj.order_id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: "打印成功",
						icon: "success"
					})
				}).catch(() => {
					uni.hideLoading()
				})
			},
			end(obj) {
				this.show = true;
				this.orderObj = obj;
			},
			selectSeat(obj) {
				this.seatObj = obj;
			},
			confirm() {
				this.show = false;
				uni.showLoading({
					title: "请稍后"
				})
				this.$request("/food/Order/changeSeat", {
					seat_id: this.seatObj.id,
					order_id: this.orderObj.order_id
				}).then(res => {
					this.formData.currentPage = 1;
					uni.hideLoading()
					this.netWork();
				}).catch(() => {
					uni.hideLoading()
				})
				this.seatObj = {}
			},
			selOrder(item) {
				this.typeValue = item;
			},
			orderConfirm() {
				if (this.help_user_order === 'help_user_coupon' && !this.coupons.includes(this.typeValue)) {
					uni.showToast({
						icon: "none",
						title: "请选择代金券金额",
					})
					return;
				}
				if (this.help_user_order === 'help_user_platform' && !this.platforms.includes(this.typeValue)) {
					uni.showToast({
						icon: "none",
						title: "请选择团购平台",
					})
					return;
				}
				uni.setStorageSync("workerOrder", {
					help_user_order: "Y",
					[this.help_user_order]: this.typeValue
				})
				this.$nav("/home_packages/shop_detail/index", {
					id: this.store_id,
					type: "workerOrder"
				})
				this.orderShow = false
			}
		},
		onReachBottom() {
			if (this.formData.currentPage < Math.ceil(this.total / this.formData.perPage)) {
				this.formData.currentPage++;
				this.netWork();
			}
		}
	}
</script>

<style lang="scss">
	.u-radio {
		margin-right: 16px;
	}

	.seatContent {
		width: 80vw;
		max-height: 50vh;
		padding: 5.33vw 4vw 0;
		overflow: hidden;

		.order_list {

			>.item {
				border: solid 1px #000000;
				padding: 2px 3vw;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 3vw;
				color: #000000;
				font-weight: bold;
				font-size: 4vw;
				margin-top: 5vw;
			}

			>.active {
				background-color: #000000;
				color: rgb(245, 232, 174);
			}
		}

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			margin: 10vw auto 0;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
		}

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		.list {
			display: grid;
			grid-template-columns: repeat(4, auto);
			grid-column-gap: 10px;
			grid-row-gap: 10px;

			>.item {
				border: solid 1px #000000;
				padding: 2px 3vw;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 3vw;
				color: #000000;
				font-weight: bold;
				font-size: 4vw;
			}

			>.active {
				background-color: #000000;
				color: rgb(245, 232, 174);
			}
		}
	}

	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.orderBox {
			width: 15vw;
			height: 15vw;
			position: fixed;
			right: 5vw;
			bottom: 20vw;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #000000;
			color: rgb(245, 232, 174);
			font-size: 4vw;
			font-weight: bold;
		}

		>.list {
			margin-top: 2.67vw;
			background: #FFFFFF;

			>.busy {
				padding: 2.67vw 4vw 4vw;

				>.option {
					>.right {
						>.end {
							width: 21.33vw;
							height: 8vw;
							line-height: 8vw;
							text-align: center;
							background: #000000;
							border-radius: 6vw;
							font-weight: bold;
							font-size: 4vw;
							color: rgb(245, 232, 174);
							margin-left: 2.93vw;
						}

						>.patchwork {
							width: 21.33vw;
							height: 8vw;
							line-height: 8vw;
							text-align: center;
							border-radius: 6vw;
							border: 0.27vw solid #000000;
							font-weight: bold;
							font-size: 4vw;
							color: #000000;
						}
					}

					>.left {
						font-weight: 400;
						font-size: 4vw;
						color: #000000;

						>text {
							font-weight: bold;
							color: #ED1805;
							margin-left: 2.67vw;
						}
					}
				}

				>.info {
					font-weight: 500;
					font-size: 3.2vw;
					color: #000000;
					margin-bottom: 5.33vw;
				}

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					padding-bottom: 1.33vw;
					border-bottom: solid 1px #999999;
					margin-bottom: 2.67vw;

					>.right {
						font-size: 3.2vw;

						>text {
							font-weight: 500;
							font-size: 2.67vw;
							color: #EFA246;
							margin-left: 3.07vw;
						}
					}
				}
			}

			>.item {
				font-weight: bold;
				font-size: 4vw;
				color: #000000;
				height: 10.93vw;
				padding: 0 4vw;

				>text {
					font-size: 3.2vw;
					color: #80CF40;
				}
			}
		}

		>.head {
			position: sticky;
			top: 0;

			>.screen {
				background: #FFFFFF;
				padding: 1.67vw 4vw;
				border-bottom: solid 1.33vw #F5F5F5;

				>.item {
					width: 40vw;
					height: 10vw;
					text-align: center;
					line-height: 10vw;
					border-radius: 5vw;
				}

				>.active {
					background: rgba(0, 0, 0, 1);
					color: rgb(245, 232, 174);
					;
				}
			}

			>.title {
				background: #FFFFFF;
				padding: 1.67vw 4vw;
				position: relative;

				>.popup {
					width: 100%;
					position: absolute;
					left: 0;
					top: 100%;
					background: #F5F5F5;
					z-index: 2;
					padding-bottom: 2.67vw;

					>.active {
						font-weight: bold !important;
						color: #FA4741 !important;
					}

					>.item {
						padding: 0 8vw;
						margin-top: 4vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #000000;
					}
				}

				>.mask {
					width: 100%;
					height: 100vh;
					position: absolute;
					left: 0;
					top: 100%;
					z-index: 1;
					background: rgba(0, 0, 0, .5);
				}

				>.screen {
					font-weight: 500;
					font-size: 3.2vw;
					color: #000000;

					>text {
						margin-right: 2.67vw;
					}
				}

				>.inputBox {
					width: 70.66vw;
					height: 8vw;
					background: #F5F5F5;
					border-radius: 4.67vw;
					padding: 0 2.67vw;

					>input {
						flex: auto;
					}
				}
			}
		}
	}
</style>