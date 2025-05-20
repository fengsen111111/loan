<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="balance flex alignCenter spaceBetween">
			余额&emsp;{{userInfo.money||0.00}}
			<view class="right flex alignCenter">
				充值赠送活动
				<view class="pay" @click="$nav('/mine_packages/charge/index')">充值</view>
			</view>
		</view>
		<view class="label">余额记录</view>
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
				<text>{{type[item.type]==='add'?'+':'-'}}</text>{{item.money}}
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
				type: {
					a: "add",
					b: "add",
					c: "min",
					d: "add"
				},
				obj: {
					a: "充值",
					b: "赠送",
					c: "消费",
					d: "退款"
				},
				total: 0,
				list: [],
				userInfo: {}
			};
		},
		async mounted() {
			this.netWork();
			this.userInfo = await this.$request("/food/User/getUserInfo")
		},
		methods: {
			netWork() {
				this.$request("/food/User/getUserMoneyLogList", this.formData).then(res => {
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
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
		min-height: 100vh;
		height: 100%;
		background: #F5F5F5;

		>.item {
			padding: 0 4vw;
			height: 13.6vw;
			background: #FFFFFF;
			margin-bottom: 1.33vw;

			>.right {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;

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

		>.label {
			font-weight: bold;
			font-size: 3.2vw;
			color: #000000;
			padding: 0 4vw;
			margin: 2.67vw 0;
		}

		>.balance {
			font-weight: bold;
			font-size: 4vw;
			color: #000000;
			height: 13.6vw;
			background: #FFFFFF;
			padding: 0 4vw;

			>.right {
				font-weight: 500;
				font-size: 2.67vw;
				color: #ED1805;

				>.pay {
					width: 13.33vw;
					height: 5.33vw;
					line-height: 5.33vw;
					text-align: center;
					background: #000000;
					border-radius: 6vw;
					font-weight: bold;
					font-size: 3.2vw;
					color: rgb(245, 232, 174);
					margin-left: 2.67vw;
				}
			}
		}
	}
</style>