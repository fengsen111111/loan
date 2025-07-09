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
  __name: "bankcard",
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
      orderInfo: common_vendor.index.getStorageSync("orderInfo"),
      column: [],
      pub_picker: false,
      select_value: 0,
      verifyFlag: true
    });
    const formData = common_vendor.reactive({
      bank_name: "",
      bank_number: "",
      bank_mobile: ""
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Bank/getBankList").then((res) => {
        state.column = res.data.list;
      });
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 3
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
      });
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 1
      }).then((res) => {
        state.orderInfo = {
          name: res.data.order_material.name,
          id_card: res.data.order_material.card_number
        };
      });
    });
    const showPicker = () => {
      if (props.showFlag)
        return;
      state.pub_picker = true;
    };
    const bindChange = (val) => {
      state.select_value = val.detail.value[0];
    };
    const picker_confirm = () => {
      formData.bank_name = state.column[state.select_value].name;
      state.select_value = 0;
      state.pub_picker = false;
    };
    const nextStep = () => {
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 3,
        ...formData
      }).then(() => {
        emits("next");
      });
    };
    const openScan = () => {
      if (props.showFlag)
        return;
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
            common_vendor.index.request({
              url: "https://yhk.market.alicloudapi.com/rest/160601/ocr/ocr_bank_card.json",
              header: {
                "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
              },
              method: "POST",
              data: {
                image: result.data.url
              },
              success: (scan) => {
                let scanData = scan.data;
                formData.bank_number = scanData.card_num;
              }
            });
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: common_vendor.t(state.orderInfo.name),
        c: common_vendor.t(state.orderInfo.id_card),
        d: props.showFlag,
        e: formData.bank_number,
        f: common_vendor.o(($event) => formData.bank_number = $event.detail.value),
        g: common_assets._imports_0$9,
        h: common_vendor.o(($event) => openScan()),
        i: common_vendor.t(formData.bank_name),
        j: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        k: common_vendor.o(($event) => showPicker()),
        l: props.showFlag,
        m: formData.bank_mobile,
        n: common_vendor.o(($event) => formData.bank_mobile = $event.detail.value),
        o: !props.showFlag
      }, !props.showFlag ? {
        p: common_vendor.o(($event) => nextStep())
      } : {}, {
        q: state.tips_popup
      }, state.tips_popup ? {
        r: common_vendor.t(state.tipsText)
      } : {}, {
        s: state.pub_picker
      }, state.pub_picker ? {
        t: common_vendor.o(($event) => state.pub_picker = false),
        v: common_vendor.o(($event) => picker_confirm()),
        w: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        x: common_vendor.o(bindChange)
      } : {}, {
        y: state.pub_picker
      }, state.pub_picker ? {
        z: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
