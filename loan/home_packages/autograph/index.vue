<template>
	<view class="container">
		<view class="navbar" :style="{height:state.navigationBarHeight+'px'}">
			<u-icon name="arrow-left" size="5vh" color="#333333" @click="back()"></u-icon>
			签名板
			<view style="width: 5vw;"></view>
		</view>

		<view class="content" :style="{height:'calc(100vh - '+state.navigationBarHeight+'px - 2vw - 6vh)'}">
			<view class="left" id="signature">
				<text :style="{width:props.name.length*40+'vh'}">{{props.name}}</text>
				<canvas canvas-id="autograph" disable-scroll @touchstart="starts" @touchmove="moves"
					@touchend="end"></canvas>
			</view>
			<view class="right">
				<view class="tips">
					请使用楷体或正楷书写您的姓名
				</view>
				<view class="clear" @click="clear()">清除</view>
				<view class="save" @click="save()">完成</view>
			</view>
		</view>
	</view>
</template>
<!--创建时间：2024-04-01 11:24:03-->
<script setup lang="ts">
	import { reactive, defineProps, onMounted } from "vue"

	const state = reactive({
		navigationBarHeight: 0,
		ctx: null,
		points: [],
		clearFlag: false
	})
	onMounted(() => {
		uni.getSystemInfo({
			success: () => {
				// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
				const custom = uni.getMenuButtonBoundingClientRect()
				// 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
				state.navigationBarHeight = custom.height + (custom.top * 2)
			}
		})
	})


	state.ctx = uni.createCanvasContext("autograph", this);
	state.ctx.lineWidth = 8;
	state.ctx.lineCap = "round";
	state.ctx.lineJoin = "round"

	const starts = (e : any) => {
		let startX = e.changedTouches[0].x;
		let startY = e.changedTouches[0].y;
		let startPoint = { X: startX, Y: startY };
		state.points.push(startPoint);
		state.ctx.beginPath();
	}

	const moves = (e : any) => {
		let moveX = e.changedTouches[0].x;
		let moveY = e.changedTouches[0].y;
		let movePoint = { X: moveX, Y: moveY };
		state.points.push(movePoint);       //存点
		let len = state.points.length;
		if (len >= 2) {
			draw();                   //绘制路径
		}
	}

	const end = () => {
		state.points = [];
		state.clearFlag = false
	}

	const save = () => {
		uni.canvasToTempFilePath({
			canvasId: "autograph",
			success: (res : any) => {
				if (state.clearFlag) {
					uni.setStorageSync("autograph", "empty");
					back();
					return;
				}
				uni.setStorageSync("autograph", res.tempFilePath);
				back()
			}
		})
	}

	const draw = () => {
		let point1 = state.points[0]
		let point2 = state.points[1]
		state.points.shift()
		state.ctx.moveTo(point1.X, point1.Y)
		state.ctx.lineTo(point2.X, point2.Y)
		state.ctx.stroke()
		state.ctx.draw(true)
	}

	const clear = () => {
		state.clearFlag = true;
		uni.createSelectorQuery().select("#signature").boundingClientRect((res : any) => {
			state.ctx.clearRect(0, 0, res.width, res.height);
			state.ctx.draw(true);
		}).exec()
	}

	const props = defineProps({
		name: {
			type: String
		}
	})

	const back = () => {
		uni.navigateBack({
			fail: () => {
				console.log("返回首页")
				uni.switchTab({
					url: "/pages/home/index"
				})
			}
		})
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;

		>.content {
			padding: 1vw 2vw 1vw 5vw;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #FFFFFF;
			border-radius: 1.33vh;
			margin: 2.67vh;

			>.left {
				height: 100%;
				font-size: 15vw;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				position: relative;
				background: #e7e7e7;

				>text {
					text-align: justify;
					text-align-last: justify;
					color: rgba(153, 153, 153, .4);
				}

				>canvas {
					position: absolute;
					width: 100%;
					height: 100%;
				}
			}

			>.right {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 20vh;
				margin-left: 20px;

				>.tips {
					color: #FFC4CC;
					font-size: 3.2vh;
				}

				>.clear {
					width: 100%;
					height: 8vh;
					background: #f4f4f4;
					color: #999999;
					border-radius: 4vh;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 20vw;
				}

				>.save {
					width: 100%;
					height: 8vh;
					background: #F97E39;
					color: #FFFFFF;
					border-radius: 4vh;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 4vh;
				}
			}
		}

		>.navbar {
			padding: 0 4vw;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: sticky;
			top: 0;
			left: 0;
			background: #FFFFFF;
			z-index: 20;
		}
	}
</style>