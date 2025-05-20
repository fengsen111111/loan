<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="item flex alignCenter spaceBetween" v-for="(item) in list" :key="item.id">
			<view class="left flex alignCenter">
				<image
					:src="item.type==='a'||item.type==='c'?require('@/mine_packages/static/add.png'):require('@/mine_packages/static/min.png')"
					mode=""></image>
				<view class="flex flexColumn">
					<text>{{type[item.type]}}</text>
					{{item.create_time}}
				</view>
			</view>
			<view class="right">
				<text>{{item.type==='a'||item.type==='c'?'+':'-'}}</text>{{item.money}}
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
				list: [],
				total: 0,
				type: {
					a: "收入",
					b: "提现",
					c: "提现退回"
				}
			};
		},
		onLoad() {
			this.netWork();
		},
		methods: {
			netWork() {
				this.$request("/food/User/getUserShareLogList", this.formData).then(res => {
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
		height: 100%;
		min-height: 100vh;
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
	}
</style>