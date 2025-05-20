<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="head" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
			<u-icon name="arrow-left" size="5vw" color="#FFFFFF" @click="$back()"></u-icon>
			云助手
			<view style="width: 5vw;"></view>
		</view>
		<view class="tips">
			<image src="@/home_packages/static/assistant_bg.png" mode=""></image>
			<view class="text">
				<view class="big_text">智能&nbsp;&nbsp;高效&nbsp;&nbsp;便捷</view>
				<view class="small_text">请选择您需要的帮手服务吧</view>
			</view>
		</view>
		<view class="option">
			<view class="item" @click="state.popup_state = true">
				<view class="left">
					<image src="@/static/assis_icon.png" mode=""></image>
					<view class="title">
						在线公证
						<text>专业贷后保障 安心无忧还款</text>
					</view>

				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
		</view>


		<view class="notice_popup" v-show="state.popup_state">
			<view class="head">
				公告
			</view>
			<scroll-view scroll-y="true" style="max-height: 90vw;min-height: 70vw;">
				<u-parse :content="state.html_content" class="html_content" noData="暂无公告"></u-parse>
			</scroll-view>
			<view class="close" @click="state.popup_state = false">我知道了</view>
		</view>
		<view class="mask" v-show="state.popup_state"></view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from "vue";

	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,

		popup_state: false,
		html_content: ``
	})
</script>

<style lang="scss">
	.container {

		>.mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 98;
		}

		>.notice_popup {
			position: fixed;
			width: 76.26vw;
			padding: 2.8vw 3.87vw 4.4vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;

			.html_content {
				word-break: break-all;
			}

			>.close {
				position: absolute;
				bottom: -12.54vw;
				width: 26.67vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				display: flex;
				align-items: center;
				justify-content: center;
				left: 50%;
				transform: translateX(-50%);
				font-weight: bold;
				font-size: 3.73vw;
				color: #FFFFFF;
			}

			>.head {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 2.8vw;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
			}
		}

		>.option {
			position: relative;
			padding: 0 4vw;

			>.item {
				padding: 0 2.67vw 0 4vw;
				height: 18.67vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.left {
					display: flex;
					align-items: center;

					>.title {
						display: flex;
						flex-direction: column;
						margin-left: 4vw;
						font-weight: bold;
						font-size: 3.47vw;
						color: #333333;

						>text {
							font-weight: 400;
							font-size: 3.2vw;
							color: #666666;
						}
					}

					>image {
						width: 10.8vw;
						height: 10.8vw;
					}
				}
			}
		}

		>.tips {
			width: 100%;
			height: 42.11vw;
			position: relative;
			margin-top: 4vw;
			display: flex;
			align-items: center;

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