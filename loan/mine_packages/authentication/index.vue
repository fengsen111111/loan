<template>
	<view class="container">
		<navbar title="认证管理"></navbar>
		<view class="content">
			<!--  @click="$navigateTo('/mine_packages/phone_auth/index')" -->
			<view class="list">
				<view class="left">
					<image src="@/mine_packages/static/icon1.png" mode=""></image>
					手机认证
				</view>
				<view class="right">
					<view class="type" style="color: #109181;">
						已认证
						<view class="text">{{state.userInfo.mobile}}</view>
					</view>
					<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<view class="list" @click="$navigateTo('/mine_packages/realname_auth/index')">
				<view class="left">
					<image src="@/mine_packages/static/icon2.png" mode=""></image>
					实名认证
				</view>
				<view class="right">
					<view class="type">
						未认证
						<view class="text"></view>
					</view>
					<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			 <!-- @click="$navigateTo('/mine_packages/wechat_auth/index')" -->
			<view class="list">
				<view class="left">
					<image src="@/mine_packages/static/icon3.png" mode=""></image>
					微信绑定
				</view>
				<view class="right">
					<view class="type" style="color: #109181;">
						已绑定
						<view class="text"></view>
					</view>
					<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>
<!--创建时间：2024-03-31 14:49:10-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive } from "vue"

	const state = reactive({
		current: 1,
		userInfo:uni.getStorageSync("userInfo")
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 4vw;

			>.list {
				height: 12vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding: 0 4vw;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4vw;

				>.left {
					display: flex;
					align-items: center;
					font-weight: bold;
					font-size: 3.47vw;
					color: #333333;

					>image {
						max-width: 5.33vw;
						max-height: 5.33vw;
						margin-right: 5vw;
					}
				}

				>.right {
					display: flex;
					align-items: center;

					>.type {
						/* display: flex;
						align-items: center;
						flex-direction: column; */
						text-align: right;
						justify-content: flex-end;
						font-weight: bold;
						font-size: 2.67vw;
						color: #FF8177;
						margin-right: 5vw;

						>.text {
							font-weight: 400;
							font-size: 2.67vw;
							color: #999999;
						}
					}
				}
			}
		}
	}
</style>