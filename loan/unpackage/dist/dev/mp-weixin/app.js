"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_jump = require("./utils/jump.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/user_home/index.js";
  "./pages/home/index.js";
  "./pages/work/index.js";
  "./pages/mine/index.js";
  "./pages/rich_text/index.js";
  "./pages/web_view/index.js";
  "./home_packages/signing/index.js";
  "./home_packages/contract/index.js";
  "./home_packages/autograph/index.js";
  "./home_packages/service/index.js";
  "./home_packages/service_form/index.js";
  "./home_packages/service_sign/index.js";
  "./home_packages/assistant/index.js";
  "./home_packages/record/index.js";
  "./home_packages/details/index.js";
  "./home_packages/data_entry/index.js";
  "./home_packages/select_bank_card/index.js";
  "./home_packages/add_bank_card/index.js";
  "./home_packages/add_personal/index.js";
  "./home_packages/add_enterprise/index.js";
  "./home_packages/add_house/index.js";
  "./home_packages/ownership/index.js";
  "./home_packages/weituo_person/index.js";
  "./work_packages/submitted/index.js";
  "./work_packages/grab/index.js";
  "./work_packages/backlog/index.js";
  "./work_packages/detail/index.js";
  "./mine_packages/signing/index.js";
  "./mine_packages/order_detail/index.js";
  "./mine_packages/schedule/index.js";
  "./mine_packages/progress_list/index.js";
  "./mine_packages/message/index.js";
  "./mine_packages/authentication/index.js";
  "./mine_packages/phone_auth/index.js";
  "./mine_packages/realname_auth/index.js";
  "./mine_packages/wechat_auth/index.js";
}
const _sfc_main = {
  globalData: {
    statusBarHeight: 0,
    // 状态导航栏高度
    navHeight: 0,
    // 总体高度
    navigationBarHeight: 0
    // 导航栏高度(标题栏高度)
  },
  onLaunch: function() {
    common_vendor.index.setStorageSync("first_in", true);
    this.globalData.statusBarHeight = common_vendor.index.getSystemInfoSync().statusBarHeight;
    const custom = common_vendor.index.getMenuButtonBoundingClientRect();
    this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2;
    this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight;
    common_vendor.index.setStorageSync("hideTabbar", true);
    if (!common_vendor.index.getStorageSync("appType")) {
      common_vendor.index.setStorageSync("appType", 1);
    }
  },
  onShow: function() {
    if (common_vendor.index.getStorageSync("hideTabbar")) {
      common_vendor.index.hideTabBar();
      common_vendor.index.removeStorageSync("hideTabbar");
    } else {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const pagePath = currentPage.route;
      const tabbarPage = [
        "pages/home/index",
        "pages/mine/index",
        "pages/user_home/index",
        "pages/work/index"
      ];
      if (tabbarPage.includes(pagePath)) {
        common_vendor.index.hideTabBar();
      }
    }
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.uviewPlus);
  app.config.globalProperties.$navigateTo = utils_jump.navigateTo;
  app.config.globalProperties.$back = utils_jump.back;
  app.config.globalProperties.$request = utils_request.request;
  app.config.globalProperties.$cardUtil = utils_jump.cardUtil;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
