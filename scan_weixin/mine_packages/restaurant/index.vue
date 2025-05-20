<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="content">
			<view class="order_num flex alignCenter spaceBetween">
				{{orderInfo.table_code}}
				<text>有客({{orderInfo.person_number}}人)</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				开台时间
				<text>{{$dateFormat(openTime*1000,'date')}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				总价
				<text>￥{{orderInfo.total_price}}</text>
			</view>
			<view class="label flex alignCentecr spaceBetween">
				优惠
				<text>￥{{orderInfo.discount_price}}</text>
			</view>
			<view class="label flex spaceBetween" style="margin-bottom: 0;">
				备注
				<text style="width: 70vw;word-break: break-all;color: #999999;display: flex;justify-content: flex-end;">
					{{orderInfo.remark||'无'}}
				</text>
			</view>
		</view>
		<view class="list" v-if="orderInfo.goods_list.length">
			<view class="label flex alignCenter spaceBetween">
				商品信息
				<text v-if="refundAll&&refund&&refundOne" @click="allRefund()">全部退款</text>
			</view>
			<view class="item" v-for="(item) in orderInfo.goods_list" :key="item.detail_id">
				<view class="title flex alignCenter spaceBetween">
					<view>
						{{item.goods_name}}
						<text style="font-size: 3vw;color: #999999;font-weight: normal;"
							v-if="item.choice_des">（{{item.choice_des}}）</text>
					</view>
					<text @click="refuse(item)"
						v-if="item.remaining_number>0&&item.status==='Y'&&refund&&Number(item.refund_number)<Number(item.number)">退款</text>
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
		<view style="height: 12.8vw;"></view>
		<view class="bottom flex alignCenter spaceBetween">
			<view class="add" @click="print()">补打</view>
			<view class="pay" @click="end()">转台</view>
		</view>

		<u-popup :show="payShow" mode="bottom" @close="payShow=false" round="5.33vw">
			<view class="payContent">
				<view class="title flex alignCenter spaceBetween">
					退款
					<u-icon name="close" size="25" color="#000000" @click="payShow=false"></u-icon>
				</view>
				<view class="content flex alignCentecr spaceBetween">
					<image :src="goodInfo.image" mode=""></image>
					<view class="right">
						<view class="top flex alignCentecr spaceBetween">
							<text>{{goodInfo.goods_name}}</text>
							x{{goodInfo.number}}
						</view>
						单价 ￥{{goodInfo.price}}
					</view>
				</view>
				<view class="price flex alignCentecr spaceBetween">
					总计 ￥{{price}}
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changeNum('min')">
							<u-icon name="minus" color="rgb(245, 232, 174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">{{goodsNum}}</view>
						<view class="min flex alignCenter justifyCenter" @click="changeNum('add')">
							<u-icon name="plus" color="rgb(245, 232, 174)"></u-icon>
						</view>
					</view>
				</view>
				<view class="confirm" @click="confirm()">确认退款</view>
			</view>
		</u-popup>
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
				<view class="confirm" @click="seatConfirm()">确认</view>
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
				orderInfo: {
					goods_list: []
				},
				openTime: "",
				goodInfo: {},
				goodsNum: 1,
				price: 0,
				refundAll: true,
				refund: true,
				refundOne: true,
				show: false,
				seatObj: {},
				seatList: []
			};
		},
		onLoad(options) {
			this.$request("/food/Order/userGetOrderDetail", {
				order_id: options.id
			}).then(res => {
				this.orderInfo = res;
				this.openTime = options.time;
				this.refundAll = options.refundFlag === 'Y'
				this.refund = res.refund_all === 'N'
				res.goods_list.map(item => {
					if (Number(item.refund_number) >= Number(item.number)) {
						this.refundOne = false
					}
				})
				this.$request("/food/Seat/geSeatListNew", {
					store_id: this.orderInfo.store_id
				}).then(result => {
					this.seatList = result.list
				})
			})
		},
		methods: {
			refuse(obj) {
				this.goodInfo = obj;
				this.$request("/food/Order/computerGoods", {
					goods_list: [{
						goods_type: "b",
						goods_id: this.goodInfo.goods_id,
						number: 1
					}]
				}).then(res => {
					this.price = res.price;
				})
				this.payShow = true;
			},
			allRefund() {
				uni.showModal({
					title: "温馨提示",
					content: "确认全部退款？",
					success: result => {
						if (result.confirm) {
							uni.showLoading({
								title: "请稍后"
							})
							let formData = {
								handle_type: 'a',
								type: 'a',
								order_id: this.orderInfo.id
							}
							this.$request("/food/Order/refundOrder", formData).then(res => {
								uni.hideLoading();
								uni.showToast({
									title: "退款成功",
									icon: "success"
								})
								this.$request("/food/Order/userGetOrderDetail", {
									order_id: this.orderInfo.id
								}).then(res => {
									this.orderInfo = res;
									res.goods_list.map(item => {
										if (Number(item.refund_number) >= Number(item
												.number)) {
											this.refundOne = false
										}
									})
								})
							}).catch(err => {
								uni.hideLoading();
							})
						}
					}
				})

			},
			confirm() {
				uni.showLoading({
					title: "请稍后"
				})
				let formData = {
					handle_type: 'a',
					type: 'b',
					detail_id: this.goodInfo.detail_id,
					number: this.goodsNum
				}
				this.$request("/food/Order/refundOrder", formData).then(res => {
					uni.hideLoading();
					this.payShow = false;
					uni.showToast({
						title: "退款成功",
						icon: "success"
					})
					this.$request("/food/Order/userGetOrderDetail", {
						order_id: this.orderInfo.id
					}).then(res => {
						this.orderInfo = res;
						res.goods_list.map(item => {
							if (Number(item.refund_number) >= Number(item.number)) {
								this.refundOne = false
							}
						})
					})
				}).catch(err => {
					uni.hideLoading();
					this.payShow = false;
					this.$request("/food/Order/userGetOrderDetail", {
						order_id: this.orderInfo.id
					}).then(res => {
						this.orderInfo = res;
						res.goods_list.map(item => {
							if (Number(item.refund_number) >= Number(item.number)) {
								this.refundOne = false
							}
						})
					})
				})
			},
			changePayType(type) {
				this.payType = type;
			},
			changeNum(type) {
				if (type === "add") {
					if (this.goodsNum === Number(this.goodInfo.remaining_number)) return;
					this.goodsNum++;
					this.$request("/food/Order/computerGoods", {
						goods_list: [{
							goods_type: "b",
							goods_id: this.goodInfo.goods_id,
							number: this.goodsNum
						}]
					}).then(res => {
						this.price = res.price;
					})
				} else {
					if (this.goodsNum === 1) return;
					this.goodsNum--;
					this.$request("/food/Order/computerGoods", {
						goods_list: [{
							goods_type: "b",
							goods_id: this.goodInfo.goods_id,
							number: this.goodsNum
						}]
					}).then(res => {
						this.price = res.price;
					})
				}
			},
			print() {
				this.$request("/food/Order/printOrderAgain", {
					handle_type: 'a',
					order_id: this.orderInfo.id
				}).then(res => {
					uni.showToast({
						title: "打印成功",
						icon: "success"
					})
				})
			},
			end() {
				this.show = true;
			},
			selectSeat(obj) {
				this.seatObj = obj;
			},
			seatConfirm() {
				this.show = false;
				uni.showLoading({
					title: "请稍后"
				})
				this.$request("/food/Order/changeSeat", {
					seat_id: this.seatObj.id,
					order_id: this.orderInfo.id
				}).then(res => {
					uni.hideLoading()
					this.$request("/food/Order/userGetOrderDetail", {
						order_id: this.orderInfo.id
					}).then(res => {
						this.orderInfo = res;
					})
				}).catch(() => {
					uni.hideLoading()
				})
				this.seatObj = {}
			}
		}
	}
