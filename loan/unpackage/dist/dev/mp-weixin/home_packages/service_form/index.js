"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jump = require("../../utils/jump.js");
if (!Math) {
  (navbar + optionBt)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      timeNum: 59,
      codeTimer: null,
      codeText: "发送验证码",
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      verifyFlag: true
    });
    const formData = common_vendor.reactive({
      verify_code: "",
      auth_mobile: "",
      name: "",
      id_card: "",
      id_card_image_front: "",
      id_card_image_back: ""
    });
    const nextStep = () => {
      if (formData.auth_mobile === "" || formData.id_card === "" || formData.name === "") {
        openTips("资料未填写完成");
        return;
      }
      utils_jump.navigateTo("/home_packages/service_sign/index", formData);
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
              formData.id_card_image_front = result.data.url;
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
                  formData.id_card = scanData.num;
                },
                fail: () => {
                  openTips("请按要求上传身份证人像面（正面）");
                }
              });
            } else {
              formData.id_card_image_back = result.data.url;
            }
            common_vendor.index.hideLoading();
          });
        }
      });
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
        d: common_vendor.o(($event) => uploadImg("front")),
        e: formData.id_card_image_back
      }, formData.id_card_image_back ? {
        f: formData.id_card_image_back
      } : {}, {
        g: common_vendor.o(($event) => uploadImg("back")),
        h: formData.name,
        i: common_vendor.o(($event) => formData.name = $event.detail.value),
        j: formData.id_card,
        k: common_vendor.o(($event) => formData.id_card = $event.detail.value),
        l: formData.auth_mobile,
        m: common_vendor.o(($event) => formData.auth_mobile = $event.detail.value),
        n: common_vendor.o(($event) => nextStep()),
        o: common_vendor.o(($event) => _ctx.$back()),
        p: common_vendor.p({
          showCancel: true,
          cancelText: "返回",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        }),
        q: state.tips_popup
      }, state.tips_popup ? {
        r: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
