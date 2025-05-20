"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  (_easycom_u_icon2 + _easycom_u_parse2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_parse = () => "../../node-modules/uview-plus/components/u-parse/u-parse.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_parse + Tabbar)();
}
const Tabbar = () => "../../components/tabbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      popup_state: false,
      html_content: ``,
      userInfo: common_vendor.index.getStorageSync("userInfo"),
      banner: [],
      notice: []
    });
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    common_vendor.onShow(() => {
      globalProxy.$request("/loan/Banner/getBannerList", {
        user_type: "worker"
      }).then((res) => {
        state.banner = res.data.list;
      });
      globalProxy.$request("/loan/Notice/getNoticeList", {
        user_type: "worker"
      }).then((res) => {
        state.notice = res.data.list;
      });
      globalProxy.$request("/loan/User/getUserInfo").then((res) => {
        state.userInfo = res.data;
      });
    });
    const changeState = (id) => {
      globalProxy.$request("/loan/Notice/getNoticeRichText", {
        notice_id: id
      }).then((res) => {
        state.html_content = res.data.content;
        state.popup_state = true;
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: state.statusBarHeight + "px",
        c: state.navigationBarHeight + "px",
        d: common_vendor.f(state.banner, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
              id: item.id,
              url: "/loan/Banner/getBannerRichText"
            }), index),
            c: index
          };
        }),
        e: common_vendor.f(state.notice, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: "7d7f1a5a-0-" + i0,
            c: index,
            d: common_vendor.o(($event) => changeState(item.id), index)
          };
        }),
        f: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        g: state.userInfo.user_type.includes("b") || state.userInfo.user_type.includes("c")
      }, state.userInfo.user_type.includes("b") || state.userInfo.user_type.includes("c") ? common_vendor.e({
        h: state.userInfo.user_type.includes("b")
      }, state.userInfo.user_type.includes("b") ? {
        i: common_assets._imports_1$2,
        j: common_vendor.t(state.userInfo.a_order_number),
        k: common_vendor.o(($event) => _ctx.$navigateTo("/work_packages/submitted/index"))
      } : {}, {
        l: state.userInfo.user_type.includes("c")
      }, state.userInfo.user_type.includes("c") ? {
        m: common_assets._imports_2$2,
        n: common_vendor.t(state.userInfo.b_order_number),
        o: common_vendor.o(($event) => _ctx.$navigateTo("/work_packages/grab/index"))
      } : {}, {
        p: state.userInfo.user_type.includes("c")
      }, state.userInfo.user_type.includes("c") ? {
        q: common_assets._imports_3$2,
        r: common_vendor.t(state.userInfo.c_order_number),
        s: common_vendor.o(($event) => _ctx.$navigateTo("/work_packages/backlog/index"))
      } : {}, {
        t: state.userInfo.user_type.includes("b")
      }, state.userInfo.user_type.includes("b") ? {} : {}, {
        v: state.userInfo.user_type.includes("c") || state.userInfo.user_type.includes("b")
      }, state.userInfo.user_type.includes("c") || state.userInfo.user_type.includes("b") ? {} : {}) : {}, {
        w: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        x: common_vendor.o(($event) => state.popup_state = false),
        y: common_vendor.p({
          content: state.html_content
        }),
        z: state.popup_state,
        A: state.popup_state,
        B: common_vendor.p({
          index: 1
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
