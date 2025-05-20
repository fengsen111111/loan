"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
const utils_jump = require("./utils/jump.js");
if (!Math) {
  "./pages/index/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
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
