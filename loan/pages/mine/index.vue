<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="navbar" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
		</view>

		<view class="content">
			<button class="userInfo" @getuserinfo="getUser" open-type="getUserInfo" v-if="!state.openId&&!state.token">
				<view class="avatar">
					<image src="@/static/user.png" mode=""></image>
				</view>
				<text style="color:#FFFFFF;margin-left: 2.67vw;font-weight: bold;font-size: 4vw;">登录</text>
			</button>
			<button class="userInfo" @getphonenumber="getPhone" open-type="getPhoneNumber"
				v-else-if="state.openId&&!state.userInfo.id&&!state.token">
				<view class="avatar">
					<image src="@/static/user.png" mode=""></image>
				</view>
				<text style="color:#FFFFFF;margin-left: 2.67vw;font-weight: bold;font-size: 4vw;">获取手机号</text>
			</button>

			<view class="userInfo" v-else>
				<button class="avatar" open-type="chooseAvatar" @chooseavatar="changeAvatar">
					<image :src="state.userInfo.head_image" mode="" style="width: 100%;height: 100%;"></image>
				</button>
				<input type="nickname" v-model="state.nickName" style="flex: auto;" @change="getNickname"
					@blur="changeNickname"></input>
			</view>

			<view class="option">
				<view class="item"
					@click="navTo('/mine_packages/signing/index',{id:item.loan_type_id,title:item.label})"
					v-for="(item,index) in state.userInfo.types_order_number" :key="index">
					<view class="line" v-if="item.type==='line'"></view>
					<image :src="item.icon" mode="" v-else></image>
					<view class="text">{{item.label}}</view>
					{{item.order_number}}
				</view>
				<view class="item" @click="state.popup_not_open = true"
					v-if="state.userInfo.id&&state.userInfo.user_type.length === 1 || state.appType === 1">
					<image src="@/static/mine_icon123.png" mode=""></image>
					<view class="text">公证订单</view>
					{{state.userInfo.e_order_number}}
				</view>
			</view>
			<view class="list" @click="$navigateTo('/mine_packages/message/index',true)">
				<image src="@/static/mine_icon4.png" mode=""></image>
				<view class="title">我的消息</view>
				<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="$navigateTo('/mine_packages/schedule/index',true)">
				<image src="@/static/mine_icon5.png" mode=""></image>
				<view class="title">查询进度</view>
				<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
			</view>
			<view class="list"
				@click="$navigateTo('/pages/rich_text/index',{url:'/loan/Setting/aboutUs',title:'关于我们'})">
				<image src="@/static/mine_icon6.png" mode=""></image>
				<view class="title">关于我们</view>
				<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="changeAppType(1)"
				v-if="state.appType === 2 && state.userInfo.id && state.userInfo.user_type.length>2">
				<image src="@/static/mine_icon7.png" mode=""></image>
				<view class="title">切换用户端</view>
				<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="changeAppType(2)"
				v-if="state.appType === 1 && state.userInfo.id && state.userInfo.user_type.length>2">
				<image src="@/static/mine_icon7.png" mode=""></image>
				<view class="title">切换经纪人端</view>
				<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
			</view>
			
			<!-- <view class="" @click="$navigateTo('/home_packages/data_entry/index')">
				数据录入
			</view> -->
		    <!--  <view class="" @click="$navigateTo('/home_packages/contract/index')">
				合同确认
			</view> -->
			<!-- <view class="" @click="$navigateTo('/home_packages/add_bank_card/index')" >
				新增银行卡
			</view> -->
			<!-- <view @click="$navigateTo('/mine_packages/order_detail/index?id=756085948319533269')" >
				订单详情
			</view> --> 
			<!-- <view @click="$navigateTo('/home_packages/add_house/index')">vvv</view> -->
			<!-- <div @click="$navigateTo('/home_packages/add_house/index',{type:1})">新增房产信息</div> -->
		</view>

		<view class="open_popup" v-if="state.popup_not_open">
			<view class="title">
				<view style="width: 5vw;"></view>
				暂未开放
				<u-icon name="close" size="5vw" color="#666666" @click="state.popup_not_open=false"></u-icon>
			</view>
			<image src="@/static/load.png" mode=""></image>
			<view class="text">当前功能暂未开放</view>
			<view class="confirm" @click="state.popup_not_open=false">确定</view>
		</view>
		<view class="mask" v-show="state.popup_not_open" @click="state.popup_not_open=false"></view>

		<Tabbar :index="state.tab_index"></Tabbar>
	</view>
