<template>
	<view class="container">
		<image src="@/static/head_bg.jpg" alt="" class="head_bg"></image>
		<view class="gray"></view>
		<view class="head" :style="{paddingTop:statusBarHeight+'px',height:navigationBarHeight+'px'}">
			<image src="@/static/logo.png" alt="" />
		</view>
		<view class="userInfo flex alignCenter spaceBetween">
			<view class="left flex alignCenter">
				<button class="avatar" open-type="chooseAvatar" @chooseavatar="changeAvatar">
					<image :src="userInfo.head_image||require('@/static/avatar.png')" mode=""></image>
				</button>
				<view class="flex flexColumn" v-if="userInfo.id">
					<input type="nickname" v-model="userInfo.nickname" style="flex: auto;"
						@blur="changeNickname"></input>
					<text v-if="userInfo.mobile">{{userInfo.mobile}}</text>
					<button class="login" v-if="!userInfo.mobile" open-type="getPhoneNumber"
						@getphonenumber="getPhone">获取手机号</button>
				</view>
				<button class="login" v-if="!userInfo.id" open-type="getUserInfo" @getuserinfo="login()">立即登录</button>
			</view>
			<image src="@/static/qrcode.png" mode="" @click="openShare()"></image>
		</view>
		<view class="wallet flex alignCenter spaceEvenly">
			<view class="item flex flexColumn alignCenter" @click="$nav('/mine_packages/wallet/index')">
				<image src="@/static/wallet.png" mode=""></image>
				钱包
				<text>余额 {{userInfo.money || 0}}</text>
			</view>
			<view class="vertical"></view>
			<view class="item flex flexColumn alignCenter" @click="$nav('/mine_packages/discount/index')">
				<image src="@/static/mine_discount.png" mode=""></image>
				优惠卷
				<text>{{userInfo.coupon_number || 0}} 张</text>
			</view>
			<view class="vertical"></view>
			<view class="item flex flexColumn alignCenter" @click="$nav('/mine_packages/collect/index')">
				<image src="@/static/collect.png" mode=""></image>
				收藏
				<text>{{userInfo.collection_number || 0}} 家</text>
			</view>
		</view>
		<view class="recharge flex alignCenter spaceBetween">
			充值赠送活动
			<view class="pay" @click="$nav('/mine_packages/charge/index')">充值</view>
		</view>
		<view class="option flex alignCenter spaceBetween" @click="$nav('/mine_packages/points/index')">
			<view class="left flex alignCenter">
				<image src="@/static/points.png" mode=""></image>
				积分商城
			</view>
			<view class="right">
				<text style="margin-right: 2.53vw;">剩余积分：{{integral}}</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="option flex alignCenter spaceBetween" @click="$nav('/mine_packages/distributive/index')">
			<view class="left flex alignCenter">
				<image src="@/static/team.png" mode=""></image>
				我的分销
			</view>
			<u-icon name="arrow-right"></u-icon>
		</view>
		<view class="option flex alignCenter spaceBetween"
			@click="$nav('/mine_packages/manage/index',{store_id:userInfo.store_id})" v-if="userInfo.is_worker === 'Y'">
			<view class="left flex alignCenter">
				<image src="@/static/shop.png" mode=""></image>
				门店管理
			</view>
			<u-icon name="arrow-right"></u-icon>
		</view>

		<view class="option flex alignCenter spaceBetween">
			<view class="left flex alignCenter">
				是否接受公众号通知
			</view>
			<u-switch v-model="accpet" activeColor="#EFA246" @change="changeSwitch"></u-switch>
		</view>


		<view class="popup" v-if="qrCodeShow">
			<image :src="userInfo.share_image" mode=""></image>
			<view class="save" @click="save()">保存到手机</view>
			<view class="close" @click="qrCodeShow=false">
				<u-icon name="close" size="5.48vw" color="#FFFFFF"></u-icon>
			</view>
		</view>
		<view class="mask" v-if="qrCodeShow" @click="qrCodeShow=false"></view>
		<CanvasImage :show="canvasShow" :qrCode="userInfo.share_image" @close="canvasShow = false"></CanvasImage>
	</view>
</template>

