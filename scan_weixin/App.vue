<script>
	export default {
		globalData: {
			statusBarHeight: 0, // 状态导航栏高度
			navHeight: 0, // 总体高度
			navigationBarHeight: 0, // 导航栏高度(标题栏高度)
		},
		onLaunch: function() {
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
		},
		onShow: function() {
			console.log('App Show')
			const extraData = uni.getEnterOptionsSync().referrerInfo.extraData
			if (extraData && extraData.type === 'scan') {
				uni.setStorageSync("scanInfo", {
					seat_code: extraData.seat_code.split("#")[0],
					seat_id: extraData.seat_id,
					store_id: extraData.store_id,
					type: extraData.type
				})
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		onUnload() {
			console.log("App Unload")
			uni.removeStorageSync("dataNot")
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	button {
		width: fit-content;
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: normal;
		background-color: transparent;
	}

	.input_placeholder {
		font-size: 3.5vw;
	}

	.flex {
		display: flex;
	}

	.alignCenter {
		align-items: center;
	}

	.justifyCenter {
		justify-content: center;
	}

	.spaceBetween {
		justify-content: space-between;
	}

	.spaceAround {
		justify-content: space-around;
	}

	.spaceEvenly {
		justify-content: space-evenly;
	}

	.flexWrap {
		flex-wrap: wrap;
	}

	.flexColumn {
		flex-direction: column;
	}

	.flexEnd {
		align-items: flex-end;
	}
</style>