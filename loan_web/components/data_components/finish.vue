<template>
	<view class="finish">
		<view class="content">
			<image src="@/home_packages/static/finish.png" mode=""></image>
			<view class="title">进件成功</view>
			订单已生成，请联系专属客户经理进行提款操作
		</view>
		<optionBt @confirm="nextStep()" confirmText="返回首页" confirmBgColor="#F97E39"></optionBt>
	</view>
</template>
<!--创建时间：2024-03-30 16:03:56-->
<script setup lang="ts">
	import optionBt from "@/components/option-bt.vue"
	import { defineEmits } from "vue"
	const emits = defineEmits(["next"]);
	const nextStep = () => {
		emits("next");
	}
</script>
<style lang='scss'>
	.finish {
		height: 50vh;
		display: flex;
		align-items: center;
		justify-content: center;

		>.content {
			font-weight: 400;
			font-size: 3.47vw;
			color: #333333;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			>image {
				width: 60vw;
				height: 60vw;
			}

			>.title {
				font-weight: bold;
				font-size: 4vw;
				margin-bottom: 1.6vw;
			}
		}
	}
</style>