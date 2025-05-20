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
      column: [],
      pub_picker: false,
      select_value: 0
    });
    const formData = common_vendor.reactive({
      bank_name: "",
      bank_number: "",
      bank_mobile: "",
      bank_verify_code: "",
      name: "",
      card_number: ""
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
        formData.name = res.data.name;
        formData.card_number = res.data.card_number;
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
    const sendCode = async () => {
      if (formData.bank_mobile === "") {
        openTips("请输入手机号");
        return;
      }
      if (state.codeTimer !== null)
        return;
      const res = await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.bank_mobile });
      formData.bank_verify_code = res.data.code;
      state.codeText = state.timeNum + "s后重发";
      state.codeTimer = setInterval(() => {
        if (state.timeNum > 1) {
          state.timeNum--;
          state.codeText = state.timeNum + "s后重发";
        } else {
          clearInterval(state.codeTimer);
          state.codeTimer = null;
          state.codeText = "重新发送";
          state.timeNum = 59;
        }
      }, 1e3);
    };
    const nextStep = () => {
      if (formData.bank_name === "" || formData.bank_number === "" || formData.bank_mobile === "" || formData.bank_verify_code === "") {
        openTips("资料未填写完成");
        return;
      }
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
          common_vendor.index.getFileSystemManager().readFile({
            filePath: res.tempFiles[0].path,
            encoding: "base64",
            success: (imgData) => {
              common_vendor.index.request({
                url: "https://yhk.market.alicloudapi.com/rest/160601/ocr/ocr_bank_card.json",
                header: {
                  "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
                },
                method: "POST",
                data: {
                  image: "data:image/jpeg;base64," + imgData.data
                },
                success: (scan) => {
                  let scanData = scan.data;
                  formData.bank_name = scanData.bank_name;
                  formData.bank_number = scanData.card_num;
                }
              });
            }
          });
        }
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
        b: common_vendor.t(formData.name),
        c: common_vendor.t(formData.card_number),
        d: props.showFlag,
        e: formData.bank_number,
        f: common_vendor.o(($event) => formData.bank_number = $event.detail.value),
        g: common_assets._imports_0$1,
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
        p: formData.bank_verify_code,
        q: common_vendor.o(($event) => formData.bank_verify_code = $event.detail.value),
        r: common_vendor.t(state.codeText),
        s: common_vendor.o(($event) => sendCode()),
        t: state.codeTimer ? "#999999" : "",
        v: state.codeTimer ? "solid 1px #999999" : ""
      } : {}, {
        w: !props.showFlag
      }, !props.showFlag ? {
        x: common_vendor.o(($event) => nextStep())
      } : {}, {
        y: state.tips_popup
      }, state.tips_popup ? {
        z: common_vendor.t(state.tipsText)
      } : {}, {
        A: state.pub_picker
      }, state.pub_picker ? {
        B: common_vendor.o(($event) => state.pub_picker = false),
        C: common_vendor.o(($event) => picker_confirm()),
        D: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        E: common_vendor.o(bindChange)
      } : {}, {
        F: state.pub_picker
      }, state.pub_picker ? {
        G: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
