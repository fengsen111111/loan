"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_checkbox2 = common_vendor.resolveComponent("u-checkbox");
  const _easycom_u_checkbox_group2 = common_vendor.resolveComponent("u-checkbox-group");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_checkbox2 + _easycom_u_checkbox_group2 + _easycom_u_icon2)();
}
const _easycom_u_checkbox = () => "../../node-modules/uview-plus/components/u-checkbox/u-checkbox.js";
const _easycom_u_checkbox_group = () => "../../node-modules/uview-plus/components/u-checkbox-group/u-checkbox-group.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + _easycom_u_checkbox + _easycom_u_checkbox_group + optionBt + _easycom_u_icon)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    verify_code: { type: String },
    auth_mobile: { type: String },
    name: { type: String },
    id_card: { type: String },
    id_card_image_front: { type: String },
    id_card_image_back: { type: String },
    auth_sign_image: { type: String }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const props = __props;
    const state = common_vendor.reactive({
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      autograph: "",
      checked: [],
      popup_tips: false,
      flag: true
    });
    const formData = common_vendor.reactive({
      ...props,
      auth_sign_image: ""
    });
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("autograph") === "empty") {
        state.autograph = "";
        common_vendor.index.removeStorageSync("autograph");
        return;
      }
      if (common_vendor.index.getStorageSync("autograph")) {
        state.autograph = common_vendor.index.getStorageSync("autograph");
        const name_array = state.autograph.split("/");
        const name = name_array[name_array.length - 1];
        common_vendor.index.getFileSystemManager().getFileInfo({
          filePath: state.autograph,
          success: (res) => {
            globalProxy.$request("", {
              file: state.autograph,
              fileType: "file",
              params: {
                fileSize: parseFloat((res.size / 1024).toFixed(2)),
                fileName: name
              }
            }).then((result) => {
              formData.auth_sign_image = result.data.url;
            });
          }
        });
        common_vendor.index.removeStorageSync("autograph");
      }
    });
    const nextStep = () => {
      if (state.checked[0] !== 1) {
        openTips("请阅读并同意相关授权书");
        return;
      }
      if (formData.auth_sign_image === "") {
        openTips("资料未填写完成");
        return;
      }
      state.popup_tips = true;
    };
    const confirm = () => {
      if (!state.flag)
        return;
      state.popup_tips = false;
      state.flag = false;
      common_vendor.index.showLoading({
        title: "请稍后"
      });
      globalProxy.$request("/loan/User/authorization", formData).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "数据服务授权成功",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          state.flag = true;
          common_vendor.index.switchTab({
            url: "/pages/user_home/index"
          });
        }, 2e3);
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
        a: common_vendor.p({
          title: "数据服务授权"
        }),
        b: formData.id_card_image_front
      }, formData.id_card_image_front ? {
        c: formData.id_card_image_front
      } : {}, {
        d: formData.id_card_image_back
      }, formData.id_card_image_back ? {
        e: formData.id_card_image_back
      } : {}, {
        f: common_vendor.t(formData.name),
        g: common_vendor.t(formData.id_card),
        h: common_vendor.t(formData.auth_mobile),
        i: common_vendor.p({
          name: 1,
          shape: "circle"
        }),
        j: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getDigitalAgreeContent",
          title: "电子签意授权书"
        })),
        k: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getUserMessageAuthContent",
          title: "征信授权书"
        })),
        l: common_vendor.o(($event) => state.checked = $event),
        m: common_vendor.p({
          modelValue: state.checked
        }),
        n: formData.auth_sign_image !== ""
      }, formData.auth_sign_image !== "" ? {
        o: formData.auth_sign_image
      } : {}, {
        p: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/autograph/index", {
          name: formData.name
        })),
        q: common_vendor.o(($event) => nextStep()),
        r: common_vendor.o(($event) => _ctx.$back()),
        s: common_vendor.p({
          confirmText: "提交",
          confirmBgColor: "#1592E6",
          showCancel: true,
          cancelText: "返回",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        }),
        t: state.popup_tips
      }, state.popup_tips ? {
        v: common_vendor.o(($event) => state.popup_tips = false),
        w: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        x: common_vendor.o(($event) => state.popup_tips = false),
        y: common_vendor.o(($event) => confirm())
      } : {}, {
        z: state.popup_tips
      }, state.popup_tips ? {
        A: common_vendor.o(($event) => state.popup_tips = false)
      } : {}, {
        B: state.tips_popup
      }, state.tips_popup ? {
        C: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
