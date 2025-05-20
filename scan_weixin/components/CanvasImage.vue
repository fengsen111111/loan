<template>
	<view class="canvasImg" v-show="show">
		<view class="canvas_container">
			<view class="content" id="content">
				<canvas canvas-id="canvasId" style="width: 100%;height: 100%;"></canvas>
			</view>
			<view class="save" @click="save()">保存到手机</view>
			<view class="close" @click="$emit('close')">
				<u-icon name="close" size="5.48vw" color="#FFFFFF"></u-icon>
			</view>
		</view>
		<view class="canvas_mask"></view>
	</view>
</template>

<script>
	import canvasBg from "@/static/canvas_bg.jpg"
	export default {
		name: "CanvasImage",
		props: {
			tabFlag: {
				type: Boolean,
				default: true
			},
			show: {
				type: Boolean,
				default: false
			},
			qrCode: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				ctx: null
			};
		},
		async created() {
			if (this.show && this.tabFlag) {
				uni.hideTabBar()
			}
		},
		methods: {
			setImageCenter(src, dom) {
				return new Promise((resolve) => {
					uni.getImageInfo({
						src,
						success: res => {
							resolve({
								x: (dom.width - 180) / 2,
								y: dom.height - 180 - 40,
								tempUrl: res.path,
								width: 180,
								height: 180
							})
						}
					})
				})
			},
			save() {
				uni.canvasToTempFilePath({
					canvasId: "canvasId",
					success: (res) => {
						// 获取图片路径
						const tempFilePath = res.tempFilePath;
						uni.saveImageToPhotosAlbum({
							filePath: tempFilePath,
							success: () => {
								uni.showToast({
									title: '图片保存成功'
								});
								this.$emit("close")
							},
							fail: () => {
								uni.showToast({
									title: '图片保存失败',
									icon: 'none'
								});
							}
						});
					},
					fail: (err) => {
						uni.showToast({
							title: err.errMsg,
							icon: 'none'
						});
					}
				}, this)
			},
			roundRect(x, y, width, height, radius) {
				this.ctx.beginPath();
				this.ctx.moveTo(x + radius, y);
				this.ctx.lineTo(x + width - radius, y);
				this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
				this.ctx.lineTo(x + width, y + height - radius);
				this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
				this.ctx.lineTo(x + radius, y + height);
				this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
				this.ctx.lineTo(x, y + radius);
				this.ctx.quadraticCurveTo(x, y, x + radius, y);
				this.ctx.closePath();
				this.ctx.stroke(); // 或者 ctx.stroke() 根据需要选择填充或描边
			}
		},
		watch: {
			show(newVal) {
				if (newVal && this.tabFlag) {
					uni.hideTabBar()
				} else if (this.tabFlag) {
					uni.showTabBar()
				}
				if (newVal && this.qrCode && !this.ctx) {
					uni.showLoading({
						title: "请稍后"
					})
					uni.createSelectorQuery().in(this).select("#content").boundingClientRect().exec(async res => {
						let dom = res[0]
						const {
							tempUrl,
							x,
							y,
							width,
							height
						} = await this.setImageCenter(this.qrCode, dom)
						this.ctx = uni.createCanvasContext("canvasId", this);
						this.ctx.fillRect(0, 0, dom.width, dom.height)
						this.ctx.drawImage(canvasBg, 0, 0, dom.width, dom.height)
						const radius = 20; // 圆角半径

						// 绘制圆角矩形
						// this.ctx.strokeStyle = "rgb(254, 232, 174)";
						this.roundRect(x, y, width, height, radius);
						// this.ctx.beginPath();
						// this.ctx.moveTo(x + radius, y); // 左上角
						// this.ctx.lineTo(x + width - radius, y); // 右上角
						// this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius); // 右上角圆弧
						// this.ctx.lineTo(x + width, y + height - radius); // 右下角
						// this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y +
						// 	height); // 右下角圆弧
						// this.ctx.lineTo(x + radius, y + height); // 左下角
						// this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius); // 左下角圆弧
						// this.ctx.lineTo(x, y + radius); // 左上角
						// this.ctx.quadraticCurveTo(x, y, x + radius, y); // 左上角圆弧
						// this.ctx.closePath();
						this.ctx.setFillStyle("#ffffff")
						this.ctx.fill()
						this.ctx.drawImage(tempUrl, x + radius / 2, y + radius / 2, width - radius, height -
							radius);
						this.ctx.draw(true, (res) => {
							uni.hideLoading()
						})
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	.canvasImg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000;

		>.canvas_container {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			>.content {
				width: 92vw;
				height: 140vw;
			}

			>.save {
				width: 53.33vw;
				height: 8vw;
				line-height: 8vw;
				text-align: center;
				background: #000000;
				border-radius: 6vw;
				font-weight: bold;
				font-size: 4vw;
				color: rgb(254, 232, 174);
				margin: 10vw auto 5.2vw;
			}

			>.close {
				width: fit-content;
				margin: 0 auto;
			}
		}

		>.canvas_mask {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: -1;
		}
	}
</style>