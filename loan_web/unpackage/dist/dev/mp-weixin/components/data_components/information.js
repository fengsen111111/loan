"use strict";
const common_vendor = require("../../common/vendor.js");
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
      checked: [1],
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      calenderShow: false
    });
    const formData = common_vendor.reactive({
      card_image_front: "",
      card_image_back: "",
      name: "",
      card_number: "",
      open_ll_status: "Y",
      ll_user_type: "INNERUSER",
      id_card_end_time: "",
      mobile: "",
      verify_code: ""
    });
    const sendCode = async () => {
      if (formData.mobile === "") {
        openTips("请输入手机号");
        return;
      }
      if (state.codeTimer !== null)
        return;
      const res = await globalProxy.$request("/loan/Setting/getVerifyCode", { mobile: formData.mobile });
      formData.verify_code = res.data.code;
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
    const handleConfirm = (e) => {
      formData.id_card_end_time = e.startDate + " - " + e.endDate;
      state.calenderShow = false;
    };
    common_vendor.onMounted(() => {
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
      if (formData.name === "" || formData.card_number === "" || formData.id_card_end_time === "" || formData.mobile === "" || formData.verify_code === "") {
        openTips("资料未填写完成");
        return;
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
        common_vendor.index.setStorageSync("order_time", res.data.create_time);
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
        n: common_vendor.t(formData.id_card_end_time || "请选择证件有效期"),
        o: common_vendor.s(formData.id_card_end_time ? "" : "color:#777777"),
        p: common_vendor.o(() => {
          props.showFlag ? "" : state.calenderShow = true;
        }),
        q: common_vendor.p({
          name: "Y",
          label: "开通",
          labelSize: "3.2vw"
        }),
        r: common_vendor.p({
          name: "N",
          label: "不开通",
          labelSize: "3.2vw"
        }),
        s: common_vendor.o(($event) => formData.open_ll_status = $event),
        t: common_vendor.p({
          shape: "circle",
          activeColor: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.open_ll_status
        }),
        v: formData.open_ll_status === "Y"
      }, formData.open_ll_status === "Y" ? {
        w: common_vendor.p({
          name: "INNERUSER",
          label: "个人用户",
          labelSize: "3.2vw"
        }),
        x: common_vendor.p({
          name: "INNERCOMPANY",
          label: "企业用户",
          labelSize: "3.2vw"
        }),
        y: common_vendor.o(($event) => formData.ll_user_type = $event),
        z: common_vendor.p({
          shape: "circle",
          activeColor: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.ll_user_type
        })
      } : {}, {
        A: props.showFlag,
        B: formData.mobile,
        C: common_vendor.o(($event) => formData.mobile = $event.detail.value),
        D: !props.showFlag
      }, !props.showFlag ? {
        E: formData.verify_code,
        F: common_vendor.o(($event) => formData.verify_code = $event.detail.value),
        G: common_vendor.t(state.codeText),
        H: common_vendor.o(($event) => sendCode()),
        I: state.codeTimer ? "#999999" : "",
        J: state.codeTimer ? "solid 1px #999999" : ""
      } : {}, {
        K: !props.showFlag
      }, !props.showFlag ? {
        L: common_vendor.p({
          name: 1,
          shape: "circle",
          activeColor: "#F97E39"
        }),
        M: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getUserProtocol"
        })),
        N: common_vendor.o(($event) => state.checked = $event),
        O: common_vendor.p({
          modelValue: state.checked
        })
      } : {}, {
        P: !props.showFlag
      }, !props.showFlag ? {
        Q: common_vendor.o(($event) => nextStep())
      } : {}, {
        R: state.tips_popup
      }, state.tips_popup ? {
        S: common_vendor.t(state.tipsText)
      } : {}, {
        T: common_vendor.o(handleConfirm),
        U: common_vendor.o(($event) => state.calenderShow = false),
        V: common_vendor.p({
          visible: state.calenderShow,
          isRange: true
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
