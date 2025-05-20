"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  (_easycom_u_icon2 + _easycom_u_parse2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_parse = () => "../../node-modules/uview-plus/components/u-parse/u-parse.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_parse)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      popup_state: false,
      html_content: ``
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => _ctx.$back()),
        c: common_vendor.p({
          name: "arrow-left",
          size: "5vw",
          color: "#FFFFFF"
        }),
        d: state.statusBarHeight + "px",
        e: state.navigationBarHeight + "px",
        f: common_assets._imports_1$4,
        g: common_assets._imports_2$4,
        h: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        i: common_vendor.o(($event) => state.popup_state = true),
        j: common_vendor.p({
          content: state.html_content,
          noData: "暂无公告"
        }),
        k: common_vendor.o(($event) => state.popup_state = false),
        l: state.popup_state,
        m: state.popup_state
      };
    };
  }
});
wx.createPage(_sfc_main);
