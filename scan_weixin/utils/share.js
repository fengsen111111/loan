export default {
	data() {
		return {}
	},
	//1.配置发送给朋友
	onShareAppMessage() {
		return {
			title: '扫码点餐', //分享的标题
			path: 'pages/Home/index', //点击分享链接之后进入的页面路径
		};
	},
	//2.配置分享到朋友圈
	onShareTimeline() {
		return {
			title: '扫码点餐', //分享的标题
			path: 'pages/Home/index', //点击分享链接之后进入的页面路径
		}
	},
}