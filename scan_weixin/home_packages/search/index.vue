<template>
	<view class="container">
		<view class="search">
			<view class="search_box flex alignCenter">
				<u-icon name="search" color="#999999" size="20"></u-icon>
				<input type="text" placeholder="输入关键词搜索门店" v-model="formData.key_word"
					placeholder-class="input_placeholder" confirm-type="search" @confirm="netWork()" />
			</view>
		</view>
		<FoodItem v-for="(item,index) in list" :key="index" :item="item" :index="index"></FoodItem>
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
					key_word: "",
					currentPage: 1,
					perPage: 10
				},
				total: 0,
				list: []
			};
		},
		onLoad(option) {
			this.formData.key_word = option.keyWords;
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
						})
					}
				})
			}
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
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS&gt;11.2*/

		>.search {
			padding: 2.8vw 4vw;
			background: #FFFFFF;
			position: sticky;
			top: 0;
			z-index: 3;

			>.search_box {
				height: 8vw;
				background: #F5F5F5;
				border-radius: 4.67vw;
				padding: 0 2.67vw;

				>input {
					flex: auto;
					margin-left: 1.2vw;
				}
			}
		}

		>.content {
			height: 10000px;
		}
	}
</style>