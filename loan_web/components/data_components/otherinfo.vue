<template>
	<view class="otherinfo">
		<view class="head" v-if="!props.showFlag">
			<view class="top_dot">
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot finish"></view>
				<view class="line finish"></view>
				<view class="dot current"></view>
				<view class="line"></view>
				<view class="dot"></view>
			</view>
			<view class="bottom_text">
				<view class="text finish">基本信息</view>
				<view class="text finish">……………</view>
				<view class="text current">补充资料</view>
				<view class="text">信息确认</view>
			</view>
		</view>
		<view class="content">
			<view class="label">补充资料</view>
			<view class="info_item">
				<view class="label">身份证</view>
				<view class="value" style="border-bottom: none;">
					<view class="idcard" v-if="!props.showFlag" v-for="(item,index) in state.id_card_array"
						:key="index">
						<view class="item" @click="uploadIdImg('front')">
							点击上传身份证正面
							<text>（人像）</text>
							<image :src="item.front" @click="preImg(item.front)" mode="" v-if="item.front"></image>
						</view>
						<view class="item" @click="uploadIdImg('back')">
							点击上传身份证背面
							<text>（国徽）</text>
							<image :src="item.back" mode="" @click="preImg(item.back)" v-if="item.back"></image>
						</view>
					</view>
					<template v-else>
						<image style="width: 40.8vw;height: 22.93vw;" :src="item" mode=""
							v-for="(item,index) in formData.materials.id_card_image" @click="preImg(item)" :key="index"></image>
					</template>
					<view class="uploadIdCard" v-if="!props.showFlag" @click="addUploadBox">添加身份证资料</view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">户口本</view>
				<view class="value" style="border-bottom: none;">
					<view class="imgs" v-for="(item,index) in formData.materials.hukou_image" :key="index">
						<image :src="item" @click="preImg(item)" mode=""></image>
						<view class="close" @click="deleteImg('hukou_image',index)" v-if="!props.showFlag">
							<u-icon name="close-circle" size="20px" color="#000000"></u-icon>
						</view>
					</view>
					<view class="upload" v-if="!props.showFlag" @click="uploadImg('hukou_image')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">婚姻证明材料</view>
				<view class="value" style="border-bottom: none;">
					<view class="imgs" v-for="(item,index) in formData.materials.marry_image" :key="index">
						<image :src="item" @click="preImg(item)" mode=""></image>
						<view class="close" @click="deleteImg('marry_image',index)" v-if="!props.showFlag">
							<u-icon name="close-circle" size="20px" color="#000000"></u-icon>
						</view>
					</view>
					<view class="upload" v-if="!props.showFlag" @click="uploadImg('marry_image')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">产权证</view>
				<view class="value" style="border-bottom: none;">
					<view class="imgs" v-for="(item,index) in formData.materials.house_image" :key="index">
						<image :src="item" @click="preImg(item)" mode=""></image>
						<view class="close" @click="deleteImg('house_image',index)" v-if="!props.showFlag">
							<u-icon name="close-circle" size="20px" color="#000000"></u-icon>
						</view>
					</view>
					<view class="upload" v-if="!props.showFlag" @click="uploadImg('house_image')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item">
				<view class="label">房屋产调信息</view>
				<view class="value" style="border-bottom: none;">
					<view class="imgs" v-for="(item,index) in formData.materials.house_power_image" :key="index">
						<image :src="item" @click="preImg(item)" mode=""></image>
						<view class="close" @click="deleteImg('house_power_image',index)" v-if="!props.showFlag">
							<u-icon name="close-circle" size="20px" color="#000000"></u-icon>
						</view>
					</view>
					<view class="upload" v-if="!props.showFlag" @click="uploadImg('house_power_image')">点击上传</view>
					<view style="width: 26.67vw;"></view>
				</view>
			</view>
			<view class="info_item" v-show="false">
				<view class="label">是否有委托</view>
				<view class="value" style="border-bottom: none;">
					<u-radio-group v-model="formData.has_weituo" placement="row" active-color="#F97E39"
						:disabled="props.showFlag">
						<u-radio name="Y" label="是"></u-radio>
						<u-radio name="N" label="否"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<!-- <template v-if="formData.has_weituo === 'Y'">
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">房屋坐落</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入房屋坐落" style="width:100%" v-model="formData.weituo_extend.house_where"
							:disabled="props.showFlag">
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">权证名称</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入权证名称" style="width:100%" v-model="formData.weituo_extend.house_book_name"
							:disabled="props.showFlag">
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">不动产权证号</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入不动产权证号" v-model="formData.weituo_extend.house_book_number"
							:disabled="props.showFlag">
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">受委托人姓名</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入受委托人姓名" v-model="formData.weituo_extend.name"
							:disabled="props.showFlag">
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">受委托人证件号</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入受委托人证件号" v-model="formData.weituo_extend.card_number"
							:disabled="props.showFlag">
					</view>
				</view>
			</template> -->


			<view class="info_item" style="margin-top: 5vw;">
				<view class="label">是否有声明</view>
				<view class="value" style="border-bottom: none;">
					<u-radio-group v-model="formData.has_shengming" placement="row" active-color="#F97E39"
						:disabled="props.showFlag">
						<u-radio name="Y" label="是"></u-radio>
						<u-radio name="N" label="否"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<template v-if="formData.has_shengming === 'Y'">
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">婚姻状态</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入婚姻状态" v-model="formData.shengming_extend.marry_status"
							:disabled="props.showFlag">
					</view>
				</view>
			</template>
			<view class="info_item" style="margin-top: 5vw;">
				<view class="label">是否有协议</view>
				<view class="value" style="border-bottom: none;">
					<u-radio-group v-model="formData.has_xieyi" placement="row" active-color="#F97E39"
						:disabled="props.showFlag">
						<u-radio name="Y" label="是"></u-radio>
						<u-radio name="N" label="否"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<template v-if="formData.has_xieyi === 'Y'">
				<view class="info_item" style="margin-top: 5vw;">
					<view class="label">协议类型</view>
					<view class="value" style="border-bottom: none;">
						<u-radio-group v-model="formData.xieyi_extend.xieyi_type" placement="row" active-color="#F97E39"
							:disabled="props.showFlag">
							<u-radio name="a" label="协议书"></u-radio>
							<u-radio name="b" label="离婚补充协议书"></u-radio>
							<u-radio name="c" label="婚前确认协议书"></u-radio>
							<u-radio name="d" label="复婚协议书"></u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">房屋坐落</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
						<input type="text" placeholder="请输入房屋坐落" style="width:100%"  v-model="formData.xieyi_extend.house_where"
							:disabled="props.showFlag">
					</view>
				</view>
				<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="label">结婚时间</view>
					<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;"
						:style="formData.xieyi_extend.marry_time?'':'color:#777777'" @click="selectTime('marry_time')">
						{{formData.xieyi_extend.marry_time||"请选择结婚时间"}}
					</view>
				</view>
				<template v-if="formData.xieyi_extend.xieyi_type === 'a'||formData.xieyi_extend.xieyi_type === 'b'">
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">原产权登记在谁名下</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
							<input type="text" placeholder="请输入内容" v-model="formData.xieyi_extend.who_has_house"
								:disabled="props.showFlag">
						</view>
					</view>
				</template>
				<template v-if="formData.xieyi_extend.xieyi_type === 'a'">
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">产生的收益给谁</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
							<input type="text" placeholder="请输入内容" v-model="formData.xieyi_extend.who_has_income"
								:disabled="props.showFlag">
						</view>
					</view>
				</template>
				<template
					v-if="formData.xieyi_extend.xieyi_type === 'b' ||formData.xieyi_extend.xieyi_type === 'c' ||formData.xieyi_extend.xieyi_type === 'd'">
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">离婚时间</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;"
							:style="formData.xieyi_extend.marry_end_time?'':'color:#777777'"
							@click="selectTime('marry_end_time')">
							{{formData.xieyi_extend.marry_end_time||"请选择离婚时间"}}
						</view>
					</view>
				</template>
				<template v-if="formData.xieyi_extend.xieyi_type === 'b'">
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">分割归谁</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
							<input type="text" placeholder="请输入内容" v-model="formData.xieyi_extend.who_has"
								:disabled="props.showFlag">
						</view>
					</view>
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">分配方案</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;">
							<input type="text" placeholder="请输入内容" v-model="formData.xieyi_extend.share_plan"
								:disabled="props.showFlag">
						</view>
					</view>
				</template>
				<template v-if="formData.xieyi_extend.xieyi_type === 'd'">
					<view class="info_item" style="display: flex;align-items: center;justify-content: space-between;">
						<view class="label">复婚时间</view>
						<view class="value" style="width: 66.67vw;padding-bottom: 2.8vw;"
							:style="formData.xieyi_extend.marry_again_time?'':'color:#777777'"
							@click="selectTime('marry_again_time')">
							{{formData.xieyi_extend.marry_again_time||"请选择复婚时间"}}
						</view>
					</view>
				</template>
			</template>
		</view>
		<view style="height: 20vw;" v-if="!props.showFlag"></view>
		<optionBt @confirm="nextStep()" v-if="!props.showFlag"></optionBt>
		<view class="tips_popup" v-if="state.tips_popup">{{state.tipsText}}</view>
		<l-calendar :visible="state.calenderShow" @confirm="handleConfirm" :isRange="false"
			@cancel="state.calenderShow = false"></l-calendar>
	</view>
