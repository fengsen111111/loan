"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  navbar();
}
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    id: { type: String },
    goods_name: { type: String }
  },
  setup(__props) {
    const props = __props;
    const state = common_vendor.reactive({
      info: {}
    });
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: props.id
      }).then((res) => {
        state.info = res.data;
      });
    });
    const callPhone = () => {
      common_vendor.index.makePhoneCall({
        phoneNumber: "18398229564"
      });
    };
    const option = (type) => {
      globalProxy.$request("/loan/Order/checkOrder", {
        order_id: state.info.id,
        status: type
      }).then(() => {
        common_vendor.index.showToast({
          title: "操作成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 2e3);
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "待办件详情"
        }),
        b: state.info.order_material
      }, state.info.order_material ? {
        c: common_vendor.t(state.info.order_material.name),
        d: common_vendor.t(state.info.order_material.mobile),
        e: common_assets._imports_0$6,
        f: common_vendor.o(($event) => callPhone()),
        g: common_vendor.t(props.goods_name),
        h: common_vendor.t(state.info.contract_num),
        i: common_vendor.t(state.info.order_material.apply_money),
        j: common_vendor.t(state.info.rate_type === "day" ? "按天" : state.info.rate_type === "month" ? "按月" : state.info.rate_type === "year" ? "按年" : ""),
        k: common_vendor.t(state.info.loan_rate),
        l: common_vendor.o(($event) => option("a")),
        m: common_vendor.o(($event) => option("b"))
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
