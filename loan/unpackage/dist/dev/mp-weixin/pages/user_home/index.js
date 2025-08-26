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
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      popup_state: false,
      html_content: ``,
      // 没有搜索
      isNotSearch: true,
      // 搜索关键字
      searchVal: "",
      // 列表筛选
      screen_type: 1,
      popup_not_open: false,
      banner: [],
      notice: [],
      labelShow: false
    });
    common_vendor.onShow(() => {
      globalProxy.$request("/loan/Banner/getBannerList", {
        user_type: "user"
      }).then((res) => {
        state.banner = res.data.list;
      });
      globalProxy.$request("/loan/Notice/getNoticeList", {
        user_type: "user"
      }).then((res) => {
        state.notice = res.data.list;
      });
      globalProxy.$request("/loan/Setting/getSwitch").then((res) => {
        state.labelShow = res.data.switch === "Y";
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
    const search = (type) => {
      state.screen_type = type;
      state.isNotSearch = state.searchVal === "";
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.p({
          name: "search",
          size: "6vw",
          color: "#666666"
        }),
        c: common_vendor.o(($event) => search(state.screen_type)),
        d: common_vendor.o(($event) => search(state.screen_type)),
        e: state.searchVal,
        f: common_vendor.o(($event) => state.searchVal = $event.detail.value),
        g: state.statusBarHeight + "px",
        h: state.navigationBarHeight + "px",
        i: common_vendor.f(state.banner, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
              id: item.id,
              url: "/loan/Banner/getBannerRichText"
            }), index),
            c: index
          };
        }),
        j: common_vendor.f(state.notice, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: "b52dd1d4-1-" + i0,
            c: index,
            d: common_vendor.o(($event) => changeState(item.id), index)
          };
        }),
        k: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        l: state.labelShow
      }, state.labelShow ? {
        m: common_assets._imports_1,
        n: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        o: common_vendor.o(($event) => state.popup_not_open = true)
      } : {}, {
        p: common_assets._imports_2,
        q: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        r: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/signing/index")),
        s: common_assets._imports_3,
        t: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        v: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/service/index")),
        w: state.labelShow
      }, state.labelShow ? {
        x: common_assets._imports_4,
        y: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        z: common_vendor.o(($event) => state.popup_not_open = true)
      } : {}, {
        A: state.popup_state
      }, state.popup_state ? {
        B: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        C: common_vendor.o(($event) => state.popup_state = false),
        D: common_vendor.p({
          content: state.html_content
        })
      } : {}, {
        E: state.popup_state,
        F: state.popup_not_open
      }, state.popup_not_open ? {
        G: common_vendor.o(($event) => state.popup_not_open = false),
        H: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        I: common_assets._imports_7,
        J: common_vendor.o(($event) => state.popup_not_open = false)
      } : {}, {
        K: state.popup_not_open,
        L: common_vendor.o(($event) => state.popup_not_open = false),
        M: common_vendor.p({
          index: 0
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
