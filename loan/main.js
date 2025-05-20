import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import uviewPlus from 'uview-plus'
import {
	navigateTo,
	back,
	cardUtil
} from "@/utils/jump.js"
import request from './utils/request'
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(uviewPlus)
	app.config.globalProperties.$navigateTo = navigateTo
	app.config.globalProperties.$back = back
	app.config.globalProperties.$request = request
	app.config.globalProperties.$cardUtil = cardUtil
	return {
		app
	}
}
// #endif