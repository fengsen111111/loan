"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  optionBt();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "capture",
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
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成"
    });
    const formData = common_vendor.reactive({
      house_images: [],
      worker_customer_images: [],
      house_pay_images: [],
      house_contract_images: []
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 8
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
      });
    });
    const nextStep = () => {
      if (formData.house_images.length === 0 || formData.worker_customer_images.length === 0 || formData.house_pay_images.length === 0 || formData.house_contract_images.length === 0) {
        openTips("资料未填写完成");
        return;
      }
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 8,
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
    const uploadImg = (names) => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          common_vendor.index.showLoading({
            title: "上传中，请稍后……"
          });
          const name_array = res.tempFilePaths[0].split("/");
          const name = name_array[name_array.length - 1];
          globalProxy.$request("", {
            file: res.tempFiles[0].path,
            fileType: "file",
            params: {
              fileSize: parseFloat((res.tempFiles[0].size / 1024).toFixed(2)),
              fileName: name
            }
          }).then((result) => {
            formData[names].push(result.data.url);
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: common_vendor.t(formData.house_images.length),
        c: common_vendor.f(formData.house_images, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        d: formData.house_images.length < 3 && !props.showFlag
      }, formData.house_images.length < 3 && !props.showFlag ? {
        e: common_vendor.o(($event) => uploadImg("house_images"))
      } : {}, {
        f: common_vendor.t(formData.worker_customer_images.length),
        g: common_vendor.f(formData.worker_customer_images, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        h: formData.worker_customer_images.length < 3 && !props.showFlag
      }, formData.worker_customer_images.length < 3 && !props.showFlag ? {
        i: common_vendor.o(($event) => uploadImg("worker_customer_images"))
      } : {}, {
        j: common_vendor.t(formData.house_pay_images.length),
        k: common_vendor.f(formData.house_pay_images, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        l: formData.house_pay_images.length < 3 && !props.showFlag
      }, formData.house_pay_images.length < 3 && !props.showFlag ? {
        m: common_vendor.o(($event) => uploadImg("house_pay_images"))
      } : {}, {
        n: common_vendor.t(formData.house_contract_images.length),
        o: common_vendor.f(formData.house_contract_images, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        p: formData.house_contract_images.length < 3 && !props.showFlag
      }, formData.house_contract_images.length < 3 && !props.showFlag ? {
        q: common_vendor.o(($event) => uploadImg("house_contract_images"))
      } : {}, {
        r: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        s: !props.showFlag
      }, !props.showFlag ? {
        t: common_vendor.o(($event) => nextStep())
      } : {}, {
        v: state.tips_popup
      }, state.tips_popup ? {
        w: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
