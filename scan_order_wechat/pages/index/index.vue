<template>
	<view class="container">
		<view class="content" v-if="flag">
			<image src="@/static/logo.png" class="logo"></image>
			<img :src="wechat_image" alt="" show-menu-by-longpress @click="previewImg()" class="qrcode">
			<view class="text">长按识别扫码关注公众号</view>
		</view>
		<view class="content" v-show="popShow" style="padding: 4vw 0;">
			<image :src="wechat_image" class="image"></image>
			<button class="btn">打开小程序点餐</button>
			<wx-open-launch-weapp id="launch-btn" appid="wx56308ebac0069f92" username="gh_d27ce3ed1af7"
				:extra-data="JSON.stringify({...info,type:'scan'})" path="/home_packages/shop_detail/index"
				style="position:absolute;top:0;left:0;width:100%;height:100%">
				<component :is="'script'" v-bind="{type:'text/wxtag-template'}">
					<view style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0"></view>
				</component>
			</wx-open-launch-weapp>
		</view>
	</view>
</template>

<script>
	import wxj from "@/utils/jweixin-1.6.0.js"
	export default {
		data() {
			return {
				wechat_image: "",
				flag: false,
				popShow: false,
				info: {}
			}
		},
		onLoad() {
			let str = location.href.split("?")[1];
			let obj = {};
			let arr = str.split('&');
			for (let i = 0; i < arr.length; i++) {
				obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
			}
			if (!obj.code) {
				uni.setStorageSync("tableInfo", obj);
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxeb40583ae744fcc5' +
					'&redirect_uri=' + encodeURIComponent(location.href.split("?")[0]) +
					'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
			} else {
				this.info = uni.getStorageSync("tableInfo");
				if (this.info.type === "wechat") {
					this.$request("/food/User/bindOpenid", {
						user_id: this.info.user_id.split("#")[0],
						code: obj.code
					}).then(res => {
						if (res.result === 0) {
							this.wechat_image = res.wechat_image;
							this.flag = true
						} else {
							uni.showToast({
								title: "授权成功，将自动返回",
								icon: "none"
							})
							setTimeout(() => {
								wxj.miniProgram.switchTab({
									url: "/pages/Mine/index"
								})
							}, 1000)
						}
					})
				} else {
					this.$nextTick(async () => {
						const {
							mp_openid
						} = await this.$request("/factory_system/Base/wechatUserRegister", {
							platform: "mp",
							code: obj.code
						})
						const {
							result,
							wechat_image
						} = await this.$request("/food/User/bindScanMsg", {
							...this.info,
							openid: mp_openid
						})
						this.wechat_image = wechat_image;
						if (result === 0) {
							this.flag = true;
						} else {
							this.$request("/factory_system/Base/buildJsSdkConfig", {
								apis: ['checkJsApi'],
								tags: ['wx-open-launch-weapp'],
								url: location.href.split("#")[0]
							}).then(res => {
								wxj.config({
									...res,
									// debug: true
								})
								this.popShow = true
								this.$nextTick(() => {
									var btn = document.getElementById('launch-btn');
									btn.addEventListener('launch', function(e) {
										console.log('success');
									});
									btn.addEventListener('error', function(e) {
										console.log('fail', e.detail);
									});
								})
							})
						}
					})
				}
			}
		},
		methods: {
			previewImg() {
				uni.previewImage({
					urls: [this.wechat_image]
				})
			},
			onLaunch(e) {
				console.log('success');
			},
			onError(e) {
				console.log("fail", e.detail)
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;

		>.content {
			width: 92vw;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #FFFFFF;
			padding: 8vw 0 18vw;
			border-radius: 2.67vw;

			>.text {
				margin-top: 8vw;
				font-weight: bold;
				font-size: 4.8vw;
				color: #000000;
			}

			>.logo {
				width: 33.6vw;
				height: 33.6vw;
				margin-bottom: 2.67vw;
			}

			>.qrcode {
				width: 50vw;
				height: 50vw;
			}
		}
	}

	.mask {
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.popup {
		width: 84vw;
		padding: 3vw;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #ffffff;
		z-index: 2
	}
</style>