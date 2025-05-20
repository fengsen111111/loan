import App from './App'
import request from "./utils/request.js"
import {
	navigateTo,
	back
} from "./utils/jump.js"
import {
	dateFormat
} from "./utils/dateFormat.js"
import share from "@/utils/share.js"

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$request = request;
Vue.prototype.$nav = navigateTo;
Vue.prototype.$back = back;
Vue.prototype.$dateFormat = dateFormat;
Vue.mixin(share);
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif