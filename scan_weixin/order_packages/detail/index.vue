<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="content">
			<view class="order_num">订单编号:{{orderInfo.id}}</view>
			<view class="label flex alignCenter spaceBetween">
				下单时间
				<text>{{orderInfo.create_time}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				人数
				<text>{{orderInfo.person_number}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				餐位
				<text>{{orderInfo.table_code}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				总价
				<text>￥{{orderInfo.total_price}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				优惠
				<text>￥{{orderInfo.discount_price}}</text>
			</view>
			<view class="label flex spaceBetween" style="margin-bottom: 0;">
				备注
				<text style="width: 70vw;word-break: break-all;color: #999999;display: flex;justify-content: flex-end;">
					{{orderInfo.remark}}
				</text>
			</view>
			<view class="line"></view>

			<view class="item" v-for="(item,index) in orderInfo.goods_list" :key="item.id">
				<view class="title">
					{{item.goods_name}}
					<text style="font-size: 3vw;color: #999999;font-weight: normal;"
						v-if="item.choice_des">（{{item.choice_des}}）</text>
				</view>
				<view class="info flex spaceBetween">
					<image :src="item.image" mode=""></image>
					<view class="concat">
						{{item.introduce}}
					</view>
				</view>
				<view class="price flex alignCenter spaceBetween">
					<text>单价 ￥{{item.price}}</text>
					x{{item.number}}
				</view>
			</view>
		</view>
		<!-- <view style="height: 12.8vw;" v-if="time_status==='a'"></view>
		<view class="bottom flex alignCenter spaceBetween" v-if="time_status==='a'">
			<view class="left flex alignCenter">
				实付￥{{orderInfo.price}}
				<view class="price flex alignCenter flexColumn">
					总价 ￥{{orderInfo.total_price}}
					<text>优惠 ￥{{orderInfo.discount_price}}</text>
				</view>
			</view>
			<view class="right flex alignCenter">
				<view class="add" @click="addMenu()">加菜</view>
				<view class="pay" @click="goPay()" v-if="pay_status!=='a'">去支付</view>
			</view>
		</view> -->

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
				payShow: false,
				payType: 1,
				orderInfo: {},
				userMoney: 0,
				payFlag: true,

				time_status: 'a',
				pay_status: 'a'
			};
		},
		onLoad(options) {
			this.time_status = options.time_status;
			this.pay_status = options.pay_status
			this.$request("/food/Order/userGetOrderDetail", {
				order_id: options.id
			}).then(res => {
				this.orderInfo = res
			})
		},
		methods: {
			changePayType(type) {
				this.payType = type;
			},
			addMenu() {
				this.$nav("/home_packages/shop_detail/index", {
					id: this.orderInfo.store_id,
					type: "add",
					orderId: this.orderInfo.id
				})
			},
			goPay() {
				this.$request("/food/User/getUserInfo").then(res => {
					this.userMoney = res.money;
				})
				this.payShow = true
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
					order_id: this.orderInfo.id,
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
						this.$request("/food/Order/userGetOrderDetail", {
							order_id: this.orderInfo.id
						}).then(res => {
							this.orderInfo = res
						})
						this.payFlag = true;
					} else if (res.result === 3) {
						uni.requestPayment({
							provider: "wxpay",
							...res.pay_data,
							success: res => {
								this.payShow = false;
								this.$request("/food/Order/userGetOrderDetail", {
									order_id: this.orderInfo.id
								}).then(res => {
									this.orderInfo = res
								})
								this.payFlag = true;
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
		background: #F5F5F5;

		>.bottom {
			width: calc(100% - 2px - 8vw);
			position: fixed;
			bottom: 0;
			padding: 2.13vw 4vw 0;
			padding-bottom: constant(safe-area-inset-bottom);
			/*兼容 IOS&gt;11.2*/
			padding-bottom: env(safe-area-inset-bottom);
			/*兼容 IOS&gt;11.2*/
			background: #FFFFFF;
			box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
			border-radius: 1.33vw 1.33vw 0 0;
			border: 1px solid #666666;

			>.right {
				align-items: flex-end;

				>.pay {
					width: 21.33vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					background: #EFA246;
					border-radius: 6vw;
					font-weight: bold;
					font-size: 4vw;
					color: #FFFFFF;
					margin-left: 2.93vw;
				}

				>.add {
					width: 21.33vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					border-radius: 6vw;
					border: 1px solid #EFA246;
					font-weight: bold;
					font-size: 4vw;
					color: #EFA246;
				}
			}

			>.left {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;

				>.price {
					font-weight: 500;
					font-size: 2.67vw;
					color: #000000;
					margin-left: 4.4vw;
				}
			}
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;

			>.item {
				margin-bottom: 5.07vw;

				>.price {
					font-weight: bold;
					font-size: 4.27vw;
					color: #000000;

					>text {
						font-size: 4.8vw;
						color: #ED1805;
					}
				}

				>.info {
					margin-bottom: 4.67vw;

					>.concat {
						width: 66.67vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #999999;
					}

					>image {
						width: 21.33vw;
						height: 21.33vw;
						border-radius: 2.67vw;
						margin-right: 4vw;
					}
				}

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-bottom: 2.67vw;
				}
			}

			>.line {
				height: 1px;
				background: #999999;
				margin-top: 4vw;
				margin-bottom: 2.67vw;
			}

			>.label {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;
			}

			>.order_num {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #999999;
				margin-bottom: 5.33vw;
			}
		}
	}
</style>