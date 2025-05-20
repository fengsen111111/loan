<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="navbar" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
			工作台
		</view>
		<view class="content">
			<swiper class="banner" autoplay circular>
				<swiper-item v-for="(item,index) in state.banner" :key="index">
					<image :src="item.image" mode="aspectFill"
						@click="$navigateTo('/pages/rich_text/index',{id:item.id,url:'/loan/Banner/getBannerRichText'})">
					</image>
				</swiper-item>
			</swiper>

			<view class="notice">
				<swiper style="height: 25px;width: 100%;" autoplay circular vertical>
					<swiper-item style="display: flex;align-items: center;" v-for="(item,index) in state.notice"
						:key="index" @click="changeState(item.id)">
						<view class="type">公告</view>
						<view class="title">{{item.title}}</view>
						<u-icon name="arrow-right" size="5vw" color="#666666"></u-icon>
					</swiper-item>
				</swiper>
			</view>

			<view class="option" v-if="state.userInfo.user_type.includes('b')||state.userInfo.user_type.includes('c')">
				<view class="item" @click="$navigateTo('/work_packages/submitted/index')"
					v-if="state.userInfo.user_type.includes('b')">
					<image src="@/static/icon4.png" mode=""></image>
					待提交
					<view class="tips">{{state.userInfo.a_order_number}}</view>
				</view>
				<view class="item" @click="$navigateTo('/work_packages/grab/index')"
					v-if="state.userInfo.user_type.includes('c')">
					<image src="@/static/icon5.png" mode=""></image>
					可抢件
					<view class="tips">{{state.userInfo.b_order_number}}</view>
				</view>
				<view class="item" @click="$navigateTo('/work_packages/backlog/index')"
					v-if="state.userInfo.user_type.includes('c')">
					<image src="@/static/icon6.png" mode=""></image>
					待办件
					<view class="tips">{{state.userInfo.c_order_number}}</view>
				</view>
				<view class="item" v-if="state.userInfo.user_type.includes('b')"></view>
				<view class="item"
					v-if="state.userInfo.user_type.includes('c')||state.userInfo.user_type.includes('b')"></view>
			</view>
		</view>
		<view class="notice_popup" v-show="state.popup_state">
			<view class="head">
				<view style="width: 5vw;"></view>
				<view class="title">公告</view>
				<view class="close" @click="state.popup_state = false">
					<u-icon name="close" size="5vw" color="#666666"></u-icon>
				</view>
			</view>
			<scroll-view scroll-y="true" style="max-height: 90vw;min-height: 70vw;">
				<u-parse :content="state.html_content" class="html_content"></u-parse>
			</scroll-view>
		</view>
		<view class="mask" v-show="state.popup_state"></view>
		<Tabbar :index="1"></Tabbar>
	</view>
</template>
<!--创建时间：2024-03-30 16:43:21-->
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

		userInfo: uni.getStorageSync("userInfo"),

		banner: [],
		notice: []
	})
	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	onShow(() => {
		globalProxy.$request("/loan/Banner/getBannerList", {
			user_type: "worker"
		}).then((res : Result) => {
			state.banner = res.data.list
		})
		globalProxy.$request("/loan/Notice/getNoticeList", {
			user_type: "worker"
		}).then((res : Result) => {
			state.notice = res.data.list
		})
		globalProxy.$request("/loan/User/getUserInfo").then((res : Result) => {
			state.userInfo = res.data
		})
	})

	const changeState = (id : string) => {
		globalProxy.$request("/loan/Notice/getNoticeRichText", {
			notice_id: id
		}).then((res : Result) => {
			state.html_content = res.data.content;
			state.popup_state = true;
		})
	}
</script>
<style lang='scss'>
	.container {
		>.mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 98;
		}

		>.notice_popup {
			position: fixed;
			width: 76.26vw;
			padding: 2.8vw 3.87vw 4.4vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;

			.html_content {
				word-break: break-all;
			}

			>.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 2.8vw;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
			}
		}

		>.content {
			padding: 0 4vw;
			position: relative;

			>.option {
				display: flex;
				align-items: center;
				justify-content: space-around;
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding: 3.07vw 0;

				>.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 3.2vw;
					color: #333333;
					position: relative;

					>image {
						width: 7vw;
						height: 7vw;
						margin-bottom: 1vw;
					}

					>.tips {
						background: #FF8177;
						border-radius: 1.73vw;
						padding: .53vw .76vw;
						font-weight: bold;
						font-size: 2.67vw;
						color: #FFFFFF;
						position: absolute;
						right: -2vw;
						top: -2vw
					}
				}
			}

			.notice {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 3.33vw 2.67vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin: 4vw 0;

				.type {
					width: 10.67vw;
					height: 5.33vw;
					border-radius: 0.8vw;
					border: 1px solid #F97E39;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 3.47vw;
					color: #F97E39;
				}

				.title {
					flex: 1;
					padding: 0 2.8vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 3.47vw;
					color: #333333;
				}

			}

			.banner {
				height: 31.87vw;
				margin-top: 4vw;

				image {
					width: 100%;
					height: 100%;
					overflow: hidden;
					border-radius: 1.33vw;
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