</template>

<script setup lang="ts">
	import optionBt from "@/components/option-bt.vue"
	import { Result } from "@/utils/interface"
	import { reactive, defineEmits, getCurrentInstance, onMounted } from "vue"
	import { dateFormat } from "@/utils/dateFormat";

	const emits = defineEmits(["next"]);
	const props = defineProps({
		showFlag: { type: Boolean }
	})

	const { appContext } = getCurrentInstance();
	const globalProxy = appContext.config.globalProperties;

	const state = reactive({
		tips_popup: false,
		tips_timer: null,
		tipsText: "资料未填写完成",
		id_card_array: [
			{
				front: "",
				back: ""
			}],
		calenderShow: false,

		timeKey: ""
	})

	const formData = reactive({
		materials: {
			id_card_image: [],
			hukou_image: [],
			marry_image: [],
			house_image: [],
			house_power_image: [],
		},
		has_weituo: "N",
		weituo_extend: {
			house_where: "",
			house_book_name: "",
			house_book_number: "",
			name: "",
			card_number: ""
		},
		has_shengming: "N",
		shengming_extend: {
			marry_status: ""
		},
		has_xieyi: "N",
		xieyi_extend: {
			xieyi_type: "a",
			house_where: "",
			marry_time: "",
			marry_end_time: "",
			who_has_house: "",
			who_has: "",
			share_plan: "",
			marry_again_time: "",
			who_has_income: ""
		}
	})

	onMounted(() => {
		globalProxy.$request("/loan/Order/getOrderDetail", {
			order_id: uni.getStorageSync("order_id"),
			page_number: 9
		}).then((res : Result) => {
			if (res.data.order_material.length === 0) return;
			Object.assign(formData, res.data.order_material);
			if (!props.showFlag && formData.materials.id_card_image.length !== 0) {
				state.id_card_array = [];
				let num = formData.materials.id_card_image.length / 2;
				for (let i = 0; i < num; i++) {
					state.id_card_array.push({
						front: formData.materials.id_card_image[i * 2],
						back: formData.materials.id_card_image[i * 2 + 1]
					})
				}
			}
		})
	})
	const preImg = (url : string) => {
		// console.log('放大',url); 
		uni.previewImage({
			current: url,
			urls: [url]
		})
	}
	

	const deleteImg = (key : string, index : number) => {
		formData.materials[key].splice(index, 1);
	}

	const selectTime = (name : string) => {
		if (props.showFlag) return;
		state.timeKey = name;
		state.calenderShow = true
	}

	const addUploadBox = () => {
		if (props.showFlag) return;
		formData.materials.id_card_image = [];
		let flag = true;
		state.id_card_array.map(item => {
			if (item.front === "" || item.back === "") {
				flag = false
			}
		})
		if (!flag) {
			openTips("请先上传完整身份证件");
			return;
		}
		state.id_card_array.push({
			front: "",
			back: ""
		})
	}
	const uploadIdImg = (names : string) => {
		uni.chooseImage({
			count: 1,
			success: (res : any) => {
				uni.showLoading({
					title: "上传中，请稍后……"
				})
				const name_array = res.tempFilePaths[0].split("/");
				const name = name_array[name_array.length - 1]
				globalProxy.$request("", {
					file: res.tempFiles[0].path,
					fileType: "file",
					params: {
						fileSize: parseFloat((res.tempFiles[0].size / 1024).toFixed(2)),
						fileName: name,
					}
				}).then((result : Result) => {
					state.id_card_array[state.id_card_array.length - 1][names] = result.data.url;
					uni.hideLoading()
				})
			}
		})
	}

	const handleConfirm = (e : any) => {
		formData.xieyi_extend[state.timeKey] = dateFormat(e.result, "yyyy年MM月dd日")
	}

	const nextStep = () => {
		formData.materials.id_card_image = [];
		state.id_card_array.map(item => {
			if (item.front !== "") {
				formData.materials.id_card_image.push(item.front)
			}
			if (item.back !== "") {
				formData.materials.id_card_image.push(item.back)
			}
		})
		if (formData.materials.id_card_image.length % 2 === 1) {
			openTips("资料未填写完成");
			return;
		}
		if (formData.has_weituo === "Y") {
			if (formData.weituo_extend.house_book_name === "" || formData.weituo_extend.house_book_number === "" || formData.weituo_extend.house_where === "" || formData.weituo_extend.name === "" || formData.weituo_extend.card_number === "") {
				openTips("资料未填写完成");
				return;
			}
		}
		if (formData.has_shengming === "Y") {
			if (formData.shengming_extend.marry_status === "") {
				openTips("资料未填写完成");
				return;
			}
		}
		if (formData.has_xieyi === "Y") {
			if (formData.xieyi_extend.house_where === "" || formData.xieyi_extend.marry_time === "") {
				openTips("资料未填写完成");
				return;
			}
			if (formData.xieyi_extend.xieyi_type === "a") {
				if (formData.xieyi_extend.who_has_income === "" || formData.xieyi_extend.who_has_house === "") {
					openTips("资料未填写完成");
					return;
				}
			}
			if (formData.xieyi_extend.xieyi_type === "b") {
				if (formData.xieyi_extend.who_has_house === "" || formData.xieyi_extend.marry_end_time === "" || formData.xieyi_extend.who_has === "" || formData.xieyi_extend.share_plan === "") {
					openTips("资料未填写完成");
					return;
				}
			}
			if (formData.xieyi_extend.xieyi_type === "c") {
				if (formData.xieyi_extend.marry_end_time === "") {
					openTips("资料未填写完成");
					return;
				}
			}
			if (formData.xieyi_extend.xieyi_type === "d") {
				if (formData.xieyi_extend.marry_again_time === "") {
					openTips("资料未填写完成");
					return;
				}
			}
		}
		globalProxy.$request("/loan/Order/makeOrder", {
			id: uni.getStorageSync("order_id"),
			page_number: 9,
			...formData
		}).then(() => {
			emits("next");
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
	const uploadImg = (names : string) => {
		uni.chooseImage({
			count: 1,
			success: (res : any) => {
				uni.showLoading({
					title: "上传中，请稍后……"
				})
				const name_array = res.tempFilePaths[0].split("/");
				const name = name_array[name_array.length - 1]
				globalProxy.$request("", {
					file: res.tempFiles[0].path,
					fileType: "file",
					params: {
						fileSize: parseFloat((res.tempFiles[0].size / 1024).toFixed(2)),
						fileName: name,
					}
				}).then((result : Result) => {
					formData.materials[names].push(result.data.url);
					uni.hideLoading()
				})
			}
		})
	}
</script>

<style lang="scss">
	.otherinfo {
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
			background: #FFFFFF;

			>.info_item {

				>.value {
					width: 100%;
					font-size: 3.2vw;
					color: #333333;
					padding-top: 2.8vw;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					justify-content: space-between;
					border-bottom: solid 1px #666666;

					>.imgs {
						position: relative;

						>.close {
							position: absolute;
							top: -10px;
							right: -10px;
						}

						>image {
							width: 26.67vw;
							height: 22.67vw;
							border-radius: 1.33vw;
							margin-bottom: 5.6vw;
						}
					}

					>.uploadIdCard {
						width: 100%;
						height: 10vw;
						border-radius: 1.33vw;
						border: 1px dotted #999999;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						font-size: 3.2vw;
						color: #999999;
						margin-bottom: 5.6vw;
					}

					>.upload {
						width: 26.67vw;
						height: 22.67vw;
						border-radius: 1.33vw;
						border: 1px dotted #999999;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						font-size: 3.2vw;
						color: #999999;
						margin-bottom: 5.6vw;
					}

					>.getCode {
						width: 23.2vw;
						height: 5.33vw;
						border-radius: 1.33vw;
						border: 1px solid #F97E39;
						font-weight: bold;
						font-size: 3.2vw;
						color: #F97E39;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					>.idcard {
						width: 100%;
						margin: 4vw 0;
						display: flex;
						align-items: center;
						justify-content: space-between;

						>.item {
							width: 40.8vw;
							height: 22.93vw;
							border-radius: 1.33vw;
							border: 1px dotted #999999;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							font-weight: bold;
							font-size: 3.2vw;
							color: #999999;
							position: relative;
							overflow: hidden;

							>image {
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
							}
						}
					}
				}

				>.label {
					max-width: 20vw;
					font-size: 3.2vw;
					color: #333333;

					// &:before {
					// 	content: "*";
					// 	font-size: 3.2vw;
					// 	color: #FF8177;
					// 	margin-right: 1.6vw;
					// }
				}
			}

			>.idcard {
				margin: 4vw 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.item {
					width: 40.8vw;
					height: 22.93vw;
					border-radius: 1.33vw;
					border: 1px dotted #999999;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-weight: bold;
					font-size: 3.2vw;
					color: #999999;
					position: relative;
					overflow: hidden;

					>image {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.73vw;
				color: #333333;
				display: flex;
				align-items: center;

				&::before {
					content: "";
					width: 1.07vw;
					height: 5.33vw;
					background: #F97E39;
					border-radius: 1.33vw;
					margin-right: 1.47vw;
				}
			}
		}

		>.head {
			background: #FFFFFF;
			margin: 2.67vw 0;
			padding: 2.67vw 4vw;

			>.top_dot {
				width: calc(100% - 8.14vw);
				padding: 0 4.07vw;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>.line {
					width: 8vw;
					height: 0.53vw;
					background: #999999;
					border-radius: 1.33vw;
				}

				>.dot {
					width: 2.67vw;
					height: 2.67vw;
					background: #999999;
					border-radius: 1.33vw;
				}

				>.current {
					background: #F97E39;
				}

				>.finish {
					background: #109181;
				}
			}

			>.bottom_text {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 400;
				font-size: 2.67vw;
				color: #999999;

				>.current {
					color: #F97E39;
				}

				>.finish {
					color: #109181;
				}
			}
		}
	}
</style>