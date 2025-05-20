"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
      userInfo: common_vendor.index.getStorageSync("userInfo")
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "认证管理"
        }),
        b: common_assets._imports_0$7,
        c: common_vendor.t(state.userInfo.mobile),
        d: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        e: common_assets._imports_1$6,
        f: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        g: common_vendor.o(($event) => _ctx.$navigateTo("/mine_packages/realname_auth/index")),
        h: common_assets._imports_2$5,
        i: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
