<script>
	export default {
		globalData: {
			statusBarHeight: 0, // 状态导航栏高度
			navHeight: 0, // 总体高度
			navigationBarHeight: 0, // 导航栏高度(标题栏高度)
		},
		onLaunch: function() {
			uni.setStorageSync("first_in", true);
			// 状态栏高度
			this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight

			// #ifdef MP-WEIXIN
			// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
			const custom = uni.getMenuButtonBoundingClientRect()
			// console.log(custom)

			// 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
			this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2
			// console.log("导航栏高度："+this.globalData.navigationBarHeight)

			// 总体高度 = 状态栏高度 + 导航栏高度
			this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
			// #endif
			uni.setStorageSync("hideTabbar", true);

			if (!uni.getStorageSync("appType")) {
				uni.setStorageSync("appType", 1)
			}
		},
		onShow: function() {
			if (uni.getStorageSync("hideTabbar")) {
				uni.hideTabBar();
				uni.removeStorageSync("hideTabbar")
			} else {
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				const pagePath = currentPage.route;
				const tabbarPage = ["pages/home/index", "pages/mine/index", "pages/user_home/index",
					"pages/work/index"
				];
				if (tabbarPage.includes(pagePath)) {
					uni.hideTabBar();
				}
			}
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-plus/index.scss";

	.u-radio {
		margin-right: 5vw;
	}

	button {
		width: fit-content;
		margin-left: 0;
		margin-right: 0;
		background-color: transparent;
		padding-left: 0;
		padding-right: 0;
		outline: none;
		border: none;

		&::after {
			border: none;
		}

		&:active {
			background-color: transparent;
		}
	}
</style>