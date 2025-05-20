<template>
	<view class="bottom_bt" :style="{paddingBottom:state.safeAreaBottom!==0?state.safeAreaBottom+'px':''}">
		<view class="cancel" v-if="props.showCancel" :style="{background:props.cancelBgColor,color:props.cancelColor}"
			@click="cancel()">
			{{props.cancelText}}
		</view>
		<view class="confirm"
			:style="{background:props.confirmBgColor,color:props.confirmColor,width:props.showCancel?'':'80vw'}"
			@click="confirm()">
			{{props.confirmText}}
		</view>
	</view>
</template>
<!--创建时间：2024-03-29 09:27:40-->
<script setup lang="ts">
	import { defineProps, defineEmits, reactive } from 'vue';

	const emits = defineEmits(['cancel', "confirm"]);

	const cancel = () => {
		emits("cancel")
	}

	const confirm = () => {
		emits("confirm")
	}

	const state = reactive({
		safeAreaBottom: 0
	})
	uni.getSystemInfo({
		success: function (res) {
			// 获取底部安全区域的高度
			state.safeAreaBottom = res.screenHeight - res.safeArea.bottom;
		}
	});

	const props = defineProps({
		showCancel: {
			type: Boolean,
			default: false
		},
		cancelText: {
			type: String,
			default: ""
		},
		cancelColor: {
			type: String,
			default: ""
		},
		cancelBgColor: {
			type: String,
			default: ""
		},
		confirmText: {
			type: String,
			default: "下一步"
		},
		confirmColor: {
			type: String,
			default: "#FFFFFF"
		},
		confirmBgColor: {
			type: String,
			default: "#F97E39"
		}
	})
</script>
<style lang='scss'>
	.bottom_bt {
		width: 100%;
		position: fixed;
		background: #FFFFFF;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2.53vw 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-evenly;

		>.cancel {
			width: 33.33vw;
			height: 8vw;
			border-radius: 4vw;
			font-weight: bold;
			font-size: 3.47vw;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		>.confirm {
			width: 46.67vw;
			height: 8vw;
			border-radius: 4vw;
			font-weight: bold;
			font-size: 3.47vw;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>