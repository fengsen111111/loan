<template>
	<view class="food_item flex spaceBetween" @click="$nav('/home_packages/shop_detail/index',{id:item.id})">
		<image :src="item.logo" mode=""></image>
		<view class="right">
			<view class="title flex spaceBetween">
				<view style="flex: 1;font-weight: bold;">{{item.brand_name+"("+item.name+")"}}</view>
				<text :style="{color:item.open_status==='Y'?'#80CF40':'#999999'}">
					{{item.open_status==='Y'?'营业中':'未营业'}}
				</text>
			</view>
			<view class="info flex spaceBetween alignCenter">
				<view class="left flex alignCenter">
					<view class="star flex alignCenter">
						<view class="item" v-for="(i) in 5" :key="i">
							<image src="@/static/star.png" mode=""></image>
							<view class="bg" :style="{width:getStar(item.star,i+1)}"></view>
						</view>
					</view>
					<text>{{item.star}}</text>
				</view>
				营业时间 {{item.open_time}}
			</view>
			<view class="introduce" v-if="item.introduce"
				:style="(!item.recommend_group_goods_id&&!item.coupon_name)||collect?'margin-bottom:0':''">
				{{item.introduce}}
			</view>
			<view class="address flex alignCenter spaceBetween">
				<text>{{item.store_type_name[0]||""}}&emsp;{{item.sort_address}}</text>
				{{item.distance}}
			</view>
			<view class="label flex alignCenter flexWrap" v-if="item.signs.length>0&&item.signs[0]!==''">
				<view class="item" v-for="(i,j) in item.signs" :key="j">{{i}}</view>
			</view>
			<view class="recommend flex alignCenter spaceBetween" v-if="!collect&&item.recommend_group_goods_id">
				<view class="left flex alignCenter">
					<image src="@/static/recommend.png" mode=""></image>
					{{item.recommend_group_goods_name}}
				</view>
				<view class="right flex alignCenter">
					<text style="margin-right: 2.53vw;">￥{{item.recommend_group_goods_price}}</text>
					<u-icon name="arrow-right" size="14"></u-icon>
				</view>
			</view>
			<view class="discount flex alignCenter spaceBetween" v-if="!collect&&item.coupon_name">
				<view class="left flex alignCenter">
					<image src="@/static/discount.png" mode=""></image>
					{{item.coupon_name}}
				</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "FoodItem",
		props: {
			item: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				default: 0
			},
			collect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			getStar(val, index) {
				if (index - 1 > val) return "0%"
				if (Math.floor(val) >= index) return "100%"
				let stringVal = val + ""
				let value = stringVal.split(".")[1];
				if (value.length === 1) value = value * 10;
				return value + "%"
			}
		}
	}
</script>

<style lang="scss">
	.food_item {
		background: #FFFFFF;
		padding: 2.67vw 4vw;
		margin-bottom: 1.6vw;

		>image {
			width: 25.33vw;
			height: 25.33vw;
			border-radius: 1.33vw;
		}

		>.right {
			width: 62.67vw;

			>.discount {
				border-top: solid 1px #F5F5F5;
				padding: 1.33vw 0;

				>.left {
					font-size: 3.2vw;
					color: #000000;

					>image {
						width: 4.53vw;
						height: 4.53vw;
						border-radius: 0.53vw;
						margin-right: 1.2vw;
					}
				}
			}

			>.recommend {
				border-top: solid 1px #F5F5F5;
				padding: 1.33vw 0;

				>.right {
					font-weight: bold;
					font-size: 2.67vw;
					color: #ED4133;
				}

				>.left {
					font-size: 3.2vw;
					color: #000000;

					>image {
						width: 4.53vw;
						height: 4.53vw;
						border-radius: 0.53vw;
						margin-right: 1.2vw;
					}
				}
			}

			>.introduce {
				font-size: 3.2vw;
				color: red;
				background: rgba(255, 0, 0, 0.2);
				margin-bottom: 2.67vw;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			>.label>.item {
				padding: .4vw 1.33vw;
				margin-right: 1.47vw;
				margin-bottom: 2vw;
				background: #FDECE0;
				border-radius: 0.53vw;
				font-size: 2.67vw;
				color: #C7835A;
			}

			>.address {
				font-size: 3.2vw;
				color: #666666;
				margin-bottom: 2vw;
			}

			>.info {
				font-weight: 500;
				font-size: 3.2vw;
				color: #666666;
				margin-bottom: 2vw;

				>.left {
					font-size: 3.2vw;
					color: #ED4133;

					>.star>.item {
						width: 3.2vw;
						height: 3.2vw;
						border-radius: 0.53vw;
						background: #F5F5F5;
						position: relative;
						margin-right: .27vw;
						overflow: hidden;

						&:last-child {
							margin-right: 1.33vw;
						}

						>.bg {
							width: 0;
							height: 100%;
							position: absolute;
							inset: 0;
							z-index: 1;
							background: #ED4133;
						}

						>image {
							width: 2.67vw;
							height: 2.67vw;
							position: absolute;
							z-index: 2;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}
				}
			}

			>.title {
				font-weight: 400;
				font-size: 4vw;
				color: #000000;
				margin-bottom: 2vw;

				>text {
					font-size: 2.67vw;
					padding-top: 1.34vw;
					color: #80CF40;
				}
			}
		}
	}
</style>