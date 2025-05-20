"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jump = require("../../utils/jump.js");
if (!Math) {
  (navbar + optionBt)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    type: { type: Number }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    common_vendor.ref(null);
    const state = common_vendor.reactive({
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成"
    });
    const formData = common_vendor.reactive({
      name: "",
      id_card: ""
    });
    const nextStep = () => {
      if (formData.id_card === "" || formData.name === "") {
        openTips("资料未填写完成");
        return;
      }
      let array;
      if (common_vendor.index.getStorageSync("weituo_personArray")) {
        array = common_vendor.index.getStorageSync("weituo_personArray");
        array.push(formData);
      } else {
        array = [];
        array.push(formData);
      }
      common_vendor.index.setStorageSync("weituo_personArray", array);
      utils_jump.back();
    };
    const openTips = (text) => {
      state.tipsText = text;
      state.tips_popup = true;
      if (state.tips_timer !== null) {
        clearTimeout(state.tips_timer);
      }
      state.tips_timer = setTimeout(() => {
        state.tips_popup = false;
      }, 2e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "新增受托人"
        }),
        b: formData.name,
        c: common_vendor.o(($event) => formData.name = $event.detail.value),
        d: formData.id_card,
        e: common_vendor.o(($event) => formData.id_card = $event.detail.value),
        f: common_vendor.o(($event) => nextStep()),
        g: common_vendor.p({
          confirmText: "确定"
        }),
        h: state.tips_popup
      }, state.tips_popup ? {
        i: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