</script>

<style lang="scss">
	.seatContent {
		width: 80vw;
		max-height: 50vh;
		padding: 5.33vw 4vw 0;
		overflow: hidden;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
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

	.payContent {
		padding: 4.93vw 4vw;

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

		>.price {
			font-weight: bold;
			font-size: 4.8vw;
			color: #ED1805;

			>.number {
				width: 34.67vw;
				height: 8vw;
				border-radius: 4vw;
				overflow: hidden;

				>.min {
					width: 10.67vw;
					height: 100%;
					background: #000000;
				}

				>.num {
					width: 13.33vw;
					height: 100%;
					background: #F5F5F5;
					font-weight: bold;
					font-size: 4.27vw;
					color: #000000;
				}

				>.add {
					width: 10.67vw;
					height: 100%;
					background: #000000;
				}
			}
		}

		>.content {
			font-weight: bold;
			font-size: 4vw;
			color: #ED1805;
			margin: 4vw 0 9vw;

			>.right {
				flex: auto;
				margin-left: 4vw;

				>.top {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-bottom: 1vw;
				}
			}

			>image {
				width: 12vw;
				height: 12vw;
				border-radius: 1.33vw;
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

			>.pay {
				width: 41.33vw;
				height: 8vw;
				line-height: 8vw;
				text-align: center;
				background: #010101;
				border-radius: 6vw;
				font-weight: bold;
				font-size: 4vw;
				color: #DDC285;
				margin-left: 2.93vw;
			}

			>.add {
				width: 41.33vw;
				height: 8vw;
				line-height: 8vw;
				text-align: center;
				border-radius: 6vw;
				border: 1px solid #000000;
				font-weight: bold;
				font-size: 4vw;
				color: #000000;
			}
		}

		>.list {
			margin-top: 1.87vw;
			padding: 2.67vw 4vw;
			background: #FFFFFF;

			>.label {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
				padding-bottom: 2.93vw;
				border-bottom: solid 1px #999999;
				margin-bottom: 4vw;

				>text {
					font-weight: 500;
					font-size: 2.67vw;
					color: #ED1805;
				}
			}

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

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #ED1805;
					}
				}
			}
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;

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
				font-weight: bold;
				font-size: 4vw;
				color: #000000;
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #999999;
				margin-bottom: 5.33vw;

				>text {
					font-size: 3.2vw;
				}
			}
		}
	}
</style>