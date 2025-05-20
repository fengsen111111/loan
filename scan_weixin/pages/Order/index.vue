<template>
	<view class="container">
		<view style="background: #F5F5F5;height: 1.33vw;"></view>
		<!-- <view class="top">
			<view class="head">
				<view class="big_screen flex alignCenter spaceEvenly">
					<view class="item" :class="formData.time_status==='a'?'active':''" @click="changeScreen('a')">当前订单
					</view>
					<view class="item" :class="formData.time_status==='b'?'active':''" @click="changeScreen('b')">历史订单
					</view>
				</view>
				<view class="small_screen flex alignCenter spaceEvenly" v-if="formData.time_status==='a'">
					<view class="item" :class="formData.pay_status==='a'?'active':''" @click="changeSmall('a')">已支付
					</view>
					<view class="item" :class="formData.pay_status==='b'?'active':''" @click="changeSmall('b')">未支付
					</view>
					<view class="item" :class="formData.pay_status==='c'?'active':''" @click="changeSmall('c')">部分支付
					</view>
				</view>
			</view>
		</view> -->
		<view class="item" v-for="(item,index) in orderList" :key="index">
			<view class="order_num flex alignCenter spaceBetween">
				订单编号:{{item.id}}
				<text
					@click="$nav('/order_packages/detail/index',{id:item.id,time_status:formData.time_status,pay_status:formData.pay_status})">详情</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				下单时间
				<text>{{item.create_time}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				人数
				<text>{{item.person_number}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				餐位
				<text>{{item.table_code}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				优惠金额
				<text>{{item.discount_price}}元</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				抵扣积分
				<text>{{item.integral_money}}</text>
			</view>
			<view class="label flex spaceBetween" style="margin-bottom: 0;">
				备注
				<text style="width: 70vw;justify-content: flex-end;display: flex;"
					:style="{color:item.remark?'#999999':''}">
					{{item.remark||'无'}}
				</text>
			</view>

			<view class="line"></view>

			<view class="list flex alignCenter spaceBetween" v-for="(food,j) in item.goods_list" :key="food.id">
				<view class="left flex alignCenter">
					<image :src="food.image" mode=""></image>
					{{food.goods_name}}
					<text style="font-size: 3vw;color: #999999;font-weight: normal;"
						v-if="food.choice_des">（{{food.choice_des}}）</text>
				</view>
				x{{food.number}}
			</view>
			<view class="line" style="margin-top: 0;"></view>

			<view class="price flex alignCenter spaceBetween">
				<view>
					<text style="margin-right: 5vw;"
						v-if="formData.time_status==='a'&&formData.pay_status==='c'">未付：{{item.un_pay_price}}</text>
					<text style="color:#80CF40"
						v-if="formData.time_status==='a'&&formData.pay_status==='c'">已付：{{item.price}}</text>
					<text v-else>总计：{{item.total_price}}</text>
				</view>
				<!-- <text :style="{color:formData.time_status==='a'&&formData.pay_status==='a'?'#80CF40':''}">
					{{formData.time_status==='a'&&formData.pay_status==='a'?'已支付':formData.time_status==='a'&&formData.pay_status==='b'?'未支付':formData.time_status==='a'&&formData.pay_status==='c'?'部分支付':'支付时间 '+item.pay_time}}
				</text> -->
				<text :style="{color:'#80CF40'}">
					已支付
				</text>
			</view>

			<view class="pay flex alignCenter" v-if="formData.time_status==='a'">
				<!-- <view class="item" @click="addMenu(item)">加菜</view> -->
				<view class="item goIt" v-if="formData.pay_status==='b'||formData.pay_status==='c'"
					@click="goPay(item.id)">去支付
				</view>
			</view>
		</view>
		<u-empty text="订单列表为空" :icon="require('@/static/empty.jpg')" v-if="orderList.length === 0"></u-empty>
		<u-popup :show="payShow" mode="bottom" @close="payShow=false" round="5.33vw">
			<view class="payContent">
				<view class="title flex alignCenter spaceBetween">
					支付方式
					<u-icon name="close" size="25" color="#000000" @click="payShow=false"></u-icon>
				</view>

				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(1)">
					<view class="item flex alignCenter">
						<image src="@/static/money.png" mode=""></image>
						<text>余额</text>
						{{userMoney}}
					</view>
					<u-icon name="checkmark-circle-fill" color="#EFA246" size="20" v-if="payType===1"></u-icon>
				</view>
				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(2)">
					<view class="item flex alignCenter">
						<u-icon name="weixin-fill" color="#68BF7B" size="5.33vw"></u-icon>
						<text>微信</text>
					</view>
					<u-icon name="checkmark-circle-fill" color="#EFA246" size="20" v-if="payType===2"></u-icon>
				</view>
				<view class="confirm" @click="confirm()">支付</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 1,
				small_current: 1,
				formData: {
					currentPage: 1,
					perPage: 10
				},
				total: 0,
				orderList: [],
				payShow: false,
				payType: 1,

				userMoney: 0,
				payFlag: true,
				orderId: ""
			};
		},
		onShow() {
			this.netWork();
			this.$request("/food/User/getUserInfo").then(res => {
				this.userMoney = res.money;
			})
		},
		methods: {
			netWork() {
				uni.showLoading({
					title: "请稍后",
					mask: true
				})
				this.$request("/food/Order/userGetOrderList", this.formData).then(res => {
					uni.hideLoading();
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.orderList = res.list
					} else {
						this.orderList = this.orderList.concat(res.list);
					}
				}).catch(() => {
					uni.hideLoading();
				})
			},
			changeScreen(type) {
				this.orderList = [];
				if (type === 'a' && this.formData.pay_status !== 'a') {
					this.formData.pay_status = 'a';
				}
				this.formData.time_status = type;
				this.netWork();
			},
			changeSmall(type) {
				this.orderList = [];
				this.formData.pay_status = type;
				this.netWork();
			},
			changePayType(type) {
				this.payType = type;
			},
			addMenu(obj) {
				this.$nav("/home_packages/shop_detail/index", {
					id: obj.store_id,
					type: "add",
					orderId: obj.id,
					useCoupon: obj.coupon_id ? true : false
				})
			},
			goPay(id) {
				this.orderId = id;
				this.payShow = true;
			},
			confirm() {
				if (!this.payFlag) return;
				this.payFlag = false;
				let pay_type = "";
				if (this.payType === 1) {
					pay_type = 'c'
				} else if (this.payType === 2) {
					pay_type = 'a'
				}
				this.$request("/food/Order/payOrder", {
					order_id: this.orderId,
					coupon_id: "",
					pay_type
				}).then(res => {
					if (res.result === 1) {
						uni.showToast({
							title: "支付成功",
							icon: "success",
							duration: 2000
						})
						this.payShow = false;
						this.formData.currentPage = 1;
						this.netWork();
						this.payFlag = true;
					} else if (res.result === 3) {
						uni.requestPayment({
							provider: "wxpay",
							...res.pay_data,
							success: res => {
								this.payShow = false;
								this.formData.currentPage = 1;
								this.netWork();
							},
							fail: () => {
								uni.showToast({
									title: "用户取消支付",
									icon: "error"
								})
								this.payFlag = true;
							}
						})
					} else {
						this.payFlag = true;
					}
				}).catch(() => {
					this.payFlag = true;
				})
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
	.payContent {
		padding: 4.93vw 4vw;

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #EFA246;
			border-radius: 6vw;
			margin: 10vw auto 0;
			font-weight: bold;
			font-size: 4vw;
			color: #FFFFFF;
		}

		>.chooseItem {
			margin-top: 8.27vw;
			padding: 0 6.67vw;

			>.item {
				font-weight: 400;
				font-size: 3.2vw;
				color: #666666;

				>image {
					max-width: 5.33vw;
					max-height: 5.33vw;
				}

				>text {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin: 0 2.67vw;
				}
			}
		}

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
		}
	}

	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.item {
			width: 86.66vw;
			background: #FFFFFF;
			box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
			border-radius: 2.67vw;
			margin: 0 auto 2.67vw;
			padding: 4vw 2.67vw;

			>.pay {
				margin-top: 3.47vw;

				>.item {
					flex: 1;
					height: 8vw;
					border-radius: 6vw;
					border: 0.27vw solid #EFA246;
					text-align: center;
					line-height: 8vw;
					font-weight: bold;
					font-size: 4vw;
					color: #EFA246;
				}

				>.goIt {
					border: none;
					background: #EFA246;
					color: #FFFFFF;
					margin-left: 4vw;
				}
			}

			>.price {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;

				>text {
					font-weight: bold;
					font-size: 3.2vw;
					color: #666666;
				}
			}

			>.line {
				height: 1px;
				background: #999999;
				margin: 4vw 0;
			}

			>.list {
				font-weight: bold;
				font-size: 4.27vw;
				color: #000000;
				margin-bottom: 5.33vw;

				&:last-child {
					margin-bottom: 0;
				}

				>.left {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;

					>image {
						width: 12vw;
						height: 12vw;
						border-radius: 1.33vw;
						margin-right: 4vw;
					}
				}
			}

			>.label {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;

				>text {
					word-break: break-all;
				}
			}

			>.order_num {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #999999;
				margin-bottom: 5.33vw;

				>text {
					font-weight: 500;
					font-size: 2.67vw;
					color: #EFA246;
				}
			}
		}

		>.top {
			position: sticky;
			top: 0;
			margin-bottom: 1.6vw;
			box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);

			>.head {
				background: #FFFFFF;
				padding: 2.67vw 4vw;

				>.small_screen {
					margin-top: 4.8vw;

					>.item {
						font-weight: 500;
						font-size: 3.2vw;
						color: #333333;
						// margin-right: 8vw;
					}

					>.active {
						font-weight: bold;
						color: #000000;
					}
				}

				>.big_screen {
					>.item {
						font-weight: 500;
						font-size: 4vw;
						color: #333333;
						transition: all .2s;
					}

					>.active {
						font-weight: 700;
						font-size: 4vw;
						color: #000000;
					}
				}
			}
		}
	}
</style>