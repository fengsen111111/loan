<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="head flex alignCenter spaceAround">
			<view class="item" :class="formData.status==='a'?'active':''" @click="changeType('a')">待使用</view>
			<view class="item" :class="formData.status==='b'?'active':''" @click="changeType('b')">已使用</view>
			<view class="item" :class="formData.status==='c'?'active':''" @click="changeType('c')">已失效</view>
		</view>

		<view class="list">
			<view class="item_box" v-for="(item,index) in list" :key="item" v-if="formData.status==='a'">
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
					<view class="charge flex alignCenter justifyCenter" @click="toHome()">使用</view>
				</view>
			</view>
			<view class="item_box" v-for="(item,index) in list" :key="item" v-if="formData.status==='b'">
				<view class="item flex alignCenter">
					<image :src="item.cover_image" alt="" mode="aspectFill"></image>
					<view class="title flex spaceBetween flexColumn">
						{{item.name}}
						<text>{{status[item.use_type]}}</text>
					</view>
					<view class="content flex spaceBetween flexColumn">
						{{item.discount_type==='a'?'满'+item.top_price.replace('.00','')+'减'+item.data.replace('.00',''):item.data+'折'}}
						<text>有效期至：{{item.end_time}}</text>
					</view>
				</view>
				<view class="type" v-if="item.des">
					可用类型：{{item.des}}
				</view>
			</view>
			<view class="item_box" v-for="(item,index) in list" :key="item" v-if="formData.status==='c'"
				style="border: 0.27vw solid #999999;">
				<view class="item flex alignCenter">
					<image :src="item.cover_image" alt="" mode="aspectFill"></image>
					<view class="title flex spaceBetween flexColumn">
						{{item.name}}
						<text>{{status[item.use_type]}}</text>
					</view>
					<view class="content flex spaceBetween flexColumn" style="color: #999999;">
						{{item.discount_type==='a'?'满'+item.top_price.replace('.00','')+'减'+item.data.replace('.00',''):item.data+'折'}}
						<text>有效期至：{{item.end_time}}</text>
					</view>
				</view>
				<view class="type" v-if="item.des">
					可用类型：{{item.des}}
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
					status: 'a'
				},
				list: [],
				status: {
					a: "平台通用",
					b: "品牌通用",
					c: "门店通用",
					d: "分类通用",
					e: "菜品限定",
					f: "套餐限定"
				}
			};
		},
		onLoad() {
			this.netWork();
		},
		methods: {
			netWork() {
				this.$request("/food/Coupon/getUserCouponList", this.formData).then(res => {
					this.list = res.list
				})
			},
			changeType(type) {
				this.list = [];
				this.formData.status = type;
				this.netWork();
			},
			toHome() {
				uni.switchTab({
					url: "/pages/Home/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.list {
			padding: 0 4vw;
			margin-bottom: 2.67vw;

			>.item_box {
				padding: 2.67vw;
				background: #FBFBFB;
				border-radius: 1.33vw;
				border: 0.27vw solid #ED1805;
				margin-bottom: 4vw;

				>.get {
					>.charge {
						width: 21.33vw;
						height: 8vw;
						background: #FA4741;
						border-radius: 4vw;
						font-weight: 400;
						font-size: 4vw;
						color: #FFFFFF;
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
			height: 10.93vw;
			background: #FFFFFF;
			margin-bottom: 2.67vw;

			>.item {
				font-weight: 500;
				font-size: 4vw;
				color: #333333;
			}

			>.active {
				font-weight: bold;
				color: #000000;
			}
		}
	}
</style>