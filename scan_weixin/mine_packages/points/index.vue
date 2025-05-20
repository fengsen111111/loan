<template>
	<view class="container">
		<view class="head">
			<view class="title flex alignCenter spaceBetween">
				<view class="left">
					我的积分
					<text>{{point}}</text>
				</view>
				<text @click="$nav('/mine_packages/point_detail/index')">积分记录</text>
			</view>
			<view class="big_screen" :style="{padding:current===1?'4vw':'4vw 0 2.67vw'}">
				<view class="item" :class="current===1?'active':''" @click="changeCurrent(1)">优惠券</view>
				<view class="item" :class="current===2?'active':''" @click="changeCurrent(2)">商品</view>
			</view>
			<scroll-view scroll-x="true" style="width:calc(100% - 8vw);background: #f5f5f5; padding: 0 4vw;"
				v-if="current === 1" @scrolltolower="reachBottom()">
				<view class="screen">
					<view class="item" :class="formData.use_type==='a'?'active':''" @click="changeActive('a')">平台通用
					</view>
					<view class="item" :class="formData.use_type==='b'?'active':''" @click="changeActive('b')">全场通用
					</view>
					<view class="item" :class="formData.use_type==='c'?'active':''" @click="changeActive('c')">门店通用
					</view>
					<view class="item" :class="formData.use_type==='d'?'active':''" @click="changeActive('d')">分类通用
					</view>
					<view class="item" :class="formData.use_type==='e'?'active':''" @click="changeActive('e')">菜品限定
					</view>
					<view class="item" :class="formData.use_type==='f'?'active':''" @click="changeActive('f')">套餐限定
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="list" v-if="current === 1">
			<view class="item_box" v-for="(item,index) in list" :key="item">
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
				<view class="get flex alignCenter spaceBetween">
					<view class="points">
						兑换积分：{{item.integral}}
					</view>
					<view class="charge flex alignCenter justifyCenter" @click="exchange(1,item)">兑换</view>
				</view>
			</view>
		</view>
		<view class="list" v-if="current === 2">
			<view class="item flex alignCenter" v-for="(item) in list" :key="item.id">
				<image :src="item.cover_image"></image>
				<view class="right">
					<view class="title">{{item.name}}</view>
					<view class="options flex alignCenter spaceBetween">
						兑换积分：{{item.integral}}
						<view class="charge" @click="exchange(2,item)">兑换</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="discountShow" mode="bottom" round="5.33vw" @close="discountShow=false">
			<view class="discountContent">
				<view class="title flex alignCenter spaceBetween">
					兑换
					<u-icon name="close" color="#000000" size="25" @click="discountShow=false"></u-icon>
				</view>
				<view style="padding: 0 2.27vw;">
					<view class="item flex alignCenter">
						<image :src="changeItem.cover_image" alt="" mode="aspectFill"></image>
						<view class="title flex spaceBetween flexColumn">
							{{changeItem.name}}
							<text>{{changeItem.des}}</text>
						</view>
						<view class="content flex spaceBetween flexColumn">
							{{changeItem.discount_type==='a'?'满'+changeItem.top_price.replace('.00','')+'减'+changeItem.data.replace('.00',''):changeItem.data+'折'}}
							<text>有效期至：{{changeItem.end_time}}</text>
						</view>
					</view>
					<view class="type" v-if="changeItem.types">
						可用类型：{{changeItem.types}}
					</view>
					<view class="points">兑换积分：{{changeItem.integral}}</view>
					<view class="confirm" @click="confirm()">确定兑换</view>
				</view>
			</view>
		</u-popup>


		<u-popup :show="shopShow" mode="bottom" round="5.33vw" @close="shopShow=false">
			<view class="shopContent">
				<view class="title flex alignCenter spaceBetween">
					兑换
					<u-icon name="close" color="#000000" size="25" @click="shopShow=false"></u-icon>
				</view>
				<view style="padding: 0 2.27vw;">
					<view class="item flex alignCenter">
						<image :src="changeItem.cover_image"></image>
						<view class="right">
							<view class="title">{{changeItem.name}}</view>
							<view class="options flex alignCenter spaceBetween">
								兑换积分：{{changeItem.integral}}
								<view class="changeNum">
									<view class="op_item" @click="changeNumber('min')">
										<u-icon name="minus" size="4vw" color="rgb(245, 232, 174)"></u-icon>
									</view>
									<view class="num">{{changeNum}}</view>
									<view class="op_item" @click="changeNumber('add')">
										<u-icon name="plus" size="4vw" color="rgb(245, 232, 174)"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="points">兑换积分：{{multiply(changeItem.integral, changeNum)}}</view>
					<view class="confirm" @click="confirmBtn()">确定兑换</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 1,
				formData: {
					use_type: 'a',
					currentPage: 1,
					perPage: 10
				},
				total: 0,
				status: {
					a: "平台通用",
					b: "品牌通用",
					c: "门店通用",
					d: "分类通用",
					e: "菜品限定",
					f: "套餐限定"
				},
				discountShow: false,
				shopShow: false,
				list: [],
				point: 0,

				changeItem: {},
				changeNum: 1
			};
		},
		onLoad() {
			this.$request("/food/User/getUserIntegral").then(res => {
				this.point = res.integral
			})
			this.netWork();
		},
		methods: {
			changeCurrent(type) {
				this.current = type;
				if (type === 1) {
					this.formData.use_type = 'a';
					this.netWork();
				} else {
					this.$request("/food/IntegralGoods/getIntegralGoodsList").then(res => {
						this.list = res.list
					})
				}
			},
			netWork() {
				this.$request("/food/Coupon/getExchangeCoupon", this.formData).then(res => {
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
					}
				})
			},
			changeActive(type) {
				this.formData.use_type = type;
				this.netWork();
			},
			exchange(type, obj) {
				if (type === 1) {
					this.discountShow = true;
				} else {
					this.shopShow = true;
				}
				this.changeItem = obj;
			},
			changeNumber(type) {
				if (type === "add") {
					this.changeNum++
				} else {
					if (this.changeNum === 1) return;
					this.changeNum--;
				}
			},
			multiply(num1, num2) {
				return num1 * num2
			},
			confirmBtn() {
				uni.showLoading({
					title: "请稍后",
				})
				this.$request("/food/IntegralOrder/createIntegralOrder", {
					goods_id: this.changeItem.id,
					number: this.changeNum
				}).then(res => {
					uni.hideLoading()
					this.shopShow = false;
					uni.showToast({
						title: "兑换成功",
						icon: "success"
					})
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title: "兑换失败",
						icon: "error"
					})
				})
			},
			confirm() {
				uni.showLoading({
					title: "请稍后",
				})
				this.$request("/food/Coupon/exchangeCoupon", {
					coupon_id: this.changeItem.id,
				}).then(res => {
					uni.hideLoading()
					this.discountShow = false;
					uni.showToast({
						title: "兑换成功",
						icon: "success"
					})
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title: "兑换失败",
						icon: "error"
					})
				})
			},
			reachBottom() {
				if (this.current === 1) {
					if (this.formData.currentPage < Math.ceil(this.total / this.formData.perPage)) {
						this.formData.currentPage++;
						this.netWork();
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.shopContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 8vw;
		}

		.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
			margin: 0 auto;
		}

		.points {
			font-weight: bold;
			font-size: 3.2vw;
			color: #000000;
			text-align: center;
			margin: 15vw 0 2.67vw;
		}

		.item {
			padding: 2.67vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			margin-bottom: 2.67vw;

			>.right {
				flex: auto;

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #333333;
					margin-bottom: 2.67vw;
				}

				>.options {
					font-weight: bold;
					font-size: 3.2vw;
					color: #000000;

					>.changeNum {
						width: 28vw;
						height: 5.33vw;
						display: flex;
						align-items: center;
						border-radius: 4vw;
						overflow: hidden;

						>.num {
							width: 12vw;
							height: 100%;
							background: #F5F5F5;
							text-align: center;
							line-height: 5.33vw;
						}

						>.op_item {
							width: 8vw;
							height: 100%;
							background: #000000;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}

			>image {
				width: 16.27vw;
				height: 16.27vw;
				border-radius: 1.47vw;
				margin-right: 2.93vw;
			}
		}
	}

	.discountContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 8vw;
		}

		.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
			margin: 0 auto;
		}

		.points {
			font-weight: bold;
			font-size: 3.2vw;
			color: #000000;
			text-align: center;
			margin: 5.33vw 0 2.67vw;
		}

		.type {
			font-weight: 400;
			font-size: 2.67vw;
			color: #666666;
			margin-top: 1.33vw;
			padding-bottom: 2.67vw;
			border-bottom: solid 1px #F5F5F5;
		}

		.item {
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

	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/

		>.list {
			padding: 0 4vw;

			>.item {
				padding: 2.67vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin-bottom: 2.67vw;

				>.right {
					flex: auto;

					>.title {
						font-weight: bold;
						font-size: 4vw;
						color: #333333;
						margin-bottom: 2.67vw;
					}

					>.options {
						font-weight: bold;
						font-size: 3.2vw;
						color: #000000;

						>.charge {
							width: 21.33vw;
							height: 8vw;
							line-height: 8vw;
							text-align: center;
							background: #000000;
							border-radius: 4vw;
							font-weight: 400;
							font-size: 4vw;
							color: rgb(245, 232, 174);
						}
					}
				}

				>image {
					width: 16.27vw;
					height: 16.27vw;
					border-radius: 1.47vw;
					margin-right: 2.93vw;
				}
			}

			>.item_box {
				padding: 2.67vw;
				background: #FBFBFB;
				border-radius: 1.33vw;
				border: 0.27vw solid #ED1805;
				margin-bottom: 4vw;

				>.get {
					>.points {
						font-weight: bold;
						font-size: 3.2vw;
						color: #000000;
					}

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

		>.head {
			position: sticky;
			top: 0;
			left: 0;
			width: 100%;

			.screen {
				width: fit-content;
				display: flex;
				align-items: center;
				padding-bottom: 4vw;

				>.item {
					white-space: nowrap;
					margin-right: 4.67vw;
					font-weight: 500;
					font-size: 3.2vw;
					color: #999999;

					&:last-child {
						margin-right: 0;
					}
				}

				>.active {
					font-weight: bold;
					color: #000000;
				}
			}

			>.big_screen {
				display: flex;
				align-items: center;
				justify-content: space-around;
				background: #F5F5F5;

				>.item {
					font-weight: 400;
					font-size: 3.73vw;
					color: #666666;
				}

				>.active {
					font-weight: bold;
					color: #000000;
				}
			}

			>.title {
				height: 10.67vw;
				background: #FFFFFF;
				padding: 0 4vw;
				font-weight: 400;
				font-size: 3.2vw;
				color: #EFA246;

				>.left {
					font-weight: bold;
					font-size: 3.2vw;
					color: #333333;

					>text {
						color: #EFA246;
						margin-left: 1.2vw;
					}
				}
			}
		}
	}
</style>