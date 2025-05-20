<template>
	<view class="content">
		<u-parse :content="html_content" class="html_content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				html_content: ``
			};
		},
		onLoad(option) {
			if (option.title) {
				uni.setNavigationBarTitle({
					title: option.title
				})
			}
			if (option.id) {
				this.$request(option.url, {
					id: option.id
				}).then((res) => {
					this.html_content = res.jump_data
				})
			} else {
				this.$request(option.url).then((res) => {
					this.html_content = res.jump_data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 7vw 4vw;
	}
</style>