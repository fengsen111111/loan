<template>
	<view class="container">
		<view class="title flex alignCenter">
			我的积分
			<text>{{integral}}</text>
		</view>
		<view style="height: 1.73vw;"></view>
		<view class="item flex alignCenter spaceBetween" v-for="(item) in list" :key="item.id">
			<view class="left flex alignCenter">
				<image
					:src="type[item.type]==='add'?require('@/mine_packages/static/add.png'):require('@/mine_packages/static/min.png')"
					mode=""></image>
				<view class="flex flexColumn">
					<text>{{obj[item.type]}}</text>
					{{item.create_time}}
				</view>
			</view>
			<view class="right">
				<text>{{type[item.type]==='add'?'+':'-'}}</text>{{item.integral}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				integral: 0,
				formData: {
					currentPage: 1,
					perPage: 10
				},
				list: [],
				total: 0,
				type: {
					a: "add",
					b: "min",
					c: "min",
					d: "add",
					e: "min"
				},
				obj: {
					a: "获得",
					b: "兑换",
					c: "抵扣",
					d: "退款增加",
					e: "退款减少"
				},
			};
		},
		onLoad() {
			this.netWork();
			this.$request("/food/User/getUserIntegral").then(res => {
				this.integral = res.integral
			})
		},
		methods: {
			netWork() {
				this.$request("/food/User/getUserIntegralLogList", this.formData).then(res => {
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list
					} else {
						this.list = this.list.concat(res.list)
					}
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
	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.title {
			height: 10.67vw;
			background: #FFFFFF;
			padding: 0 4vw;
			font-weight: bold;
			font-size: 3.2vw;
			color: #333333;

			>text {
				color: #EFA246;
				margin-left: 1.2vw;
			}
		}

		>.item {
			padding: 0 4vw;
			height: 13.6vw;
			background: #FFFFFF;
			margin-bottom: 1.33vw;

			>.right {
				font-weight: bold;
				font-size: 4vw;
				color: #000000;

				>text {
					margin-right: 2vw;
				}
			}

			>.left {
				font-weight: 500;
				font-size: 2.67vw;
				color: #000000;

				text {
					font-weight: bold;
					font-size: 3.2vw;
				}

				>image {
					width: 5.33vw;
					height: 5.33vw;
					margin-right: 2.67vw;
				}
			}
		}
	}
</style>