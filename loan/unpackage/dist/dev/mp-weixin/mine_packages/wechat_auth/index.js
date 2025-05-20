"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      type: 2
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "微信绑定"
        }),
        b: state.type === 1
      }, state.type === 1 ? {} : {}, {
        c: state.type === 2
      }, state.type === 2 ? {
        d: common_assets._imports_0$8
      } : {}, {
        e: common_vendor.t(state.type === 1 ? "解除绑定" : "绑定")
      });
    };
  }
});
wx.createPage(_sfc_main);
