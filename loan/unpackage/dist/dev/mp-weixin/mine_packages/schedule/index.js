"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      current: 1,
      name: "",
      card_number: ""
    });
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const changeTab = (type) => {
      state.name = "";
      state.card_number = "";
      state.current = type;
    };
    const navTo = () => {
      if (state.name === "" || state.card_number === "") {
        openTips("资料未填写完成");
        return;
      }
      common_vendor.index.navigateTo({
        url: "/mine_packages/progress_list/index?card_number=" + state.card_number
      });
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
          title: "进度查询"
        }),
        b: common_vendor.n(state.current === 1 ? "active" : ""),
        c: common_vendor.o(($event) => changeTab(1)),
        d: common_vendor.n(state.current === 2 ? "active" : ""),
        e: common_vendor.o(($event) => changeTab(2)),
        f: state.current === 1
      }, state.current === 1 ? {
        g: state.name,
        h: common_vendor.o(($event) => state.name = $event.detail.value),
        i: state.card_number,
        j: common_vendor.o(($event) => state.card_number = $event.detail.value)
      } : {}, {
        k: state.current === 2
      }, state.current === 2 ? {
        l: state.name,
        m: common_vendor.o(($event) => state.name = $event.detail.value),
        n: state.card_number,
        o: common_vendor.o(($event) => state.card_number = $event.detail.value)
      } : {}, {
        p: common_vendor.o(($event) => navTo()),
        q: state.tips_popup
      }, state.tips_popup ? {
        r: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
