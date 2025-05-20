"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "option-bt",
  props: {
    showCancel: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: ""
    },
    cancelColor: {
      type: String,
      default: ""
    },
    cancelBgColor: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: "下一步"
    },
    confirmColor: {
      type: String,
      default: "#FFFFFF"
    },
    confirmBgColor: {
      type: String,
      default: "#F97E39"
    }
  },
  emits: ["cancel", "confirm"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const cancel = () => {
      emits("cancel");
    };
    const confirm = () => {
      emits("confirm");
    };
    const state = common_vendor.reactive({
      safeAreaBottom: 0
    });
    common_vendor.index.getSystemInfo({
      success: function(res) {
        state.safeAreaBottom = res.screenHeight - res.safeArea.bottom;
      }
    });
    const props = __props;
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.showCancel
      }, props.showCancel ? {
        b: common_vendor.t(props.cancelText),
        c: props.cancelBgColor,
        d: props.cancelColor,
        e: common_vendor.o(($event) => cancel())
      } : {}, {
        f: common_vendor.t(props.confirmText),
        g: props.confirmBgColor,
        h: props.confirmColor,
        i: props.showCancel ? "" : "80vw",
        j: common_vendor.o(($event) => confirm()),
        k: state.safeAreaBottom !== 0 ? state.safeAreaBottom + "px" : ""
      });
    };
  }
});
wx.createComponent(_sfc_main);
