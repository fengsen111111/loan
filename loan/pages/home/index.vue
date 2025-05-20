<template>
	<view class="container">
		<view class="bg">
			<image src="@/static/bg.png" mode=""></image>
		</view>
		<view class="head" :style="{paddingTop:state.statusBarHeight+'px',height:state.navigationBarHeight+'px'}">
			<view class="search">
				<u-icon name="search" size="6vw" color="#666666"></u-icon>
				<input type="text" confirm-type="search" v-model="state.searchVal" placeholder="搜索产品名称"
					placeholder-class="inputClass" @blur="search(state.screen_type)"
					@confirm="search(state.screen_type)" />
			</view>
		</view>
		<scroll-view scroll-y="true"
			:style="{paddingTop:'4vw',height:'calc(100vh - '+state.navHeight+'px - 4vw - '+state.tabbarHeight+'px)',position:'relative'}">
			<view class="content">
				<view v-show="state.isNotSearch">
					<swiper class="banner" autoplay circular>
						<swiper-item v-for="(item,index) in state.banner" :key="index">
							<image :src="item.image" mode="aspectFill"
								@click="$navigateTo('/pages/rich_text/index',{id:item.id,url:'/loan/Banner/getBannerRichText'})">
							</image>
						</swiper-item>
					</swiper>
					<view class="district">
						<view class="item" @click="$navigateTo('/home_packages/assistant/index')">
							<image src="@/static/icon1.png" mode=""></image>
							云助手
						</view>
						<view class="item" @click="$navigateTo('/home_packages/record/index')">
							<image src="@/static/icon2.png" mode=""></image>
							数据通
						</view>
						<view class="item">
							<image src="@/static/icon3.png" mode=""></image>
							更多
						</view>
					</view>
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
				</view>

				<scroll-view scroll-x style="height: 7vw;margin-top: 5.33vw;"
					:style="state.isNotSearch?'':'margin-top:0'">
					<view class="screen">
						<view class="item" :class="state.screen_type===index?'active':''" @click="search(index)"
							v-for="(item,index) in state.screen_list" :key="index">{{item.name}}</view>
					</view>
				</scroll-view>

				<view class="list">
					<view class="item"
						@click="$navigateTo('/home_packages/details/index',{id:item.id,type:state.type[item.person_type]})"
						v-for="(item,index) in state.list" :key="index">
						<view class="type" v-if="item.is_hot === 'Y'">热门产品</view>
						<view class="title">
							<view class="classify"
								:style="state.type[item.person_type]===1?'background:#FF8177':'background:#F3A469'">
								{{state.type[item.person_type]===1?'个人':'企业'}}
							</view>
							{{item.name}}
						</view>
						<view class="detail">
							<view class="annualized">{{state.rate_type[item.rate_type]}}</view>
							<view class="decimal">{{item.rate_range}}</view>
							<view class="max">{{item.top_limit}}|{{item.loan_cycle}}</view>
						</view>
						<view class="option">
							<view class="num" v-for="(i,j) in item.sign" :key="j">{{i}}</view>
						</view>
						<view class="feature">
							<view class="left">
								<view class="pro_feature">产品特色</view>
								<view style="flex: 1;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
									{{item.special_des}}
								</view>
							</view>
							<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
						</view>
					</view>

					<!-- <view class="item" @click="$navigateTo('/home_packages/details/index',{id:2,type:2})">
						<view class="type">热门产品</view>
						<view class="title">
							<view class="classify" :style="{background: '#F3A469'}">企业</view>
							信用分期
						</view>
						<view class="detail">
							<view class="annualized">年化</view>
							<view class="decimal">0.66~0.88%</view>
							<view class="max">最高90万|最长支持6期</view>
						</view>
						<view class="option">
							<view class="num">无抵押、无担保</view>
							<view class="num">急速审批</view>
							<view class="num">额度高</view>
						</view>
						<view class="feature">
							<view class="left">
								<view class="pro_feature">产品特色</view>
								支持长期和短期
							</view>
							<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
						</view>
					</view> -->
				</view>
			</view>
		</scroll-view>

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
		<Tabbar :index="0" id="tabbar"></Tabbar>
	</view>
</template>

