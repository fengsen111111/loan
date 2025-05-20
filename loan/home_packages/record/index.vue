<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="head" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
			<u-icon name="arrow-left" size="5vw" color="#FFFFFF" @click="$back()"></u-icon>
			数据通
			<view style="width: 5vw;"></view>
		</view>
		<view class="tips">
			<image src="@/home_packages/static/record_bg.png" mode=""></image>
			<view class="text">
				<view class="big_text">真实可靠</view>
				<view class="small_text">为您提供全面深入的信息支持</view>
			</view>
		</view>
		<view class="option">
			<view class="item" @click="jump(item.path)" v-for="(item,index) in state.list" :key="index">
				<view class="left">
					<image :src="item.icon" mode="aspectFill"></image>
					<view class="title">{{item.title}}</view>
				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
		</view>

		<view class="tips_popup" v-if="state.popup_state">陆续开放中，敬请期待！</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from "vue";

	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,

		popup_state: false,
		timer: null,

		list: [
			{
				icon: "/home_packages/static/icon1.png",
				title: "智能风控报告查询",
				path: ""
			},
			{
				icon: "/home_packages/static/icon2.png",
				title: "企业智能风控报告查询",
				path: ""
			},
			{
				icon: "/home_packages/static/icon3.png",
				title: "个人法诉报告查询",
				path: ""
			},
			{
				icon: "/home_packages/static/icon4.png",
				title: "公积金查询",
				path: ""
			},
			{
				icon: "/home_packages/static/icon5.png",
				title: "房屋评估",
				path: ""
			}
		]
	})

	const jump = (url : string) => {
		if (state.timer !== null) {
			clearTimeout(state.timer);
		}
		if (url === "") {
			state.popup_state = true;
			state.timer = setTimeout(() => {
				state.popup_state = false;
			}, 2000)
		}
	}
</script>

<style lang="scss">
	.container {

		>.tips_popup {
			position: fixed;
			min-width: 60vw;
			max-width: 80vw;
			padding: 1.6vw 0;
			display: flex;
			justify-content: center;
			background: rgba(102, 102, 102, .8);
			border-radius: 1.33vw;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
			font-weight: bold;
			font-size: 3.47vw;
			color: #FFFFFF;
		}

		>.option {
			position: relative;
			padding: 0 4vw;

			>.item {
				padding: 0 2.67vw 0 4vw;
				height: 12vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4vw;

				>.left {
					display: flex;
					align-items: center;

					>.title {
						margin-left: 4vw;
						font-weight: bold;
						font-size: 3.47vw;
						color: #333333;
					}

					>image {
						width: 7vw;
						height: 7vw;
					}
				}
			}
		}

		>.tips {
			width: 100%;
			height: 46.88vw;
			position: relative;
			margin-top: 4vw;
			display: flex;
			align-items: center;
			margin-bottom: 2.13vw;

			>.text {
				padding-left: 8vw;

				>.big_text {
					font-weight: bold;
					font-size: 5.33vw;
					color: #FFFFFF;
					margin-bottom: 1.73vw;
				}

				>.small_text {
					font-size: 3.47vw;
					color: #FFF7F3;
					opacity: .8;
				}
			}

			>image {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
		}

		>.head {
			width: 92vw;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: sticky;
			top: 0;
			left: 0;
			font-size: 4.8vw;
			color: #FFFFFF;
		}

		>.bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>