<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="head" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
			<view class="search">
				<u-icon name="search" size="6vw" color="#666666"></u-icon>
				<input type="text" v-model="state.searchVal" placeholder="搜索产品名称" placeholder-class="inputClass"
					@blur="search(state.screen_type)" @confirm="search(state.screen_type)" />
			</view>
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

			<view class="list" @click="state.popup_not_open=true" v-if="state.labelShow">
				<view class="left">
					<image src="@/static/user_icon1.png" mode=""></image>
					在线公证
				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="$navigateTo('/home_packages/signing/index')">
				<view class="left">
					<image src="@/static/user_icon2.png" mode=""></image>
					自助签约
				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="$navigateTo('/home_packages/service/index')">
				<view class="left">
					<image src="@/static/user_icon3.png" mode=""></image>
					<!-- 个人信息授权书 -->
					数据服务授权
				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
			<view class="list" @click="state.popup_not_open=true" v-if="state.labelShow">
				<view class="left">
					<image src="@/static/user_icon4.png" mode=""></image>
					房屋估值
				</view>
				<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
			</view>
		</view>

		<view class="notice_popup" v-if="state.popup_state">
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
		<Tabbar :index="0"></Tabbar>
	</view>
</template>
<!--创建时间：2024-04-01 10:20:57-->
<script setup lang="ts">
	import { reactive, getCurrentInstance } from "vue"
	import { onShow } from "@dcloudio/uni-app"
	import Tabbar from "@/components/tabbar.vue";
	import { Result } from "@/utils/interface"


	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,
		popup_state: false,
		html_content: ``,
		// 没有搜索
		isNotSearch: true,
		// 搜索关键字
		searchVal: "",
		// 列表筛选
		screen_type: 1,
		popup_not_open: false,
		banner: [],
		notice: [],
		labelShow: false
	})

	onShow(() => {
		globalProxy.$request("/loan/Banner/getBannerList", {
			user_type: "user"
		}).then((res : Result) => {
			state.banner = res.data.list
		})
		globalProxy.$request("/loan/Notice/getNoticeList", {
			user_type: "user"
		}).then((res : Result) => {
			state.notice = res.data.list
		})
		globalProxy.$request("/loan/Setting/getSwitch").then((res : Result) => {
			state.labelShow = res.data.switch === "Y"
		})
	})

	const changeState = (id : number) => {
		globalProxy.$request("/loan/Notice/getNoticeRichText", {
			notice_id: id
		}).then((res : Result) => {
			state.html_content = res.data.content;
			state.popup_state = true;
		})
	}
	const search = (type : number) => {
		state.screen_type = type;
		state.isNotSearch = state.searchVal === "";
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

		.content {
			padding: 4vw;
			position: relative;

			>.list {
				height: 12vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4vw;
				padding: 0 4vw;

				>.left {
					display: flex;
					align-items: center;
					font-weight: bold;
					font-size: 3.2vw;
					color: #333333;

					>image {
						width: 8.6vw !important;
						height: 8.6vw !important;
						margin-right: 4vw;
					}
				}
			}

			>.notice {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 3.33vw 2.67vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin: 2.67vw 0 5.33vw;

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

			.district {
				height: 18.13vw;
				display: flex;
				align-items: center;
				justify-content: space-around;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin: 2.67vw 0;

				>.item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 3.2vw;
					color: #333333;
					font-weight: bold;

					>image {
						width: 6.4vw;
						height: 6.4vw;
						margin-bottom: 1.07vw;
					}
				}
			}

			.banner {
				height: 31.87vw;

				image {
					width: 100%;
					height: 100%;
					overflow: hidden;
					border-radius: 1.33vw;
				}
			}
		}

		>.head {
			position: sticky;
			top: 0;
			left: 0;
			width: 100%;
			padding-left: 4vw;
			display: flex;
			align-items: center;

			>.search {
				display: flex;
				align-items: center;
				width: 60vw;
				padding: 0 2.67vw;
				height: 8vw;
				background: #FFFFFF;
				border-radius: 4.53vw;


			}
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