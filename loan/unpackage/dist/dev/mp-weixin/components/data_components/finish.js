"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  optionBt();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "finish",
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const nextStep = () => {
      emits("next");
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$10,
        b: common_vendor.o(($event) => nextStep()),
        c: common_vendor.p({
          confirmText: "返回首页",
          confirmBgColor: "#F97E39"
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
