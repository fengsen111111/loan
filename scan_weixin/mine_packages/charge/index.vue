<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="item" v-for="(item) in list" :key="item.id">
			<image :src="item.image" mode=""></image>
			<view class="info">
				<view class="title">{{item.name}}</view>
				<view class="content">
					{{item.introduce}}
				</view>
				<view class="bottom flex alignCenter spaceBetween">
					<view class="left">
						充值门槛&nbsp;&nbsp;{{item.charge_price}}
						<view class="free">
							赠送金额<text>{{item.complimentary_price}}</text>
						</view>
					</view>
					<view class="pay" @click="pay(item)">充值</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					currentPage: 1,
					perPage: 10
				},
				total: 0,
				list: [],
				flag: true,
			};
		},
		mounted() {
			this.netWork();
		},
		methods: {
			netWork() {
				this.$request("/food/ChargeActivity/getChargeActivityList", this.formData).then(res => {
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
					}
				})
			},
			pay(obj) {
				if (!this.flag) return;
				this.flag = false
				this.$request("/food/Charge/createChargeOrder", {
					charge_price: obj.charge_price
				}).then(res => {
					uni.requestPayment({
						...res,
						success: () => {
							uni.showToast({
								title: "支付成功",
								icon: "success"
							})
						},
						fail: () => {
							uni.showToast({
								title: "用户取消支付",
								icon: "error"
							})
						},
						complete: () => {
							this.flag = true;
						}
					})
				})
			}
		},
		onReachBottom() {
			if (this.formData.currentPage <= Math.ceil(this.total / this.formData.perPage)) {
				this.formData.currentPage++;
				this.netWork();
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;
		padding: 0 4vw;

		>.item {
			background: #FFFFFF;
			box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
			border-radius: 2.67vw;
			overflow: hidden;
			margin-bottom: 2.67vw;

			>.info {
				padding: 2.67vw 4vw;

				>.bottom {
					>.pay {
						width: 21.33vw;
						height: 8vw;
						line-height: 8vw;
						text-align: center;
						background: #000000;
						border-radius: 6vw;
						font-weight: bold;
						font-size: 3.73vw;
						color: rgb(245, 232, 174);
					}

					>.left {
						font-weight: 500;
						font-size: 2.67vw;
						color: #000000;

						>.free {
							font-weight: 400;
							font-size: 3.2vw;

							>text {
								font-weight: bold;
								font-size: 4vw;
								color: #ED1805;
								margin-left: 2.67vw;
							}
						}
					}
				}

				>.content {
					font-weight: 400;
					font-size: 3.2vw;
					color: #999999;
					margin-bottom: 3.2vw;
				}

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-bottom: 1.33vw;
				}
			}

			>image {
				width: 100%;
				height: 36.4vw;
			}
		}
	}
</style>