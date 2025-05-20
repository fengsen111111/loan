<template>
	<u-tabbar fixed placeholder :value="state.current" activeColor="#F97E39" @change="change">
		<u-tabbar-item :text="item.text" v-for="(item,index) in state.list" :key="index">
			<template #active-icon>
				<image :src="item.selectedIconPath" mode=""></image>
			</template>
			<template #inactive-icon>
				<image :src="item.iconPath" mode=""></image>
			</template>
		</u-tabbar-item>
	</u-tabbar>
</template>

<script lang="ts" setup>
	import { reactive, watch } from "vue";

	const props = defineProps({
		index: { type: Number, default: 0 }
	})

	const state = reactive({
		current: props.index,
		list: [
			{
				text: "首页",
				iconPath: "/static/home.png",
				selectedIconPath: "/static/home_active.png",
				pagePath: "/pages/user_home/index"
			}, {
				text: "我的",
				iconPath: "/static/mine.png",
				selectedIconPath: "/static/mine_active.png",
				pagePath: "/pages/mine/index"
			}
		],
		user_list: [
			{
				text: "首页",
				iconPath: "/static/home.png",
				selectedIconPath: "/static/home_active.png",
				pagePath: "/pages/user_home/index"
			}, {
				text: "我的",
				iconPath: "/static/mine.png",
				selectedIconPath: "/static/mine_active.png",
				pagePath: "/pages/mine/index"
			}
		],
		worker_list: [
			{
				text: "首页",
				iconPath: "/static/home.png",
				selectedIconPath: "/static/home_active.png",
				pagePath: "/pages/home/index"
			}, {
				text: "工作台",
				iconPath: "/static/work.png",
				selectedIconPath: "/static/work_active.png",
				pagePath: "/pages/work/index"
			}, {
				text: "我的",
				iconPath: "/static/mine.png",
				selectedIconPath: "/static/mine_active.png",
				pagePath: "/pages/mine/index"
			}
		],
	})

	watch(() => props.index, (newValue) => {
		if (newValue == 2) {
			state.list = state.worker_list;
		} else {
			state.list = state.user_list
		}
		state.current = newValue
	})
	
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const pagePath = currentPage.route;
	const tabbarPage = ["pages/home/index", "pages/mine/index", "pages/user_home/index",
		"pages/work/index"
	];
	if (tabbarPage.includes(pagePath)) {
		uni.hideTabBar();
	}

	if (uni.getStorageSync("userInfo") && uni.getStorageSync("userInfo").user_type.length>1 && uni.getStorageSync("appType") === 2) {
		state.list = state.worker_list;
	}
	if (uni.getStorageSync("first_in") && uni.getStorageSync("userInfo") && uni.getStorageSync("userInfo").user_type.length>1) {
		if (uni.getStorageSync("appType") === 2) {
			uni.reLaunch({
				url: "/pages/home/index"
			})
		} else {
			uni.reLaunch({
				url: "/pages/user_home/index"
			})
		}
		uni.removeStorageSync("first_in")
	}

	const change = (index : number) => {
		uni.switchTab({
			url: state.list[index].pagePath
		})
	}
</script>

<style lang="scss">
	image { 
		width: 6.4vw;
		height: 6.4vw;
	}
	.u-tabbar__content {
	  transition: none;
	}
	.u-tabbar-item:active{
	    background-color: transparent !important; /* 去除背景色 */
	}
</style>