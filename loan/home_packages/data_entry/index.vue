<template>
	<view class="container">
		<navbar title="数据录入"></navbar>
		<information v-if="state.step===1&&props.type===1" @next="nextStep()"></information>
		<information1 v-if="state.step===1&&props.type===2" @next="nextStep()"></information1>
		<detailed v-if="state.step===2&&props.type===1" @next="nextStep()"></detailed>
		<detailed1 v-if="state.step===2&&props.type===2" @next="nextStep()"></detailed1>
		<!-- <bankcard v-if="state.step===3" @next="nextStep()"></bankcard> -->
		<borrowing v-if="state.step===3" @next="nextStep()"></borrowing>
		<borrower v-if="state.step===4" @next="nextStep()"></borrower>
		<rongdan v-if="state.step===5" @next="nextStep()"></rongdan>
		<houseproperty v-if="state.step===6" @next="nextStep()"></houseproperty>
		<!-- <capture v-if="state.step===8" @next="nextStep()"></capture> -->
		<otherinfo v-if="state.step===7" @next="nextStep()"></otherinfo>
		<confirminfo :type="props.type" v-if="state.step===8" @next="nextStep()" @back="state.step=1"></confirminfo>
		<finish v-if="state.step===9" @next="nextStep()"></finish>
	</view>
</template>
<!--创建时间：2024-03-29 10:31:30-->
<script setup lang="ts">
	import navbar from "@/components/navbar.vue";
	import information from "@/components/data_components/information.vue";
	import information1 from "@/components/data_components/information1.vue";
	import detailed from "@/components/data_components/detailed.vue";
	import detailed1 from "@/components/data_components/detailed1.vue";
	// import bankcard from "@/components/data_components/bankcard.vue";
	import borrowing from "@/components/data_components/borrowing.vue";
	import borrower from "@/components/data_components/borrower.vue"
	import rongdan from "@/components/data_components/rongdan.vue";
	import houseproperty from "@/components/data_components/houseproperty.vue";
	// import capture from "@/components/data_components/capture.vue";
	import otherinfo from "@/components/data_components/otherinfo.vue";
	import confirminfo from "@/components/data_components/confirminfo.vue";
	import finish from "@/components/data_components/finish.vue";

	import { reactive, defineProps } from "vue";
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	})

	const state = reactive({
		step:1
	})
	const props = defineProps({
		id: {
			type: String
		},
		type: {
			type: Number
		}
	})

	uni.setStorageSync("goods_id", props.id)

	const nextStep = () => {
		if (state.step === 9) {
			uni.switchTab({
				url: "/pages/home/index"
			})
			return
		}
		state.step++;
	}
</script>
<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #F6F7FB;
	}
</style>