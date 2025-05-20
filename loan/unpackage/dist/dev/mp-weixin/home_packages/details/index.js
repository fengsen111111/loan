"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_jump = require("../../utils/jump.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + optionBt + _easycom_u_icon)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    id: {
      type: String
    },
    type: {
      type: Number
    },
    order_id: {
      type: String
    }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      info: {},
      share_popup: false
    });
    const props = __props;
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Goods/getGoodsDetail", {
        goods_id: props.id
      }).then((res) => {
        state.info = res.data;
        common_vendor.index.setStorageSync("order_type", state.info.type);
        common_vendor.index.setStorageSync("loan_time", state.info.loan_cycle);
        common_vendor.index.setStorageSync("rate_range", state.info.rate_range);
      });
    });
    const share = () => {
      state.share_popup = true;
    };
    const nextStep = () => {
      if (props.order_id) {
        common_vendor.index.setStorageSync("order_id", props.order_id);
      } else {
        common_vendor.index.removeStorageSync("order_id");
      }
      common_vendor.index.removeStorageSync("companyArray");
      common_vendor.index.removeStorageSync("personArray");
      common_vendor.index.removeStorageSync("ownerArray");
      common_vendor.index.removeStorageSync("houseArray");
      utils_jump.navigateTo("/home_packages/data_entry/index", { id: props.id, type: props.type });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "产品详情"
        }),
        b: common_vendor.t(state.info.name),
        c: common_vendor.t(state.info.top_limit),
        d: common_vendor.t(state.info.loan_cycle),
        e: common_vendor.t(state.info.rate_range),
        f: common_vendor.t(state.info.loan_times),
        g: common_vendor.t(state.info.type === "a" ? "借款" : state.info.type === "b" ? "抵押" : ""),
        h: common_vendor.t(state.info.repayment_method),
        i: common_vendor.t(state.info.special_des),
        j: common_vendor.t(state.info.age_demand),
        k: common_vendor.t(state.info.credit_demand),
        l: common_vendor.t(state.info.goods_demand),
        m: common_vendor.t(state.info.other),
        n: common_vendor.o(($event) => share()),
        o: common_vendor.o(($event) => nextStep()),
        p: common_vendor.p({
          showCancel: true,
          cancelText: "一键分享",
          cancelBgColor: "#109181",
          cancelColor: "#FFFFFF"
        }),
        q: state.share_popup
      }, state.share_popup ? {
        r: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        s: common_vendor.o(($event) => state.share_popup = false),
        t: common_assets._imports_0$1
      } : {}, {
        v: state.share_popup
      }, state.share_popup ? {} : {});
    };
  }
});
wx.createPage(_sfc_main);
