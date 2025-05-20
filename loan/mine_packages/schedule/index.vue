<template>
	<view class="container">
		<navbar title="进度查询"></navbar>
		<view class="content">
			<view class="option">
				<view class="item" :class="state.current===1?'active':''" @click="changeTab(1)">个人</view>
				<view class="item" :class="state.current===2?'active':''" @click="changeTab(2)">企业</view>
			</view>

			<view class="info" v-if="state.current===1">
				<view class="item">
					<view class="label">姓名</view>
					<view class="value">
						<input type="text" placeholder="请输入查询客户姓名" placeholder-class="inputClass"
							v-model="state.name" />
					</view>
				</view>
				<view class="item">
					<view class="label">身份证号码</view>
					<view class="value">
						<input type="number" placeholder="请输入查询客户证件号" placeholder-class="inputClass"
							v-model="state.card_number" />
					</view>
				</view>
			</view>

			<view class="info" v-if="state.current===2">
				<view class="item">
					<view class="label">企业名称</view>
					<view class="value">
						<input type="text" placeholder="请输入查询企业名称" placeholder-class="inputClass"
							v-model="state.name" />
					</view>
				</view>
				<view class="item">
					<view class="label">统一社会信用代码</view>
					<view class="value">
						<input type="number" placeholder="请输入统一社会信用代码" placeholder-class="inputClass"
							v-model="state.card_number" />
					</view>
				</view>
			</view>

			<view class="confirm" @click="navTo()">确定</view>
		</view>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
	</view>
</template>
<!--创建时间：2024-03-31 12:47:01-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive } from "vue"

	const state = reactive({
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",

		current: 1,
		name: "",
		card_number: ""
	})

	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const changeTab = (type : number) => {
		state.name = "";
		state.card_number = "";
		state.current = type;
	}

	const navTo = () => {
		if (state.name === "" || state.card_number === "") {
			openTips("资料未填写完成");
			return;
		}
		uni.navigateTo({
			url: "/mine_packages/progress_list/index?card_number=" + state.card_number
		})
	}

	const openTips = (text : string) => {
		state.tipsText = text;
		state.tips_popup = true;
		if (state.tips_timer !== null) {
			clearTimeout(state.tips_timer);
		}
		state.tips_timer = setTimeout(() => {
			state.tips_popup = false;
		}, 2000)
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		.tips_popup {
			position: fixed;
			bottom: 12vh;
			left: 50%;
			transform: translateX(-50%);
			width: 54.13vw;
			height: 8vw;
			background: rgba(102, 102, 102, .8);
			border-radius: 1.33vw;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			font-size: 3.47vw;
			color: #FFFFFF;
		}

		>.content {
			padding: 4vw;

			>.confirm {
				width: 80vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				margin: 0 auto;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			>.info {
				background: #FFFFFF;
				border-radius: 1.33vw;
				margin: 2.67vw 0 4vw;

				>.item {
					padding: 0 2.67vw 2.67vw;
					display: flex;
					align-items: center;
					justify-content: space-between;

					>.value {
						flex: 1;
						padding: 2.67vw 0;
						border-bottom: solid 1px #666666;

						.inputClass {
							font-size: 3.2vw;
							color: #999999;
						}
					}

					>.label {
						width: 20vw;
						font-weight: 500;
						font-size: 3.2vw;
						color: #333333;
						display: flex;
						align-items: center;
						margin-right: 5vw;

						&:before {
							content: "*";
							font-weight: 500;
							font-size: 3.2vw;
							color: #FF8177;
							margin-right: 1.6vw;
						}
					}
				}
			}

			>.option {
				display: flex;
				align-items: center;
				justify-content: space-evenly;

				>.item {
					width: 21.33vw;
					height: 8vw;
					background: #FFFFFF;
					border-radius: 4vw;
					font-weight: 400;
					font-size: 3.47vw;
					color: #666666;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				>.active {
					background: #F97E39;
					color: #FFFFFF;
				}
			}
		}
	}
</style>