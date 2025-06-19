"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
  __name: "houseproperty",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
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
      order_type: common_vendor.index.getStorageSync("order_type") !== "b"
    });
    const formData = common_vendor.reactive({
      houses: common_vendor.index.getStorageSync("houseArray")
    });
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("houseArray")) {
        formData.houses = common_vendor.index.getStorageSync("houseArray");
      }
    });
    const changeHouse = (index) => {
      common_vendor.index.navigateTo({
        url: "/home_packages/add_house/index?type=2&houseIndex=" + index
      });
    };
    const skipStep = () => {
      emits("next");
    };
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 7
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
        common_vendor.index.setStorageSync("houseArray", res.data.order_material.houses);
      });
    });
    const nextStep = () => {
      if (formData.houses.length === 0) {
        openTips("资料未填写完成");
        return;
      }
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 7,
        ...formData
      }).then(() => {
        emits("next");
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
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        c: common_vendor.f(formData.houses, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.card_number),
            b: common_vendor.f(item.owners, (iss, iss_index, i1) => {
              return {
                a: common_vendor.t(iss.name),
                b: iss_index
              };
            }),
            c: common_vendor.f(item.weituo_person, (iss, iss_index, i1) => {
              return {
                a: common_vendor.t(iss.name),
                b: iss_index
              };
            }),
            d: common_vendor.t(item.address)
          }, !props.showFlag ? {
            e: common_assets._imports_0$10,
            f: common_vendor.o(($event) => changeHouse(index), index),
            g: "09f9b2a4-0-" + i0,
            h: common_vendor.p({
              name: "trash",
              size: "5vw",
              color: "#FF8177"
            })
          } : {}, {
            i: index
          });
        }),
        d: !props.showFlag,
        e: !props.showFlag
      }, !props.showFlag ? {
        f: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/add_house/index", {
          type: 1
        }))
      } : {}, {
        g: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        h: state.tips_popup
      }, state.tips_popup ? {
        i: common_vendor.t(state.tipsText)
      } : {}, {
        j: !props.showFlag
      }, !props.showFlag ? {
        k: common_vendor.o(($event) => nextStep()),
        l: common_vendor.o(($event) => skipStep()),
        m: common_vendor.p({
          showCancel: state.order_type,
          cancelText: "跳过",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        })
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
