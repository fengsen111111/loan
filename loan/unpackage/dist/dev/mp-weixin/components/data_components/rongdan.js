"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_icon + optionBt)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "rongdan",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.reactive({
      front: "",
      behind: "",
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      checked: [1],
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成"
    });
    const formData = common_vendor.reactive({
      guarantee_persons: common_vendor.index.getStorageSync("companyArray")
    });
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("companyArray")) {
        formData.guarantee_persons = common_vendor.index.getStorageSync("companyArray");
      }
    });
    const deleteData = (index) => {
      formData.guarantee_persons.splice(index, 1);
      if (formData.guarantee_persons.length === 0) {
        common_vendor.index.removeStorageSync("companyArray");
      } else {
        common_vendor.index.setStorageSync("companyArray", formData.guarantee_persons);
      }
    };
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 6
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
      });
    });
    const skipStep = () => {
      emits("next");
    };
    const nextStep = () => {
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 6,
        ...formData
      }).then(() => {
        emits("next");
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        c: common_vendor.f(formData.guarantee_persons, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(_ctx.$cardUtil(item.card_number))
          }, !props.showFlag ? {
            c: common_vendor.o(($event) => deleteData(index), index),
            d: "97c0870e-0-" + i0,
            e: common_vendor.p({
              name: "trash",
              size: "5vw",
              color: "#FF8177"
            })
          } : {}, {
            f: index
          });
        }),
        d: !props.showFlag,
        e: !props.showFlag
      }, !props.showFlag ? {
        f: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/add_personal/index", {
          type: 2
        }))
      } : {}, {
        g: !props.showFlag
      }, !props.showFlag ? {
        h: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/add_enterprise/index", {
          type: 2
        }))
      } : {}, {
        i: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        j: !props.showFlag
      }, !props.showFlag ? {
        k: common_vendor.o(($event) => nextStep()),
        l: common_vendor.o(($event) => skipStep()),
        m: common_vendor.p({
          showCancel: true,
          cancelText: "跳过",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        })
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
