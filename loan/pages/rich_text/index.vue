<template>
	<view class="content">
		<u-parse :content="state.html_content" class="html_content"></u-parse>
	</view>
</template>

<script setup lang="ts">
	import { reactive, getCurrentInstance } from "vue";
	import { onLoad } from "@dcloudio/uni-app"
	import { Result } from "@/utils/interface"

	const state = reactive({
		html_content: ``
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	onLoad((e : any) => {
		if (e.title) {
			uni.setNavigationBarTitle({
				title: e.title
			})
		}
		if (e.id) {
			globalProxy.$request(e.url, {
				banner_id: e.id
			}).then((res : Result) => {
				state.html_content = res.data.content
			})
		} else {
			globalProxy.$request(e.url).then((res : Result) => {
				state.html_content = res.data.content
			})
		}
	})
</script>

<style lang="scss" scoped>
	.content {
		padding: 7vw 4vw;
	}
</style>