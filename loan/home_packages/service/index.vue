<template>
	<view class="container">
		<!-- <navbar title="个人信息授权书"></navbar> -->
		<navbar title="数据服务授权"></navbar>
		<u-parse :content="state.html_content" class="parse_content"></u-parse>
		<view style="height: 20vw;"></view>
		<optionBt @confirm="nextStep()" confirmText="确定" :confirmBgColor="state.flag?'#F97E39':'#F6F7FB'"
			:confirmColor="state.flag?'#FFFFFF':'#999999'">
		</optionBt>
	</view>
</template>
<!--创建时间：2024-04-01 15:36:54-->
<script setup lang="ts">
	import { onReachBottom } from "@dcloudio/uni-app"
	import { reactive, getCurrentInstance, nextTick } from "vue"
	import { Result } from "@/utils/interface"
	import navbar from "@/components/navbar.vue"
	import optionBt from "@/components/option-bt.vue"
	import { navigateTo } from "@/utils/jump"

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const nextStep = () => {
		if (state.flag) {
			navigateTo("/home_packages/service_form/index")
		}
	}

	const state = reactive({
		flag: false,
		html_content: ``
	})

	globalProxy.$request("/loan/Setting/getCreditAuthContent").then((res : Result) => {
		state.html_content = res.data.content
	})

	nextTick(() => {
		let windowHeight : number;
		uni.getSystemInfoAsync({
			success: (info : any) => {
				windowHeight = info.windowHeight
			}
		});
		uni.createSelectorQuery().select(".parse_content").boundingClientRect().exec(res => {
			if (windowHeight >= res[0].height) {
				state.flag = true;
			}
		})
	})

	onReachBottom(() => {
		state.flag = true
	})
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;
	}
</style>