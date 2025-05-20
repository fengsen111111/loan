"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dateFormat = require("../../utils/dateFormat.js");
if (!Array) {
  const _easycom_u_radio2 = common_vendor.resolveComponent("u-radio");
  const _easycom_u_radio_group2 = common_vendor.resolveComponent("u-radio-group");
  const _easycom_u_checkbox2 = common_vendor.resolveComponent("u-checkbox");
  const _easycom_u_checkbox_group2 = common_vendor.resolveComponent("u-checkbox-group");
  const _easycom_l_calendar2 = common_vendor.resolveComponent("l-calendar");
  (_easycom_u_radio2 + _easycom_u_radio_group2 + _easycom_u_checkbox2 + _easycom_u_checkbox_group2 + _easycom_l_calendar2)();
}
const _easycom_u_radio = () => "../../node-modules/uview-plus/components/u-radio/u-radio.js";
const _easycom_u_radio_group = () => "../../node-modules/uview-plus/components/u-radio-group/u-radio-group.js";
const _easycom_u_checkbox = () => "../../node-modules/uview-plus/components/u-checkbox/u-checkbox.js";
const _easycom_u_checkbox_group = () => "../../node-modules/uview-plus/components/u-checkbox-group/u-checkbox-group.js";
const _easycom_l_calendar = () => "../../uni_modules/l-calendar/components/l-calendar/l-calendar.js";
if (!Math) {
  (_easycom_u_radio + _easycom_u_radio_group + _easycom_u_checkbox + _easycom_u_checkbox_group + optionBt + _easycom_l_calendar)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "information",
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
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      checked: [],
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      calenderShow: false,
      verifyFlag: true,
      botShow: true
    });
    const formData = common_vendor.reactive({
      card_image_front: "",
      card_image_back: "",
      name: "",
      card_number: "",
      id_card_address: "",
      open_ll_status: "Y",
      ll_user_type: "INNERUSER",
      ll_bank_acctname: "",
      ll_bank_card_number: "",
      id_card_end_time: "",
      mobile: "",
      verify_code: ""
    });
    const handleConfirm = (e) => {
      formData.id_card_end_time = e.startDate + " - " + e.endDate;
      state.calenderShow = false;
    };
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
      if (state.checked[0] !== 1) {
        openTips("请阅读并同意《用户服务与隐私保护协议》");
        return;
      }
      if (formData.name === "" || formData.card_number === "" || formData.id_card_end_time === "" || formData.mobile === "") {
        openTips("资料未填写完成");
        return;
      }
      if (formData.open_ll_status === "Y") {
        if (formData.ll_bank_acctname === "" || formData.ll_bank_card_number === "") {
          openTips("资料未填写完成");
          return;
        }
      }
      common_vendor.index.setStorageSync("orderInfo", {
        name: formData.name,
        id_card: formData.card_number,
        mobile: formData.mobile
      });
      globalProxy.$request("/loan/Order/makeOrder", {
        goods_id: common_vendor.index.getStorageSync("goods_id"),
        type: "person",
        page_number: 1,
        ...formData
      }).then((res) => {
        common_vendor.index.setStorageSync("order_id", res.data.id);
        common_vendor.index.setStorageSync("order_time", utils_dateFormat.dateFormat(/* @__PURE__ */ new Date(), "date"));
        common_vendor.index.setStorageSync("open_ll_status", formData.open_ll_status);
        common_vendor.index.setStorageSync("setInfoFormData", formData);
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
    const uploadImg = (type) => {
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
            if (type === "front") {
              formData.card_image_front = result.data.url;
              common_vendor.index.request({
                url: "https://cardnumber.market.alicloudapi.com/rest/160601/ocr/ocr_idcard.json",
                header: {
                  "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
                },
                method: "POST",
                data: {
                  image: result.data.url,
                  configure: {
                    side: "face"
                  }
                },
                success: (scan) => {
                  let scanData = scan.data;
                  formData.name = scanData.name;
                  formData.card_number = scanData.num;
                  formData.id_card_address = scanData.address;
                  formData.ll_bank_acctname = scanData.name;
                  formData.ll_bank_card_number = scanData.num;
                },
                fail: () => {
                  openTips("请按要求上传身份证人像面（正面）");
                }
              });
            } else if (type === "back") {
              formData.card_image_back = result.data.url;
              common_vendor.index.request({
                url: "https://cardnumber.market.alicloudapi.com/rest/160601/ocr/ocr_idcard.json",
                header: {
                  "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
                },
                method: "POST",
                data: {
                  image: result.data.url,
                  configure: {
                    side: "back"
                  }
                },
                success: (scan) => {
                  let scanData = scan.data;
                  const regDate = /^(\d{4})(\d{2})(\d{2})$/;
                  formData.id_card_end_time = scanData.start_date.replace(regDate, "$1.$2.$3") + " - " + scanData.end_date.replace(regDate, "$1.$2.$3");
                },
                fail: () => {
                  openTips("请按要求上传身份证国徽面（背面）");
                }
              });
            }
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: formData.card_image_front
      }, formData.card_image_front ? {
        c: formData.card_image_front
      } : {}, {
        d: common_vendor.o(($event) => uploadImg("front")),
        e: formData.card_image_back
      }, formData.card_image_back ? {
        f: formData.card_image_back
      } : {}, {
        g: common_vendor.o(($event) => uploadImg("back")),
        h: props.showFlag,
        i: formData.name,
        j: common_vendor.o(($event) => formData.name = $event.detail.value),
        k: props.showFlag,
        l: formData.card_number,
        m: common_vendor.o(($event) => formData.card_number = $event.detail.value),
        n: props.showFlag,
        o: formData.id_card_address,
        p: common_vendor.o(($event) => formData.id_card_address = $event.detail.value),
        q: common_vendor.t(formData.id_card_end_time || "请选择证件有效期"),
        r: common_vendor.s(formData.id_card_end_time ? "" : "color:#777777"),
        s: common_vendor.o(() => {
          props.showFlag ? "" : state.calenderShow = true;
        }),
        t: common_vendor.p({
          name: "Y",
          label: "开通",
          labelSize: "3.2vw"
        }),
        v: common_vendor.p({
          name: "N",
          label: "不开通",
          labelSize: "3.2vw"
        }),
        w: common_vendor.o(($event) => formData.open_ll_status = $event),
        x: common_vendor.p({
          shape: "circle",
          activeColor: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.open_ll_status
        }),
        y: formData.open_ll_status === "Y"
      }, formData.open_ll_status === "Y" ? {
        z: common_vendor.p({
          name: "INNERUSER",
          label: "个人用户",
          labelSize: "3.2vw"
        }),
        A: common_vendor.p({
          name: "INNERCOMPANY",
          label: "企业用户",
          labelSize: "3.2vw"
        }),
        B: common_vendor.o(($event) => formData.ll_user_type = $event),
        C: common_vendor.p({
          shape: "circle",
          activeColor: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.ll_user_type
        })
      } : {}, {
        D: formData.open_ll_status === "Y"
      }, formData.open_ll_status === "Y" ? {
        E: props.showFlag,
        F: formData.ll_bank_acctname,
        G: common_vendor.o(($event) => formData.ll_bank_acctname = $event.detail.value)
      } : {}, {
        H: formData.open_ll_status === "Y"
      }, formData.open_ll_status === "Y" ? {
        I: props.showFlag,
        J: formData.ll_bank_card_number,
        K: common_vendor.o(($event) => formData.ll_bank_card_number = $event.detail.value)
      } : {}, {
        L: props.showFlag,
        M: formData.mobile,
        N: common_vendor.o(($event) => formData.mobile = $event.detail.value),
        O: !props.showFlag
      }, !props.showFlag ? {
        P: common_vendor.p({
          name: 1,
          shape: "circle",
          activeColor: "#F97E39"
        }),
        Q: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getUserProtocol"
        })),
        R: common_vendor.o(($event) => state.checked = $event),
        S: common_vendor.p({
          modelValue: state.checked
        })
      } : {}, {
        T: !props.showFlag && state.botShow
      }, !props.showFlag && state.botShow ? {
        U: common_vendor.o(($event) => nextStep())
      } : {}, {
        V: state.tips_popup
      }, state.tips_popup ? {
        W: common_vendor.t(state.tipsText)
      } : {}, {
        X: common_vendor.o(handleConfirm),
        Y: common_vendor.o(($event) => state.calenderShow = false),
        Z: common_vendor.p({
          visible: state.calenderShow,
          isRange: true,
          idCard: true
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
