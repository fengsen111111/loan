"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      popup_state: false,
      timer: null,
      list: [
        {
          icon: "/home_packages/static/icon1.png",
          title: "智能风控报告查询",
          path: ""
        },
        {
          icon: "/home_packages/static/icon2.png",
          title: "企业智能风控报告查询",
          path: ""
        },
        {
          icon: "/home_packages/static/icon3.png",
          title: "个人法诉报告查询",
          path: ""
        },
        {
          icon: "/home_packages/static/icon4.png",
          title: "公积金查询",
          path: ""
        },
        {
          icon: "/home_packages/static/icon5.png",
          title: "房屋评估",
          path: ""
        }
      ]
    });
    const jump = (url) => {
      if (state.timer !== null) {
        clearTimeout(state.timer);
      }
      if (url === "") {
        state.popup_state = true;
        state.timer = setTimeout(() => {
          state.popup_state = false;
        }, 2e3);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => _ctx.$back()),
        c: common_vendor.p({
          name: "arrow-left",
          size: "5vw",
          color: "#FFFFFF"
        }),
        d: state.statusBarHeight + "px",
        e: state.navigationBarHeight + "px",
        f: common_assets._imports_1$5,
        g: common_vendor.f(state.list, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.title),
            c: "52604cce-1-" + i0,
            d: common_vendor.o(($event) => jump(item.path), index),
            e: index
          };
        }),
        h: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        i: state.popup_state
      }, state.popup_state ? {} : {});
    };
  }
});
wx.createPage(_sfc_main);
