<template>
	<view class="container">
		<navbar title="实名认证"></navbar>
		<view class="content">
			<view class="form">
				<view class="card">
					<view class="item">
						点击上传身份证正面
						<text>（人像）</text>
					</view>
					<view class="item">
						点击上传身份证背面
						<text>（国徽）</text>
					</view>
				</view>
				<view class="info">
					<view class="label">姓名</view>
					<view class="value"></view>
				</view>
				<view class="info">
					<view class="label">身份证号码</view>
					<view class="value"></view>
				</view>
			</view>
			<view class="btn">确定</view>
		</view>

		<view class="popup" v-if="state.popup_show">
			<view class="title">
				<view style="width: 5vw;"></view>
				{{state.type===1?'认证成功':'认证失败'}}
				<u-icon name="close" color="#666666" size="5vw" @click="state.popup_show=false"></u-icon>
			</view>
			<image :src="state.type===1?'/mine_packages/static/success.png':'/mine_packages/static/fail.png'" mode="">
			</image>
			<view class="text">{{state.type===1?'认证已通过':'信息有误，请修改后再重试'}}</view>

			<view class="confirm" @click="state.popup_show=false">确定</view>
		</view>
		<view class="mask" v-if="state.popup_show"></view>
	</view>
</template>
<!--创建时间：2024-03-31 16:15:24-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive } from "vue"

	const state = reactive({
		current: 1,
		popup_show: true,
		type: 1
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.mask {
			width: 100vw;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 98;
		}

		>.popup {
			width: 76vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
			padding: 2.67vw 4vw;

			>.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
				margin-bottom: 4vw;
			}

			>image {
				margin: 0 auto;
				width: 26.4vw;
				height: 32.27vw;
				display: block;
			}

			>.text {
				text-align: center;
				margin: 4.53vw 0 2.67vw;
			}

			>.confirm {
				width: 78.67vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				line-height: 8vw;
				text-align: center;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
			}
		}

		>.content {
			padding: 4vw;

			>.btn {
				width: 80vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				text-align: center;
				line-height: 8vw;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
				margin: 5.33vw auto;
			}

			>.form {
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding: 2.67vw;

				>.info {
					display: flex;
					align-items: center;
					margin-bottom: 8vw;
					font-weight: 500;
					font-size: 3.2vw;
					color: #333333;

					>.label {
						width: 20vw;
						display: flex;
						align-items: center;

						&:before {
							content: "*";
							font-weight: 500;
							font-size: 3.2vw;
							color: #FF8177;
						}
					}
				}

				>.card {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 5.33vw;

					>.item {
						width: 40.8vw;
						height: 22.93vw;
						border-radius: 1.33vw;
						border: 1px dotted #999999;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						font-weight: bold;
						font-size: 3.2vw;
						color: #999999;
					}
				}
			}
		}
	}
</style>