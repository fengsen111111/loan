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
      popup_show: false,
      type: 2,
      current: 1,
      codeNum: 59,
      timer: null,
      codeText: "发送验证码"
    });
    const getCode = () => {
      if (state.codeNum < 59)
        return;
      state.codeText = state.codeNum + "后重发";
      state.timer = setInterval(() => {
        state.codeNum--;
        state.codeText = state.codeNum + "后重发";
        if (state.codeNum === 1) {
          clearInterval(state.timer);
          state.codeText = "重新发送";
          state.codeNum = 59;
          state.timer = null;
        }
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "手机认证"
        }),
        b: common_vendor.t(state.codeText),
        c: common_vendor.o(($event) => getCode()),
        d: state.timer ? "1px solid #999999;" : "",
        e: state.timer ? "#999999;" : "",
        f: state.popup_show
      }, state.popup_show ? {
        g: common_vendor.t(state.type === 1 ? "认证成功" : "认证失败"),
        h: common_vendor.o(($event) => state.popup_show = false),
        i: common_vendor.p({
          name: "close",
          color: "#666666",
          size: "5vw"
        }),
        j: state.type === 1 ? "/mine_packages/static/success.png" : "/mine_packages/static/fail.png",
        k: common_vendor.t(state.type === 1 ? "认证已通过" : "信息有误，请修改后再重试"),
        l: common_vendor.o(($event) => state.popup_show = false)
      } : {}, {
        m: state.popup_show
      }, state.popup_show ? {} : {});
    };
  }
});
wx.createPage(_sfc_main);