<script>
	import CanvasImage from '@/components/CanvasImage.vue';
	export default {
		components: {
			CanvasImage
		},
		data() {
			return {
				statusBarHeight: 0,
				navHeight: 0,
				navigationBarHeight: 0,
				qrCodeShow: false,
				userInfo: {
					id: "",
					nickname: "",
					head_image: "",
					money: "",
					all_share_money: "",
					share_money: "",
					coupon_number: "",
					collection_number: "",
					share_image: "",
					is_worker: "",
					store_id: ""
				},
				integral: 0,
				accpet: false,
				canvasShow: false,
			};
		},
		onLoad(option) {
			if (option.scene) {
				let param = decodeURIComponent(option.scene)
				let str = param.split("?")[1];
				let obj = {};
				let arr = str.split('&');
				for (let i = 0; i < arr.length; i++) {
					obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
				}
				if (obj.zysk === "1") {
					uni.setStorageSync("pid", obj.pid);
				}
			}
			const app = getApp().globalData;
			this.statusBarHeight = app.statusBarHeight;
			this.navigationBarHeight = app.navigationBarHeight;
			this.navHeight = app.navHeight;
		},
		onShow() {
			if (uni.getStorageSync("token")) {
				this.getUserInfo();
			}
		},
		methods: {
			async login() {
				const {
					code
				} = await uni.login();
				const {
					mini_openid
				} = await this.$request("/factory_system/Base/wechatUserRegister", {
					code,
					platform: "mini"
				})
				uni.setStorageSync("openId", mini_openid);
				const {
					token
				} = await this.$request("/food/User/loginAndRegister", {
					openid: mini_openid
				})
				uni.setStorageSync("token", token);
				this.getUserInfo();
			},
			async getPhone(e) {
				const code = e.detail.code
				const {
					phone_number
				} = await this.$request("/factory_system/Base/getWechatPhoneNumber", {
					platform: "mini",
					code,
					mini_openid: uni.getStorageSync("openId")
				})
				this.userInfo.mobile = phone_number;
				await this.$request("/food/User/updateUserInfo", {
					mobile: phone_number
				})
			},

			async getUserInfo() {
				if (uni.getStorageSync("pid")) {
					this.userInfo = await this.$request("/food/User/getUserInfo", {
						pid: uni.getStorageSync("pid")
					})
					if (this.userInfo.need_wechat_notice === "Y") {
						this.accpet = true;
					} else {
						this.accpet = false;
					}
					this.$request("/food/User/getUserIntegral").then(res => {
						this.integral = res.integral;
					})
					uni.removeStorageSync("pid")
				} else {
					this.userInfo = await this.$request("/food/User/getUserInfo")
					if (this.userInfo.need_wechat_notice === "Y") {
						this.accpet = true;
					} else {
						this.accpet = false;
					}
					this.$request("/food/User/getUserIntegral").then(res => {
						this.integral = res.integral;
					})
				}
			},
			changeAvatar(e) {
				uni.showLoading({
					title: "上传中，请稍后……"
				})
				const name_array = e.detail.avatarUrl.split("/");
				const name = name_array[name_array.length - 1]
				this.$request("", {
					file: e.detail.avatarUrl,
					fileType: "file",
					params: {
						fileSize: 0,
						fileName: name,
					}
				}).then((result) => {
					this.$request("/food/User/updateUserInfo", {
						head_image: result.url
					}).then(() => {
						uni.hideLoading()
						this.getUserInfo()
					})
				})
				uni.hideLoading()
			},
			changeNickname() {
				setTimeout(() => {
					this.$request("/food/User/updateUserInfo", {
						nickname: this.userInfo.nickname
					}).then(() => {
						this.getUserInfo()
					})
				}, 200)
			},
			save() {
				if (!this.userInfo.share_image) return;
				uni.downloadFile({
					url: this.userInfo.share_image,
					success: async res => {
						await uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath
						})
						uni.showToast({
							title: "保存成功",
							icon: "success"
						})
					}
				})
			},
			changeSwitch() {
				this.$request("/food/User/changeSendNoticeStatus", {
					need_wechat_notice: this.accpet ? "Y" : "N"
				}).then(res => {
					if (res.already_follow_offical_count && res.already_follow_offical_count === "N") {
						console.log(encodeURIComponent(this.userInfo.wechat_host + "/?type=wechat&user_id" +
							this.userInfo.id))
						this.$nav("/pages/WebPage/index", {
							url: encodeURIComponent(this.userInfo.wechat_host + "/?type=wechat&user_id=" +
								this.userInfo.id)
						})
					}
				})
			},
			openShare() {
				// this.qrCodeShow = true;
				this.canvasShow = true;
			}
		}
	}
