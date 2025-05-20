"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
      select_card: 0,
      list: [],
      type: 1
    });
    common_vendor.onLoad((e) => {
      state.type = e.type;
    });
    common_vendor.onShow(() => {
      globalProxy.$request("/loan/User/getOrderBankList", {
        order_id: common_vendor.index.getStorageSync("order_id")
      }).then((res) => {
        state.list = res.data.list;
      });
    });
    const change_card = (index) => {
      state.select_card = index;
    };
    const nextStep = () => {
      common_vendor.index.setStorageSync("bankInfo" + state.type, state.list[state.select_card]);
      utils_jump.back();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "选择银行卡"
        }),
        b: common_vendor.f(state.list, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.bank_name),
            b: common_vendor.t(_ctx.$cardUtil(item.bank_acctno)),
            c: state.select_card === index
          }, state.select_card === index ? {
            d: common_assets._imports_0$2
          } : {}, {
            e: index,
            f: common_vendor.o(($event) => change_card(index), index)
          });
        }),
        c: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/add_bank_card/index")),
        d: common_vendor.o(($event) => nextStep()),
        e: common_vendor.p({
          confirmText: "确定"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