</template>
<!--创建时间：2024-03-31 10:17:31-->
<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import { reactive, getCurrentInstance } from "vue"
	import { Result } from "@/utils/interface"
	import Tabbar from "@/components/tabbar.vue";
	
	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,
		popup_state: false,
		html_content: ``,
		openId: null,
		userInfo: {} as any,
		token: uni.getStorageSync("token"),
		tab_index: 1,
		popup_not_open: false,

		nickName: "",

		appType: uni.getStorageSync("appType") || 1
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const getUserInfo = () => {
		globalProxy.$request("/loan/User/getUserInfo").then((ress : Result) => {
			state.userInfo = ress.data
			if (state.userInfo.user_type.length > 1 && uni.getStorageSync("appType") === 2) {
				if (state.userInfo.types_order_number.length > 1) {
					state.userInfo.types_order_number.splice(1, 0, {
						type: "line"
					})
				}
				state.tab_index = 2;
			}
			uni.setStorageSync("userInfo", ress.data)
			state.nickName = ress.data.nickname
			uni.hideTabBar();
		})
	}

	const changeAppType = (type : number) => {
		// 1、用户端，2、业务端
		uni.setStorageSync("appType", type)
		state.appType = uni.getStorageSync("appType")
		state.tab_index = state.appType
		getUserInfo()
	}

	const getUser = () => {
		uni.login({
			success: (e : any) => {
				globalProxy.$request("/factory_system/Base/wechatUserRegister", {
					platform: "mini",
					code: e.code
				}).then((res : Result) => {
					state.openId = res.data.mini_openid;
					uni.showToast({
						title: "微信授权成功",
						icon: "none",
						duration: 2000
					})
				})
			}
		})
	}
	const getPhone = (e : any) => {
		globalProxy.$request("/factory_system/Base/getWechatPhoneNumber", {
			platform: "mini",
			code: e.detail.code,
			mini_openid: state.openId
		}).then((res : Result) => {
			globalProxy.$request("/loan/User/loginAndRegister", { mobile: res.data.phone_number, openid: state.openId }).then((result : Result) => {
				uni.setStorageSync("token", result.data.token)
				if (result.data.business_code === 2) {
					globalProxy.$request("/loan/User/updateUserInfo", {
						mobile: res.data.phone_number
					}).then(() => {
						getUserInfo()
					})
				} else {
					getUserInfo()
				}
			})
		})
	}

	const changeAvatar = (e : any) => {
		uni.showLoading({
			title: "上传中，请稍后……"
		})
		const name_array = e.detail.avatarUrl.split("/");
		const name = name_array[name_array.length - 1]
		globalProxy.$request("", {
			file: e.detail.avatarUrl,
			fileType: "file",
			params: {
				fileSize: 0,
				fileName: name,
			}
		}).then((result : Result) => {
			globalProxy.$request("/loan/User/updateUserInfo", { head_image: result.data.url }).then(() => {
				uni.hideLoading()
				getUserInfo()
			})
		})
		uni.hideLoading()
	}

	const getNickname = (e : any) => {
		state.nickName = e.detail.value
	}

	const changeNickname = () => {
		setTimeout(() => {
			globalProxy.$request("/loan/User/updateUserInfo", { nickname: state.nickName }).then(() => {
				getUserInfo()
			})
		}, 200)
	}

	onShow(() => {
		if (uni.getStorageSync("token")) {
			getUserInfo()
		}
	})

	const navTo = (url : string, data : any) => {
		if (data.id) {
			uni.navigateTo({
				url: url + "?id=" + data.id + "&title=" + data.title
			})
		}
	}
</script>
<style lang='scss'>
	.container {
		>.open_popup {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
			width: 84vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			padding: 2.67vw;

			>.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
			}

			>image {
				width: 41.89vw;
				height: 31.67vw;
				margin: 3.73vw auto 2.67vw;
				display: block;
			}

			>.text {
				text-align: center;
				font-weight: bold;
				font-size: 3.2vw;
				color: #333333;
				margin-bottom: 3.47vw;
			}

			>.confirm {
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				text-align: center;
				line-height: 8vw;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
			}
		}

		>.mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 98;
		}

		>.content {
			padding: 10vw 4vw 0;
			position: relative;

			>.list {
				height: 12vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin-top: 4vw;
				padding: 0 4vw;
				display: flex;
				align-items: center;

				>image {
					width: 5.33vw;
					height: 5.33vw;
					margin-right: 4vw;
				}

				>.title {
					font-weight: bold;
					font-size: 3.47vw;
					color: #333333;
					flex: 1;
				}
			}

			>.option {
				height: 24vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				margin-top: 7.47vw;

				>.item {
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					font-weight: bold;
					font-size: 3.2vw;
					color: #333333;

					>.line {
						width: 1px;
						height: 13.33vw;
						background: #333333;
						border-radius: 1.33vw;
					}

					>image {
						width: 5.33vw;
						height: 5.33vw;
					}

					>.text {
						font-weight: 400;
						font-size: 2.67vw;
						color: #333333;
						margin: 1.47vw 0;
					}
				}
			}

			>.userInfo {
				display: flex;
				align-items: center;

				>input {
					margin: 0 1.33vw 0 2.67vw;
					font-weight: bold;
					font-size: 4vw;
					color: #FFFFFF;
				}

				>.avatar {
					width: 17.73vw;
					height: 17.73vw;
					background: #FFFFFF;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;

					>image {
						width: 10.48vw;
						height: 10.48vw;
					}
				}
			}
		}

		>.navbar {
			padding: 0 4vw;
			display: flex;
			align-items: center;
			justify-content: center;
			position: sticky;
			top: 0;
			left: 0;
			z-index: 20;
			color: #FFFFFF;
		}

		>.bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>