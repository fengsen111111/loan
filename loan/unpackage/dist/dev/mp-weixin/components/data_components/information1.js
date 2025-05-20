"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dateFormat = require("../../utils/dateFormat.js");
if (!Array) {
  const _easycom_u_radio2 = common_vendor.resolveComponent("u-radio");
  const _easycom_u_radio_group2 = common_vendor.resolveComponent("u-radio-group");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_radio2 + _easycom_u_radio_group2 + _easycom_u_icon2)();
}
const _easycom_u_radio = () => "../../node-modules/uview-plus/components/u-radio/u-radio.js";
const _easycom_u_radio_group = () => "../../node-modules/uview-plus/components/u-radio-group/u-radio-group.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_radio + _easycom_u_radio_group + _easycom_u_icon + optionBt)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "information1",
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
      pub_picker: false,
      column: [],
      select_value: 0,
      botShow: true
    });
    const formData = common_vendor.reactive({
      license_image: "",
      register_money: "",
      register_money_type: "",
      open_ll_status: "Y",
      work_area: "",
      name: "",
      card_number: ""
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
      formData.register_money_type = state.column[state.select_value].name;
      state.select_value = 0;
      state.pub_picker = false;
    };
    globalProxy.$request("/loan/Dictionary/getDictionary").then((res) => {
      res.data.records.map((item) => {
        if (item.key === "company_register_currency_type") {
          state.column = item.values.map((i) => {
            return {
              name: i
            };
          });
        }
      });
    });
    common_vendor.onMounted(() => {
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
      if (common_vendor.index.getStorageSync("order_id")) {
        formData.id = common_vendor.index.getStorageSync("order_id");
        globalProxy.$request("/loan/Order/getOrderDetail", {
          order_id: formData.id,
          page_number: 1
        }).then((res) => {
          if (res.data.order_material.length === 0)
            return;
          Object.assign(formData, res.data.order_material);
        });
      }
    });
    const nextStep = () => {
      if (formData.name === "" || formData.card_number === "" || formData.register_money === "" || formData.register_money_type === "" || formData.work_area === "") {
        openTips("资料未填写完成");
        return;
      }
      common_vendor.index.setStorageSync("orderInfo", {
        name: formData.name,
        id_card: formData.card_number
      });
      globalProxy.$request("/loan/Order/makeOrder", {
        goods_id: common_vendor.index.getStorageSync("goods_id"),
        type: "company",
        page_number: 1,
        ...formData
      }).then((res) => {
        common_vendor.index.setStorageSync("order_id", res.data.id);
        common_vendor.index.setStorageSync("order_time", utils_dateFormat.dateFormat(/* @__PURE__ */ new Date(), "date"));
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
    const uploadImg = () => {
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
            formData.license_image = result.data.url;
            common_vendor.index.request({
              url: "https://bizlicense.market.alicloudapi.com/rest/160601/ocr/ocr_business_license.json",
              header: {
                "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
              },
              method: "POST",
              data: {
                image: result.data.url
              },
              success: (scan) => {
                let scanData = scan.data;
                formData.work_area = scanData.business;
                formData.name = scanData.name;
                formData.card_number = scanData.reg_num;
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
        b: formData.license_image
      }, formData.license_image ? {
        c: formData.license_image
      } : {}, {
        d: common_vendor.o(($event) => uploadImg()),
        e: props.showFlag,
        f: formData.name,
        g: common_vendor.o(($event) => formData.name = $event.detail.value),
        h: props.showFlag,
        i: formData.card_number,
        j: common_vendor.o(($event) => formData.card_number = $event.detail.value),
        k: props.showFlag,
        l: formData.register_money,
        m: common_vendor.o(($event) => formData.register_money = $event.detail.value),
        n: common_vendor.p({
          name: "Y",
          label: "开通",
          labelSize: "3.2vw"
        }),
        o: common_vendor.p({
          name: "N",
          label: "不开通",
          labelSize: "3.2vw"
        }),
        p: common_vendor.o(($event) => formData.open_ll_status = $event),
        q: common_vendor.p({
          shape: "circle",
          activeColor: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.open_ll_status
        }),
        r: common_vendor.t(formData.register_money_type),
        s: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        t: common_vendor.o(($event) => showPicker()),
        v: props.showFlag,
        w: formData.work_area,
        x: common_vendor.o(($event) => formData.work_area = $event.detail.value),
        y: !props.showFlag && state.botShow
      }, !props.showFlag && state.botShow ? {
        z: common_vendor.o(($event) => nextStep())
      } : {}, {
        A: state.tips_popup
      }, state.tips_popup ? {
        B: common_vendor.t(state.tipsText)
      } : {}, {
        C: state.pub_picker
      }, state.pub_picker ? {
        D: common_vendor.o(($event) => state.pub_picker = false),
        E: common_vendor.o(($event) => picker_confirm()),
        F: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        G: common_vendor.o(bindChange)
      } : {}, {
        H: state.pub_picker
      }, state.pub_picker ? {
        I: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
