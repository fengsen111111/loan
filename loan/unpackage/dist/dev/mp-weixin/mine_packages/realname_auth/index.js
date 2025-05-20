"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + _easycom_u_icon)();
}
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      current: 1,
      popup_show: true,
      type: 1
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "实名认证"
        }),
        b: state.popup_show
      }, state.popup_show ? {
        c: common_vendor.t(state.type === 1 ? "认证成功" : "认证失败"),
        d: common_vendor.o(($event) => state.popup_show = false),
        e: common_vendor.p({
          name: "close",
          color: "#666666",
          size: "5vw"
        }),
        f: state.type === 1 ? "/mine_packages/static/success.png" : "/mine_packages/static/fail.png",
        g: common_vendor.t(state.type === 1 ? "认证已通过" : "信息有误，请修改后再重试"),
        h: common_vendor.o(($event) => state.popup_show = false)
      } : {}, {
        i: state.popup_show
      }, state.popup_show ? {} : {});
    };
  }
});
wx.createPage(_sfc_main);
