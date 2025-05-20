<template>
	<view class="container">
		<navbar title="手机认证"></navbar>
		<view class="content">
			<view class="form">
				<view class="item">
					<view class="label">手机号</view>
					<view class="value">
						<input type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="inputClass" />
						<view class="tips">请输入正确的手机号</view>
					</view>
				</view>
				<view class="item">
					<view class="label">验证码</view>
					<view class="value">
						<input type="number" maxlength="11" placeholder="请输入验证码" placeholder-class="inputClass" />
						<view class="tips">验证码错误</view>
						<view class="getCode" @click="getCode()"
							:style="{border: state.timer?'1px solid #999999;':'',color: state.timer?'#999999;':''}">
							{{state.codeText}}
						</view>
					</view>
				</view>
			</view>
			<view class="btn">确定</view>
		</view>

		<view class="popup" v-if="state.popup_show">
			<view class="title">
				<view style="width: 5vw;"></view>
				{{state.type===1?'认证成功':'认证失败'}}
				<u-icon name="close" color="#666666" size="5vw" @click="state.popup_show=false"></u-icon>
			</view>
			<image :src="state.type===1?'/mine_packages/static/success.png':'/mine_packages/static/fail.png'" mode="">
			</image>
			<view class="text">{{state.type===1?'认证已通过':'信息有误，请修改后再重试'}}</view>

			<view class="confirm" @click="state.popup_show=false">确定</view>
		</view>
		<view class="mask" v-if="state.popup_show"></view>
	</view>
</template>
<!--创建时间：2024-03-31 15:31:58-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue"
	import { reactive } from "vue"

	const state = reactive({
		popup_show: false,
		type: 2,
		current: 1,
		codeNum: 59,
		timer: null,
		codeText: "发送验证码"
	})

	const getCode = () => {
		if (state.codeNum < 59) return;
		state.codeText = state.codeNum + "后重发";
		state.timer = setInterval(() => {
			state.codeNum--;
			state.codeText = state.codeNum + "后重发";
			if (state.codeNum === 1) {
				clearInterval(state.timer);
				state.codeText = "重新发送";
				state.codeNum = 59;
				state.timer = null;
			}
		}, 1000)
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.mask {
			width: 100vw;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 98;
		}

		>.popup {
			width: 76vw;
			background: #FFFFFF;
			border-radius: 1.33vw;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
			padding: 2.67vw 4vw;

			>.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 4.27vw;
				color: #333333;
				margin-bottom: 4vw;
			}

			>image {
				margin: 0 auto;
				width: 26.4vw;
				height: 32.27vw;
				display: block;
			}

			>.text {
				text-align: center;
				margin: 4.53vw 0 2.67vw;
			}

			>.confirm {
				width: 78.67vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				line-height: 8vw;
				text-align: center;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
			}
		}

		>.content {
			padding: 4vw;

			>.btn {
				width: 80vw;
				height: 8vw;
				background: #F97E39;
				border-radius: 4vw;
				text-align: center;
				line-height: 8vw;
				font-weight: bold;
				font-size: 3.47vw;
				color: #FFFFFF;
				margin: 4vw auto;
			}

			>.form {
				background: #FFFFFF;
				border-radius: 1.33vw;
				padding: 1vw 4vw;

				>.item {
					display: flex;
					align-items: center;

					>.value {
						display: flex;
						align-items: center;
						padding: 2.53vw 0;
						border-bottom: solid 1px #666666;
						flex: 1;

						>.getCode {
							width: 23.2vw;
							height: 5.33vw;
							border-radius: 1.33vw;
							border: 1px solid #F97E39;
							font-weight: bold;
							font-size: 3.2vw;
							color: #F97E39;
							line-height: 5.33vw;
							text-align: center;
							margin-left: 1.33vw;
						}

						>.tips {
							font-weight: 500;
							font-size: 2.67vw;
							color: #FF8177;
							white-space: nowrap;
						}

						.inputClass {
							font-weight: 500;
							font-size: 3.2vw;
							color: #999999;
						}

						>input {
							flex: 1;
						}
					}

					>.label {
						font-weight: 500;
						font-size: 3.2vw;
						color: #333333;
						display: flex;
						align-items: center;
						margin-right: 3.2vw;

						&:before {
							content: "*";
							color: #FF8177;
							margin-right: 1.6vw;
						}
					}
				}
			}
		}
	}
</style>