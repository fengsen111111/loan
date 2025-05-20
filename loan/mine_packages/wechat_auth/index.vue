<template>
	<view class="container">
		<navbar title="微信绑定"></navbar>
		<view class="info" v-if="state.type===1">
			绑定时间
			<view class="date">2023-12-16 12:16:16</view>
		</view>
		<view class="content" v-if="state.type===2">
			<image src="@/mine_packages/static/wecaht.png" mode=""></image>
			<view class="text">绑定微信号</view>
			绑定微信后可以使用一键登录
		</view>
		<view class="btn">{{state.type===1?'解除绑定':'绑定'}}</view>
	</view>
</template>
<!--创建时间：2024-03-31 16:29:51-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive } from "vue"

	const state = reactive({
		type: 2
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			margin-top: 13.87vw;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-weight: 500;
			font-size: 3.2vw;
			color: #333333;
			margin-bottom: 4.13vw;

			>image {
				width: 34vw;
				height: 34vw;
			}

			>.text {
				font-weight: bold;
				font-size: 3.73vw;
				margin: 4.13vw 0 1.73vw;
			}
		}

		>.info {
			margin: 4vw 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 8vw;
			background: #FFFFFF;
			padding: 0 4vw;
			font-weight: 500;
			font-size: 3.2vw;
			color: #333333;
		}

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
			margin: 0 auto;
		}
	}
</style>