<script setup lang="ts">
	import { onShow } from "@dcloudio/uni-app"
	import { reactive, getCurrentInstance } from "vue";
	import { Result } from "@/utils/interface"
	import Tabbar from "@/components/tabbar.vue";

	const state = reactive({
		statusBarHeight: getApp().globalData.statusBarHeight,
		navigationBarHeight: getApp().globalData.navigationBarHeight,
		navHeight: getApp().globalData.navHeight,
		tabbarHeight: 0,

		// 轮播图数组
		banner: [],
		// 公告数组
		notice: [],
		// 没有搜索
		isNotSearch: true,
		// 公告打开状态
		popup_state: false,
		// 搜索关键字
		searchVal: "",
		// 筛选数组
		screen_list: [],
		// 列表筛选
		screen_type: 0,
		// 列表
		list: [],
		// 个人、公司
		type: {
			person: 1,
			company: 2
		},
		rate_type: {
			day: "日化",
			month: "月化",
			year: "年化"
		},
		// 公告富文本
		html_content: ``
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
		globalProxy.$request("/loan/LoanType/getLoanTypeList").then((res : Result) => {
			state.screen_list = res.data.list

			globalProxy.$request("/loan/Goods/getGoodsList", {
				loan_type_id: state.screen_list[state.screen_type].id
			}).then((ress : Result) => {
				state.list = ress.data.list

				uni.createSelectorQuery().select("#tabbar").boundingClientRect(res => {
					state.tabbarHeight = res.height;
				}).exec()
			})
		})
	})

	const search = (type : number) => {
		state.screen_type = type;
		state.isNotSearch = state.searchVal === "";
		globalProxy.$request("/loan/Goods/getGoodsList", {
			loan_type_id: state.screen_list[state.screen_type].id
		}).then((ress : Result) => {
			state.list = ress.data.list
		})
	}
	const changeState = (id : string) => {
		globalProxy.$request("/loan/Notice/getNoticeRichText", {
			notice_id: id
		}).then((res : Result) => {
			state.html_content = res.data.content;
			state.popup_state = true;
		})
	}
</script>

<style lang="scss">
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

		.content {
			padding: 0 4vw;

			>.list {
				>.item {
					background: #FFFFFF;
					border-radius: 1.33vw;
					position: relative;
					margin-top: 2.67vw;

					>.feature {
						height: 7vw;
						padding: 0 2.67vw;
						margin-top: 2.67vw;
						border-top: solid 1px #999999;
						display: flex;
						align-items: center;
						justify-content: space-between;

						>.left {
							width: 80vw;
							display: flex;
							align-items: center;
							font-size: 3.2vw;
							color: #333333;

							>.pro_feature {
								font-weight: bold;
								color: #109181;
								margin-right: 2vw;
							}
						}
					}

					>.option {
						padding-left: 2.67vw;
						display: flex;
						align-items: center;
						flex-wrap: wrap;

						>.num {
							background: #F6F7FB;
							border-radius: 0.8vw;
							padding: 0.67vw 1.33vw;
							margin-right: 1.33vw;
							font-size: 2.93vw;
							color: #F97E39;
						}
					}

					>.detail {
						padding: 2.67vw;
						display: flex;
						align-items: center;
						font-size: 3.2vw;

						>.max {
							color: #666666;
						}

						>.decimal {
							width: 30vw;
							text-align: center;
							color: #109181;
						}

						>.annualized {
							width: 10.67vw;
							height: 5.33vw;
							border-radius: 0.8vw;
							border: 1px solid #F97E39;
							font-weight: bold;
							color: #F97E39;
							line-height: 5.33vw;
							text-align: center;
						}
					}

					>.title {
						height: 5.33vw;
						padding: 1.33vw 2.67vw 0;
						display: flex;
						align-items: center;
						font-weight: bold;
						font-size: 3.73vw;
						color: #333333;

						>.classify {
							width: 16vw;
							height: 100%;
							border-radius: 1.33vw;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 2.67vw;
							font-size: 3.2vw;
							color: #FFFFFF;
						}
					}

					>.type {
						position: absolute;
						right: 2.67vw;
						top: 0;
						width: 18.67vw;
						height: 7.6vw;
						background: #109181;
						border-radius: 0 0 1.33vw 1.33vw;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						font-size: 3.2vw;
						color: #FFFFFF;
					}
				}
			}

			.screen {
				width: fit-content;
				height: 7vw;
				display: flex;
				align-items: center;

				>.item {
					white-space: nowrap;
					padding: 1vw 3vw;
					background: #FFFFFF;
					border-radius: 2.67vw;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 4vw;
					font-size: 3.2vw;
					color: #666666;
				}

				>.active {
					color: #FFFFFF;
					background: #F97E39;
				}
			}

			.notice {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 3.33vw 2.67vw;
				background: #FFFFFF;
				border-radius: 1.33vw;

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

	.inputClass {
		font-size: 3.2vw;
		color: #999999;
	}
</style>