<template>
	<view>
		<web-view :src="props.url"></web-view>
	</view>
</template>

<script setup lang="ts">
	const props = defineProps({
		url: {
			type: String
		}
	})
	if (!props.url) {
		uni.showToast({
			title: "链接无效",
			icon: "error",
			duration: 2000
		})
	}
</script>

<style>

</style>