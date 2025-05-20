"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "navbar",
  props: {
    title: {
      default: "",
      type: String
    }
  },
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight
    });
    const props = __props;
    const back = () => {
      common_vendor.index.navigateBack({
        fail: () => {
          console.log("返回首页");
          common_vendor.index.switchTab({
            url: "/pages/home/index"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => back()),
        b: common_vendor.p({
          name: "arrow-left",
          size: "5vw",
          color: "#333333"
        }),
        c: common_vendor.t(props.title),
        d: state.statusBarHeight + "px",
        e: state.navigationBarHeight + "px"
      };
    };
  }
});
wx.createComponent(_sfc_main);
