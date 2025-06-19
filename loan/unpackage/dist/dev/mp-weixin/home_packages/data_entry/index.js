"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (navbar + information + information1 + detailed + detailed1 + bankcard + borrowing + borrower + rongdan + houseproperty + otherinfo + confirminfo + finish)();
}
const navbar = () => "../../components/navbar.js";
const information = () => "../../components/data_components/information.js";
const information1 = () => "../../components/data_components/information1.js";
const detailed = () => "../../components/data_components/detailed.js";
const detailed1 = () => "../../components/data_components/detailed1.js";
const bankcard = () => "../../components/data_components/bankcard.js";
const borrowing = () => "../../components/data_components/borrowing.js";
const borrower = () => "../../components/data_components/borrower.js";
const rongdan = () => "../../components/data_components/rongdan.js";
const houseproperty = () => "../../components/data_components/houseproperty.js";
const otherinfo = () => "../../components/data_components/otherinfo.js";
const confirminfo = () => "../../components/data_components/confirminfo.js";
const finish = () => "../../components/data_components/finish.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    id: {
      type: String
    },
    type: {
      type: Number
    }
  },
  setup(__props) {
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      step: 1
    });
    const props = __props;
    common_vendor.index.setStorageSync("goods_id", props.id);
    const nextStep = () => {
      if (state.step === 10) {
        common_vendor.index.switchTab({
          url: "/pages/home/index"
        });
        return;
      }
      state.step++;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "数据录入"
        }),
        b: state.step === 1 && props.type === 1
      }, state.step === 1 && props.type === 1 ? {
        c: common_vendor.o(($event) => nextStep())
      } : {}, {
        d: state.step === 1 && props.type === 2
      }, state.step === 1 && props.type === 2 ? {
        e: common_vendor.o(($event) => nextStep())
      } : {}, {
        f: state.step === 2 && props.type === 1
      }, state.step === 2 && props.type === 1 ? {
        g: common_vendor.o(($event) => nextStep())
      } : {}, {
        h: state.step === 2 && props.type === 2
      }, state.step === 2 && props.type === 2 ? {
        i: common_vendor.o(($event) => nextStep())
      } : {}, {
        j: state.step === 3
      }, state.step === 3 ? {
        k: common_vendor.o(($event) => nextStep())
      } : {}, {
        l: state.step === 4
      }, state.step === 4 ? {
        m: common_vendor.o(($event) => nextStep())
      } : {}, {
        n: state.step === 5
      }, state.step === 5 ? {
        o: common_vendor.o(($event) => nextStep())
      } : {}, {
        p: state.step === 6
      }, state.step === 6 ? {
        q: common_vendor.o(($event) => nextStep())
      } : {}, {
        r: state.step === 7
      }, state.step === 7 ? {
        s: common_vendor.o(($event) => nextStep())
      } : {}, {
        t: state.step === 8
      }, state.step === 8 ? {
        v: common_vendor.o(($event) => nextStep())
      } : {}, {
        w: state.step === 9
      }, state.step === 9 ? {
        x: common_vendor.o(($event) => nextStep()),
        y: common_vendor.o(($event) => state.step = 1),
        z: common_vendor.p({
          type: props.type
        })
      } : {}, {
        A: state.step === 10
      }, state.step === 10 ? {
        B: common_vendor.o(($event) => nextStep())
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
