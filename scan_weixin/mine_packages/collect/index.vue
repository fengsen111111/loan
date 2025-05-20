<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<FoodItem v-for="(item,index) in list" :key="index" :item="item" :index="index" collect></FoodItem>
	</view>
</template>

<script>
	import FoodItem from '@/components/FoodItem.vue';
	export default {
		components: {
			FoodItem
		},
		data() {
			return {
				formData: {
					location: "",
					is_collection: "Y",
					currentPage: 1,
					perPage: 10
				},
				list: []
			};
		},
		onLoad() {
			this.netWork();
		},
		methods: {
			netWork() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.formData.location = res.longitude + "," + res.latitude;
						this.$request("/food/Store/getStoreList", this.formData).then(res => {
							this.total = res.count;
							if (this.formData.currentPage === 1) {
								this.list = res.list;
							} else {
								this.list = this.list.concat(res.list);
							}
							this.freshFlag = false
						}).catch(() => {
							this.freshFlag = false
						})
					}
				})
			},
		},
		onReachBottom() {
			if (this.formData.currentPage < Math.ceil(this.total / this.formData.perPage)) {
				this.formData.currentPage++;
				this.netWork();
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;
	}
</style>