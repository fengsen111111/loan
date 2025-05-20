<template>
	<view class="navbar" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
		<u-icon name="arrow-left" size="5vw" color="#333333" @click="back()"></u-icon>
		{{props.title}}
		<view style="width: 5vw;"></view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, reactive } from "vue"

	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,
	})

	const props = defineProps({
		title: {
			default: "",
			type: String
		}
	})

	const back = () => {
		uni.navigateBack({
			fail: () => {
				console.log("返回首页")
				uni.switchTab({
					url: "/pages/home/index"
				})
			}
		})
	}
</script>

<style lang="scss">
	.navbar {
		padding: 0 4vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		left: 0;
		background: #FFFFFF;
		z-index: 20;
	}
</style>