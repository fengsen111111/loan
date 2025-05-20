<template>
	<view class="container">
		<navbar title="我的消息"></navbar>

		<view class="content">
			<view class="list" v-for="(item,index) in state.list" :key="index">
				<view class="title">
					{{item.title}}
					<view class="date">{{item.create_time}}</view>
				</view>
				<view class="text">
					{{item.content}}
					<view class="icon">
						<u-icon name="arrow-right" size="4vw" color="#666666"></u-icon>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>
<!--创建时间：2024-03-31 14:06:56-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { Result } from "@/utils/interface"
	import { reactive, getCurrentInstance, onMounted } from "vue";

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		list: []
	})

	onMounted(() => {
		globalProxy.$request("/loan/Message/getMessageList", {
			type: uni.getStorageSync("userInfo").user_type === 'a' ? 'worker' : 'user'
		}).then((res : Result) => {
			state.list = res.data.list
		})
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 4vw;

			>.list {
				padding: 2.67vw 2vw;
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin-bottom: 5.33vw;

				>.text {
					font-size: 3.2vw;
					color: #666666;
					line-height: 5vw;

					>.icon {
						float: right;
					}
				}

				>.title {
					padding: 0 2vw 1.67vw;
					border-bottom: solid 1px #999999;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-weight: bold;
					font-size: 3.47vw;
					color: #333333;

					>.date {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}
			}
		}
	}
</style>