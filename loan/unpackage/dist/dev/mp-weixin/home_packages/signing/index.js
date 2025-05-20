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
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      info: {},
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      verifyFlag: true
    });
    const formData = common_vendor.reactive({
      auth_mobile: "",
      verify_code: ""
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getUnSignOrderDetail").then((res) => {
        state.info = res.data;
      });
    });
    const nextStep = () => {
      if (formData.auth_mobile === "") {
        openTips("资料未填写完成");
        return;
      }
      common_vendor.index.setStorageSync("user_order_info", formData);
      utils_jump.navigateTo("/home_packages/contract/index");
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
          title: "合同签约核实"
        }),
        b: state.info.order_material
      }, state.info.order_material ? {
        c: common_vendor.t(state.info.order_material.name),
        d: common_vendor.t(state.info.order_material.card_number),
        e: formData.auth_mobile,
        f: common_vendor.o(($event) => formData.auth_mobile = $event.detail.value)
      } : {}, {
        g: common_vendor.o(($event) => nextStep()),
        h: common_vendor.o(($event) => _ctx.$back()),
        i: common_vendor.p({
          showCancel: true,
          cancelText: "返回",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        }),
        j: state.tips_popup
      }, state.tips_popup ? {
        k: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
