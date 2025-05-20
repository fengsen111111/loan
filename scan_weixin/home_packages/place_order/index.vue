<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="info" v-if="!addType">
			<view class="label">基本信息</view>
			<view class="option flex alignCenter spaceBetween">
				<view class="left flex alignCenter" @click="selectTable()">
					餐位<text>{{table_code||"请选择"}}</text>
					<view class="scanCode" @click.stop="scanCode()">扫桌码</view>
				</view>
				<view class="right flex alignCenter">
					<text style="margin-right: 4vw;">人数</text>
					<text v-if="!numberShow">{{orderForm.person_number}}</text>
					<view class="number flex alignCenter" v-else>
						<view class="add flex alignCenter justifyCenter" @click="changePeopleNum('min')">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">
							{{orderForm.person_number}}
						</view>
						<view class="min flex alignCenter justifyCenter" @click="changePeopleNum('add')">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="label">备注</view>
			<view class="textarea">
				<textarea auto-height maxlength="-1" style="min-height: 18.67vw;max-height: 18.67vw;"
					placeholder="输入备注（选填）" placeholder-class="input_placeholder" v-model="orderForm.remark"></textarea>
			</view>
		</view>
		<view class="shopInfo">
			<view class="label">商品信息</view>
			<view class="item" v-for="(item,index) in goodsList" :key="index">
				<view class="title flex alignCenter spaceBetween">
					<view>
						{{item.info.name}}
						<text style="font-size: 3vw;color: #999999;font-weight: normal;"
							v-if="item.choice_des">（{{item.choice_des}}）</text>
					</view>
					<u-icon name="trash" color="#000000" size="20" @click="trash(index)"></u-icon>
				</view>
				<view class="content flex spaceBetween">
					<image :src="item.info.cover_image" mode=""></image>
					<view class="con">{{item.info.introduce}}</view>
				</view>
				<view class="price flex alignCenter spaceBetween">
					单价 ￥{{item.info.price}}
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changeCarNum(item,'min',index)">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">
							{{item.num}}
						</view>
						<view class="min flex alignCenter justifyCenter" @click="changeCarNum(item,'add',index)">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom flex alignCenter spaceBetween">
			<view class="left">
				<view class="top flex alignCenter spaceBetween">
					<view class="left flex alignCenter">
						总计￥{{moneyObj.price||0}}
						<text v-if="moneyObj.discount_price">已优惠 ￥{{moneyObj.discount_price||0}}</text>
					</view>
					<view class="right" v-if="useCoupon===false&&!workerType" @click="selectCount()">选择优惠卷</view>
				</view>
				<view class="bottom flex alignCenter spaceBetween" v-if="!workerType">
					获得积分:{{moneyObj.reward_integral||0}}
					<u-checkbox-group v-model="checkValue" shape="circle" @change="checkboxChange">
						<u-checkbox activeColor="#EFA246" labelSize="2.67vw" labelColor="#999999"
							:label="'使用积分抵扣:￥'+(moneyObj.integral_price||0)" :name="1">
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view class="right flex alignCenter">
				<view class="gotIt" @click.stop="order()">{{workerType?'下单':'支付'}}</view>
			</view>
		</view>
		<u-popup :show="discountShow" :mode="discountFirst?'center':'bottom'" round="5.33vw" @close="discountClose()">
			<view class="discount_checkbox" v-if="discountFirst">
				<u-checkbox-group v-model="checkValue1" shape="circle">
					<u-checkbox activeColor="#EFA246" labelSize="2.67vw" labelColor="#999999"
						:label="'当前积分可抵扣:￥'+(moneyObj.integral_price||0)+'，是否抵扣'" :name="1">
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="discountContent" :style="discountFirst?'width: 85vw;':''">
				<view class="title flex alignCenter spaceBetween">
					优惠卷
					<u-icon name="close" color="#000000" size="25" @click="discountClose()"></u-icon>
				</view>
				<scroll-view scroll-y="true"
					:style="!discountList||discountList.length===0?'height:20vh':'height: 50vh;'">
					<u-empty mode="coupon" text="暂无可用的优惠券" v-if="!discountList||discountList.length===0"></u-empty>
					<view class="item_box" v-for="(item) in discountList" :key="item.id">
						<view class="item flex alignCenter">
							<image :src="item.cover_image" alt="" mode="aspectFill"></image>
							<view class="title flex spaceBetween flexColumn">
								{{item.name}}
								<text>{{item.des}}</text>
							</view>
							<view class="content flex spaceBetween flexColumn">
								{{item.discount_type==='a'?'满'+item.top_price.replace('.00','')+'减'+item.data.replace('.00',''):item.data+'折'}}
								<text>有效期至：{{item.end_time}}</text>
							</view>
						</view>
						<view class="type" v-if="item.types">
							可用类型：{{item.types}}
						</view>
						<view class="get flex flexEnd flexColumn" :style="!item.types?'margin-top:2vw':''">
							<view class="charge flex alignCenter justifyCenter" v-if="item.has_status==='N'"
								@click="getCoupon(item)">领取</view>
							<view class="charge flex alignCenter justifyCenter" v-if="item.has_status==='Y'"
								@click="useCouponEven(item)">使用</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-popup :show="payShow" mode="bottom" @close="payShow=false" round="5.33vw">
			<view class="payContent">
				<view class="title flex alignCenter spaceBetween">
					支付方式
					<u-icon name="close" size="25" color="#000000" @click="payShow=false"></u-icon>
				</view>

				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(2)">
					<view class="item flex alignCenter">
						<u-icon name="weixin-fill" color="#68BF7B" size="5.33vw"></u-icon>
						<text>微信</text>
					</view>
					<u-icon name="checkmark-circle-fill" color="black" size="20" v-if="payType===2"></u-icon>
				</view>
				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(1)">
					<view class="item flex alignCenter">
						<image src="@/static/money.png" mode=""></image>
						<text>余额</text>
						{{userMoney}}
					</view>
					<u-icon name="checkmark-circle-fill" color="black" size="20" v-if="payType===1"></u-icon>
				</view>
				<view class="confirm" @click="confirm()">支付</view>
			</view>
		</u-popup>
		<u-picker :show="tableShow" :columns="[tableList]" keyName="code" @confirm="tableConfirm" title="餐位"
			@cancel="tableShow=false" closeOnClickOverlay @close="tableShow=false"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				store_id: "",
				table_code: "",
				tableList: [],
				tableShow: false,
				formData: {
					goods_list: []
				},
				numberShow: true,
				orderForm: {
					store_id: "",
					coupon_id: "",
					table_id: "",
					person_number: 1,
					remark: "",
					goods_list: [],
				},
				goodsList: [],
				discountShow: false,
				discountFirst: false,
				discountList: [],
				status: {
					a: "平台通用",
					b: "品牌通用",
					c: "门店通用",
					d: "分类通用",
					e: "菜品限定",
					f: "套餐限定"
				},
				moneyObj: {},
				confirmFlag: true,

				addType: false,
				useCoupon: false,
				orderId: "",

				orderResult: false,

				checkValue: [1],
				checkValue1: [],
				payShow: false,
				payType: 2,
				payFlag: true,

				userMoney: 0,

				workerType: false
			};
		},
		onLoad(options) {
			if (options.addType) {
				console.log(options.useCoupon)
				this.addType = true;
				this.useCoupon = options.useCoupon !== 'false';
				this.orderId = options.orderId
			}
			if (uni.getStorageSync("person_number")) {
				this.orderForm.person_number = uni.getStorageSync("person_number").person_number;
				this.numberShow = false;
			}
			if (options.workerType) {
				this.workerType = true
			}
			this.goodsList = uni.getStorageSync("shop" + options.id) || [];
			this.orderForm.store_id = options.id;
			this.$request("/food/Seat/geSeatList2", {
				store_id: options.id
			}).then(res => {
				this.tableList = res.list;
				if (options.scanType) {
					this.orderForm.table_id = options.seat_id;
					this.table_code = options.table_code
				}
				//  else {
				// 	this.orderForm.table_id = options.seat_id;
				// 	this.table_code = options.table_code
				// }
			})
			this.store_id = options.id;
			this.changePayData();
			this.selectCount("first");
		},
		methods: {
			discountClose() {
				this.discountShow = false;
				if (this.checkValue1[0] !== 1) {
					this.checkValue = [];
				}
			},
			scanCode() {
				uni.scanCode({
					scanType: ["qrCode"],
					success: res => {
						let str = res.result.split("?")[1];
						let obj = {};
						let arr = str.split('&');
						for (let i = 0; i < arr.length; i++) {
							obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
						}
						this.orderForm.table_id = obj.seat_id;
						this.table_code = obj.seat_code
					}
				})
			},
			selectTable() {
				this.tableShow = true;
			},
			tableConfirm(e) {
				const info = e.value[0];
				if (info) {
					this.orderForm.table_id = info.id;
					this.table_code = info.code;
				}
				this.tableShow = false;
			},
			changePayData() {
				if (this.goodsList.length) {
					this.formData.goods_list = this.goodsList.map(item => {
						return {
							goods_type: item.type === 1 ? 'b' : 'a',
							goods_id: item.info.id,
							number: item.num,
							choice_des: item.choice_des,
							[item.info.group_goods ? 'group_goods' : '']: item.info.group_goods
						}
					})
				} else {
					this.formData.goods_list = [];
				}
				this.$request("/food/Order/computePayData", {
					goods_list: this.formData.goods_list,
					coupon_id: this.orderForm.coupon_id,
					pay_type: this.checkValue[0] === 1 ? 'b' : 'a'
				}).then(result => {
					this.moneyObj = result;
				})
			},
			changePeopleNum(type) {
				if (type === "add") {
					this.orderForm.person_number += 1;
				} else {
					if (this.orderForm.person_number === 1) return;
					this.orderForm.person_number -= 1;
				}
			},
			trash(index) {
				uni.showModal({
					title: "温馨提示",
					content: "确认删除吗？",
					success: res => {
						if (res.confirm) {
							this.goodsList.splice(index, 1);
							uni.setStorageSync("shop" + this.store_id, this.goodsList);
							this.changePayData();
						}
					}
				})

			},
			changeCarNum(obj, type, index) {
				if (type === "add") {
					obj.num += 1
				} else if (type === "min") {
					if (obj.num === 1) {
						this.goodsList.splice(index, 1);
					} else {
						obj.num -= 1
					}
				}
				uni.setStorageSync("shop" + this.store_id, this.goodsList);
				this.changePayData();
			},
			selectCount(type) {
				let goods_list = [];
				if (this.goodsList.length) {
					goods_list = this.goodsList.map(item => {
						return {
							goods_type: item.type === 1 ? 'b' : 'a',
							goods_id: item.info.id,
							number: item.num,
							choice_des: item.choice_des,
							[item.info.group_goods ? 'group_goods' : '']: item.info.group_goods
						}
					})
				}
				this.$request("/food/Coupon/getOrderCoupon", {
					store_id: this.store_id,
					goods_list
				}).then(res => {
					this.discountList = res.list;
					if (this.workerType) {
						return;
					}
					if (type === "first") {
						this.discountFirst = true;
					} else {
						this.discountFirst = false;
					}
					if (type === "first" && this.discountList.length === 0) {
						this.discountShow = false;
					} else {
						this.discountShow = true;
					}
				})
			},
			changePayType(type) {
				this.payType = type;
			},
			getCoupon(item) {
				this.$request("/food/Coupon/hasCoupon", {
					coupon_id: item.id
				}).then(() => {
					this.selectCount();
				})
			},
			useCouponEven(item) {
				this.orderForm.coupon_id = item.id;
				this.discountShow = false;
				this.changePayData()
			},
			checkboxChange(e) {
				this.checkValue = e;
				this.changePayData()
			},
			order() {
				if (!this.table_code) {
					uni.showToast({
						title: "请先选择餐位号",
						icon: "error"
					})
					return;
				}
				if (this.goodsList.length === 0) {
					uni.showToast({
						title: "商品为空",
						icon: "error"
					})
					return;
				}
				if (this.workerType) {
					uni.showLoading({
						title: "请稍后……"
					})
					let orderForm = {
						...this.orderForm,
						...this.formData,
						...uni.getStorageSync("workerOrder")
					}
					this.$request("/food/Order/createOrder", orderForm).then(res => {
						uni.hideLoading();
						if (res.result === 1) {
							uni.removeStorageSync("shop" + this.store_id);
							uni.showToast({
								title: "下单成功",
								icon: "error",
								duration: 2000
							})
							uni.navigateBack({
								delta: 2
							})
						} else {
							uni.showToast({
								title: "下单失败",
								icon: "error",
								duration: 2000
							})
						}
					}).catch(() => {
						uni.hideLoading();
					})
					return;
				}
				this.$request("/food/User/getUserInfo").then(res => {
					this.userMoney = res.money;
					this.payShow = true;
				})
			},
			confirm() {
				if (!this.payFlag) return;
				this.payFlag = false
				let pay_type = ""
				if (this.checkValue[0] === 1) {
					if (this.payType === 1) {
						pay_type = 'd'
					} else if (this.payType === 2) {
						pay_type = 'b'
					}
				} else if (this.checkValue.length === 0) {
					if (this.payType === 1) {
						pay_type = 'c'
					} else if (this.payType === 2) {
						pay_type = 'a'
					}
				}
				let orderForm = {
					...this.orderForm,
					...this.formData,
				}
				console.log(orderForm)

				// if (this.addType) {
				// 	orderForm = {
				// 		order_id: this.orderId,
				// 		goods_list: this.formData.goods_list
				// 	}
				// }

				this.$request("/food/Order/createOrder", orderForm).then(res => {
					if (res.result === 1) {
						uni.removeStorageSync("shop" + this.store_id);
						this.$request("/food/Order/payOrder", {
							order_id: res.order_id,
							coupon_id: this.orderForm.coupon_id,
							pay_type
						}).then(pay => {
							if (pay.result === 1) {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									duration: 2000
								})
								setTimeout(() => {
									uni.switchTab({
										url: "/pages/Order/index"
									})
								}, 2000)
							} else if (pay.result === 3) {
								uni.requestPayment({
									provider: "wxpay",
									...pay.pay_data,
									success: res => {
										uni.showToast({
											title: "支付成功",
											icon: "success",
											duration: 2000
										})
										setTimeout(() => {
											uni.switchTab({
												url: "/pages/Order/index"
											})
										}, 2000)
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
								uni.showToast({
									title: "支付失败",
									icon: "error",
									duration: 2000
								})
							}
						}).catch(() => {
							this.payFlag = true;
						})
					} else {
						this.payFlag = true;
						uni.showToast({
							title: "下单失败",
							icon: "error",
							duration: 1000
						})
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
			background: #000000;
			border-radius: 6vw;
			margin: 10vw auto 0;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
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

	.discount_checkbox {
		background: #FFFFFF;
		margin: -10vw auto 0;
		border-radius: 5.33vw;
		width: calc(100% - 10vw);
		height: 8vw;
		display: flex;
		align-items: center;
		padding: 0 5vw;
	}

	.discountContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		.item_box {
			padding: 2.67vw;
			background: #FBFBFB;
			border-radius: 1.33vw;
			border: 0.27vw solid #ED1805;
			margin-bottom: 4vw;

			>.get {
				>.charge {
					width: 21.33vw;
					height: 8vw;
					background: #000000;
					border-radius: 4vw;
					font-weight: 400;
					font-size: 4vw;
					color: rgb(245, 232, 174);
				}
			}

			>.type {
				font-weight: 400;
				font-size: 2.67vw;
				color: #666666;
				margin: 1.33vw 0;
			}

			>.item {
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #F5F5F5;

				>.content {
					font-weight: bold;
					font-size: 4vw;
					color: #ED1805;
					flex: auto;
					align-items: flex-end;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>.title {
					font-weight: 400;
					font-size: 3.73vw;
					color: #000000;
					flex: auto;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>image {
					width: 9.6vw;
					height: 9.6vw;
					border-radius: 1.33vw;
					margin-right: 2.67vw;
				}
			}
		}
	}

	.container {
		height: 100%;
		min-height: calc(100vh - 13vw - constant(safe-area-inset-bottom));
		min-height: calc(100vh - 13vw - env(safe-area-inset-bottom));
		background: #F5F5F5;
		padding-bottom: calc(13vw + constant(safe-area-inset-bottom));
		/*兼容 IOS&gt;11.2*/
		padding-bottom: calc(13vw + env(safe-area-inset-bottom));
		/*兼容 IOS&gt;11.2*/

		>.bottom {
			width: calc(100% - 8vw - 2px);
			position: fixed;
			bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			padding-left: 4vw;
			padding-right: 4vw;
			left: 0;
			height: 12.8vw;
			background: #FFFFFF;
			border-radius: 1.33vw 1.33vw 0 0;
			border: 1px solid #999999;
			padding-top: 2.67vw;

			>.right {
				font-weight: 500;
				font-size: 2.67vw;
				color: #FA4741;

				>.gotIt {
					width: 26.67vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					background: #000000;
					border-radius: 6vw;
					font-weight: bold;
					font-size: 4vw;
					color: rgb(245, 232, 174);
					margin-left: 4vw;
				}
			}

			>.left {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;
				flex: auto;

				>.bottom {
					font-weight: 500;
					font-size: 2.67vw;
					color: #999999;
				}

				>.top {
					margin-bottom: 1.73vw;

					>.left {
						>text {
							font-weight: 500;
							font-size: 2.67vw;
							color: #999999;
							margin-left: 1.33vw;
						}
					}

					>.right {
						font-weight: 500;
						font-size: 2.67vw;
						color: #FA4741;
					}
				}


			}
		}

		>.shopInfo {
			background: #FFFFFF;
			padding: 4vw;

			>.item {
				border-bottom: solid 1px #999999;

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-top: 5.33vw;
					margin-bottom: 2.67vw;
				}

				>.content {
					>image {
						width: 21.33vw;
						height: 21.33vw;
						border-radius: 2.67vw;
					}

					>.con {
						width: 67vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #999999;
					}
				}

				>.price {
					font-weight: bold;
					font-size: 4.8vw;
					color: #ED1805;
					margin-top: 4vw;
					margin-bottom: 4vw;
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
			}
		}

		>.info {
			background: #FFFFFF;
			padding: 4vw;
			margin-bottom: 1.33vw;

			>.textarea {
				background: #F5F5F5;
				border-radius: 1.33vw;
				margin-top: 1.73vw;
				padding: 2vw;

				>textarea {
					width: 100%;
				}
			}

			>.option {
				margin: 4.13vw 0;

				>.right {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
				}

				>.left {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;

					>.scanCode {
						width: 15.2vw;
						height: 6.67vw;
						line-height: 6.67vw;
						text-align: center;
						background: #000000;
						border-radius: 4vw;
						font-size: 3.2vw;
						color: rgb(245, 232, 174);
						margin-left: 2vw;
					}

					>text {
						font-weight: 500;
						font-size: 3.2vw;
						color: #999999;
						margin-left: 4vw;
					}
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
			}
		}

		.number {
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
</style>