</script>

<style lang="scss">
	.mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 98
	}

	.popup {
		width: 80vw;
		height: 88vw;
		background: #FFFFFF;
		border-radius: 2.67vw;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 99;
		display: flex;
		justify-content: center;
		flex-direction: column;

		>.save {
			width: 53.33vw;
			height: 8vw;
			line-height: 8vw;
			text-align: center;
			background: #EFA246;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #FFFFFF;
			margin: 0 auto;
		}

		>image {
			width: 53.33vw;
			height: 53.33vw;
			margin: 8vw auto 10.67vw;
		}

		>.close {
			position: absolute;
			bottom: -15.47vw;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.container {
		height: 100vh;
		background-color: #F5F5F5;

		>.option {
			width: 86.66vw;
			padding: 2.8vw 2.67vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			margin: 0 auto 2.67vw;

			>.right {
				display: flex;
				align-items: center;
				font-weight: 400;
				font-size: 2.67vw;
				color: #000000;
			}

			>.left {
				font-weight: 400;
				font-size: 4vw;
				color: #000000;

				>image {
					max-width: 6.67vw;
					max-height: 5.33vw;
					margin-right: 2.67vw;
				}
			}
		}

		>.recharge {
			width: 86.66vw;
			font-weight: 500;
			font-size: 3.2vw;
			color: #ED1805;
			position: relative;
			padding: 0 2.67vw;
			height: 8vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			margin: 1.33vw auto 2.67vw;

			>.pay {
				width: 13.33vw;
				height: 5.33vw;
				line-height: 5.33vw;
				text-align: center;
				background: #000000;
				border-radius: 6vw;
				font-weight: bold;
				font-size: 3.2vw;
				color: rgb(245, 232, 174);
			}
		}

		>.wallet {
			width: 92vw;
			margin: 0 auto;
			position: relative;
			background: #FFFFFF;
			border-radius: 1.33vw;
			padding: 3.73vw 0;

			>.vertical {
				width: 0.13vw;
				height: 16vw;
				background: #999999;
				border-radius: 1.33vw;
			}

			>.item {
				font-weight: 400;
				font-size: 2.67vw;
				color: #000000;

				>image {
					width: 5.33vw;
					height: 5.33vw;
					margin-bottom: 1.33vw;
				}

				>text {
					font-weight: bold;
					font-size: 2.67vw;
					color: #000000;
					margin-top: 1.33vw;
				}
			}
		}

		>.userInfo {
			width: 86.66vw;
			height: 16.53vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			margin: 5.47vw auto 2.67vw;
			position: relative;
			padding: 0 2.67vw;

			>image {
				width: 5.23vw;
				height: 5.23vw;
			}

			>.left {
				font-weight: 400;
				font-size: 3.2vw;
				color: #000000;

				>.login {
					font-size: 3.27vw;
					padding: 2vw 3vw;
					border: solid 2px #F4C147;
					border-radius: 2vw;
				}

				>view {
					>.login {
						font-size: 2.27vw;
						padding: 1vw 2vw;
						border: solid 2px #F4C147;
						border-radius: 2vw;
					}
				}

				>.avatar {
					&::after {
						border: none;
					}

					image {
						width: 12vw;
						height: 12vw;
						border-radius: 50%;
						margin-right: 2.67vw;
					}
				}

				text {
					font-size: 2.67vw;
				}
			}
		}

		.head_bg {
			width: 100%;
			height: 74.8vw;
			position: fixed;
			inset: 0;
		}

		.gray {
			position: absolute;
			top: 65vw;
			width: 100%;
			height: 10vw;
			background: #F5F5F5;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
		}

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 3.33vw;
			padding-right: 3.33vw;
			position: relative;
			margin-bottom: 1.67vw;

			>image {
				width: 16.93vw;
				height: 8.53vw;
			}
		}
	}
</style>