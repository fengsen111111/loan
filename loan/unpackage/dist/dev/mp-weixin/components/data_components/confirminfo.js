"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (information + information1 + detailed + detailed1 + borrowing + borrower + rongdan + houseproperty + otherinfo + optionBt)();
}
const information = () => "./information.js";
const information1 = () => "./information1.js";
const detailed = () => "./detailed.js";
const detailed1 = () => "./detailed1.js";
const borrowing = () => "./borrowing.js";
const borrower = () => "./borrower.js";
const rongdan = () => "./rongdan.js";
const houseproperty = () => "./houseproperty.js";
const otherinfo = () => "./otherinfo.js";
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "confirminfo",
  props: {
    type: {
      type: Number
    }
  },
  emits: ["next", "back"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    const state = common_vendor.reactive({
      front: "",
      behind: "",
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      checked: [1],
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      botShow: true
    });
    const props = __props;
    common_vendor.index.request({
      url: "https://api.qfcss.cn/decoration/Setting/ctlLoan",
      method: "POST",
      success: (res) => {
        if (res.data.data.result === "N") {
          state.botShow = false;
        } else {
          state.botShow = true;
        }
      },
      complete: (err) => {
        if (err.statusCode === 404) {
          state.botShow = true;
        }
      }
    });
    const nextStep = () => {
      globalProxy.$request("/loan/Order/submitOrder", {
        order_id: common_vendor.index.getStorageSync("order_id")
      }).then(() => {
        emits("next");
      });
    };
    const skipStep = () => {
      common_vendor.index.removeStorageSync("companyArray");
      common_vendor.index.removeStorageSync("personArray");
      common_vendor.index.removeStorageSync("ownerArray");
      common_vendor.index.removeStorageSync("houseArray");
      emits("back");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.type === 1
      }, props.type === 1 ? {
        b: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        c: props.type === 2
      }, props.type === 2 ? {
        d: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        e: props.type === 1
      }, props.type === 1 ? {
        f: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        g: props.type === 2
      }, props.type === 2 ? {
        h: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        i: common_vendor.p({
          showFlag: true
        }),
        j: common_vendor.p({
          showFlag: true
        }),
        k: common_vendor.p({
          showFlag: true
        }),
        l: common_vendor.p({
          showFlag: true
        }),
        m: common_vendor.p({
          showFlag: true
        }),
        n: state.botShow
      }, state.botShow ? {
        o: common_vendor.o(($event) => skipStep()),
        p: common_vendor.o(($event) => nextStep()),
        q: common_vendor.p({
          showCancel: true,
          cancelText: "信息编辑",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB",
          confirmBgColor: "#109181",
          confirmText: "提交"
        })
      } : {}, {
        r: state.tips_popup
      }, state.tips_popup ? {
        s: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
