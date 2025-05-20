"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jump = require("../../utils/jump.js");
if (!Array) {
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_l_calendar2 = common_vendor.resolveComponent("l-calendar");
  (_easycom_u_picker2 + _easycom_l_calendar2)();
}
const _easycom_u_picker = () => "../../node-modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_l_calendar = () => "../../uni_modules/l-calendar/components/l-calendar/l-calendar.js";
if (!Math) {
  (navbar + optionBt + _easycom_u_picker + _easycom_l_calendar)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    type: { type: Number }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const uPickerRef = common_vendor.ref(null);
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
      address_show: false,
      columns: [],
      firstIndex: 0,
      calenderShow: false
    });
    const formData = common_vendor.reactive({
      card_image_front: "",
      card_image_back: "",
      name: "",
      mobile: "",
      id_card: "",
      id_card_end_time: "",
      address: ""
      // city_address:''
    });
    formData.address = common_vendor.index.getStorageSync("fczdz");
    common_vendor.index.removeStorageSync("fczdz");
    const handleConfirm = (e) => {
      formData.id_card_end_time = e.startDate + " - " + e.endDate;
      state.calenderShow = false;
    };
    const nextStep = () => {
      if (formData.card_image_back === "" || formData.address === "" || formData.card_image_front === "" || formData.id_card === "" || formData.mobile === "" || formData.id_card_end_time === "" || formData.name === "") {
        openTips("资料未填写完成");
        return;
      }
      let array;
      if (common_vendor.index.getStorageSync("ownerArray")) {
        array = common_vendor.index.getStorageSync("ownerArray");
        array.push(formData);
      } else {
        array = [];
        array.push(formData);
      }
      common_vendor.index.setStorageSync("ownerArray", array);
      utils_jump.back();
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
                  formData.id_card = scanData.num;
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
    globalProxy.$request("/factory_system/Base/getAreas").then((res) => {
      state.columns = [res.data.areas];
      common_vendor.nextTick$1(() => {
        uPickerRef.value.setColumnValues(1, state.columns[0][0].children);
        uPickerRef.value.setColumnValues(2, state.columns[0][0].children[0].children);
      });
    });
    const close = () => {
      state.address_show = false;
    };
    const confirm = (e) => {
      formData.city_address = "";
      e.value.map((item, index) => {
        formData.city_address += index === e.value.length - 1 ? item.label : item.label + "-";
      });
      close();
    };
    const changeHandler = (e) => {
      const { columnIndex, index } = e;
      if (columnIndex === 0) {
        uPickerRef.value.setColumnValues(1, state.columns[0][index].children);
        uPickerRef.value.setColumnValues(2, state.columns[0][index].children[0].children);
        state.firstIndex = index;
      }
      if (columnIndex === 1) {
        uPickerRef.value.setColumnValues(2, state.columns[0][state.firstIndex].children[index].children);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "新增产权人"
        }),
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
        h: formData.name,
        i: common_vendor.o(($event) => formData.name = $event.detail.value),
        j: formData.mobile,
        k: common_vendor.o(($event) => formData.mobile = $event.detail.value),
        l: formData.id_card,
        m: common_vendor.o(($event) => formData.id_card = $event.detail.value),
        n: common_vendor.t(formData.id_card_end_time || "请选择证件有效期"),
        o: common_vendor.s(formData.id_card_end_time ? "" : "color:#777777"),
        p: common_vendor.o(() => {
          state.calenderShow = true;
        }),
        q: formData.address,
        r: common_vendor.o(($event) => formData.address = $event.detail.value),
        s: common_vendor.o(($event) => nextStep()),
        t: common_vendor.p({
          confirmText: "确定"
        }),
        v: state.tips_popup
      }, state.tips_popup ? {
        w: common_vendor.t(state.tipsText)
      } : {}, {
        x: common_vendor.sr(uPickerRef, "0754eaf4-2", {
          "k": "uPickerRef"
        }),
        y: common_vendor.o(confirm),
        z: common_vendor.o(changeHandler),
        A: common_vendor.o(($event) => close()),
        B: common_vendor.o(($event) => close()),
        C: common_vendor.p({
          show: state.address_show,
          title: "居住地城市",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        D: common_vendor.o(handleConfirm),
        E: common_vendor.o(($event) => state.calenderShow = false),
        F: common_vendor.p({
          visible: state.calenderShow,
          isRange: true,
          idCard: true
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
