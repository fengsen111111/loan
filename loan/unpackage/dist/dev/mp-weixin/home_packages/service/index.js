"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jump = require("../../utils/jump.js");
if (!Array) {
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  _easycom_u_parse2();
}
const _easycom_u_parse = () => "../../node-modules/uview-plus/components/u-parse/u-parse.js";
if (!Math) {
  (navbar + _easycom_u_parse + optionBt)();
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
    const nextStep = () => {
      if (state.flag) {
        utils_jump.navigateTo("/home_packages/service_form/index");
      }
    };
    const state = common_vendor.reactive({
      flag: false,
      html_content: ``
    });
    globalProxy.$request("/loan/Setting/getCreditAuthContent").then((res) => {
      state.html_content = res.data.content;
    });
    common_vendor.nextTick$1(() => {
      let windowHeight;
      common_vendor.index.getSystemInfoAsync({
        success: (info) => {
          windowHeight = info.windowHeight;
        }
      });
      common_vendor.index.createSelectorQuery().select(".parse_content").boundingClientRect().exec((res) => {
        if (windowHeight >= res[0].height) {
          state.flag = true;
        }
      });
    });
    common_vendor.onReachBottom(() => {
      state.flag = true;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "数据服务授权"
        }),
        b: common_vendor.p({
          content: state.html_content
        }),
        c: common_vendor.o(($event) => nextStep()),
        d: common_vendor.p({
          confirmText: "确定",
          confirmBgColor: state.flag ? "#F97E39" : "#F6F7FB",
          confirmColor: state.flag ? "#FFFFFF" : "#999999"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
