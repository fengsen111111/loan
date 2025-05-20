"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + _easycom_u_icon)();
}
const navbar = () => "../../components/navbar.js";
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
      list: []
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Message/getMessageList", {
        type: common_vendor.index.getStorageSync("userInfo").user_type === "a" ? "worker" : "user"
      }).then((res) => {
        state.list = res.data.list;
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "我的消息"
        }),
        b: common_vendor.f(state.list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.create_time),
            c: common_vendor.t(item.content),
            d: "41047589-1-" + i0,
            e: index
          };
        }),
        c: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
