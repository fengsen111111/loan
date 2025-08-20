"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_jump = require("../../utils/jump.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_l_calendar2 = common_vendor.resolveComponent("l-calendar");
  (_easycom_u_icon2 + _easycom_u_picker2 + _easycom_l_calendar2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_picker = () => "../../node-modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_l_calendar = () => "../../uni_modules/l-calendar/components/l-calendar/l-calendar.js";
if (!Math) {
  (navbar + _easycom_u_icon + optionBt + _easycom_u_picker + _easycom_l_calendar)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    type: { type: Number }
  },
  setup(__props) {
    const props = __props;
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
      // 公共回显值
      pub_value: [],
      // 公共picker
      pub_picker: false,
      // 公共picker列表
      column: {},
      pub_name: "",
      key: "",
      select_value: 0,
      address_show: false,
      columns: [],
      firstIndex: 0,
      calenderShow: false
    });
    const formData = common_vendor.reactive({
      type: "person",
      name: "",
      card_number: "",
      person_mobile: "",
      person_id_card_image_front: "",
      person_id_card_image_back: "",
      person_id_card_end_time: "",
      person_relationship: "",
      person_marriage: "",
      person_city_address: "",
      person_address: ""
    });
    globalProxy.$request("/loan/Dictionary/getDictionary").then((res) => {
      let obj = {};
      res.data.records.map((item) => {
        obj[item.key] = {
          picker_title: item.name,
          list: item.values.map((i) => {
            return {
              name: i
            };
          })
        };
      });
      state.column = obj;
    });
    const handleConfirm = (e) => {
      formData.person_id_card_end_time = e.startDate + " - " + e.endDate;
      state.calenderShow = false;
    };
    const bindChange = (val) => {
      state.select_value = val.detail.value[0];
    };
    const picker_confirm = () => {
      formData[state.pub_name] = state.column[state.key].list[state.select_value].name;
      state.select_value = 0;
      state.pub_picker = false;
    };
    const showPicker = (name, key) => {
      state.pub_name = name;
      state.key = key;
      state.pub_picker = true;
    };
    const nextStep = () => {
      if (formData.card_number === "" || formData.name === "" || formData.person_address === "" || formData.person_id_card_end_time === "" || formData.person_marriage === "" || formData.person_mobile === "" || formData.person_relationship === "" || formData.type === "") {
        openTips("资料未填写完成");
        return;
      }
      let array;
      if (props.type === 1) {
        if (common_vendor.index.getStorageSync("personArray")) {
          array = common_vendor.index.getStorageSync("personArray");
          array.push(formData);
        } else {
          array = [];
          array.push(formData);
        }
        common_vendor.index.setStorageSync("personArray", array);
      } else {
        if (common_vendor.index.getStorageSync("companyArray")) {
          array = common_vendor.index.getStorageSync("companyArray");
          array.push(formData);
        } else {
          array = [];
          array.push(formData);
        }
        common_vendor.index.setStorageSync("companyArray", array);
      }
      utils_jump.back();
    };
    globalProxy.$request("/factory_system/Base/getAreas").then((res) => {
      state.columns = [res.data.areas];
      common_vendor.nextTick$1(() => {
        uPickerRef.value.setColumnValues(1, state.columns[0][0].children);
        uPickerRef.value.setColumnValues(2, state.columns[0][0].children[0].children);
      });
    });
    const chooseAddress = () => {
      state.address_show = true;
    };
    const close = () => {
      state.address_show = false;
    };
    const confirm = (e) => {
      formData.person_city_address = "";
      e.value.map((item, index) => {
        formData.person_city_address += index === e.value.length - 1 ? item.label : item.label + "-";
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
              formData.person_id_card_image_front = result.data.url;
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
              formData.person_id_card_image_back = result.data.url;
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
                  formData.person_id_card_end_time = scanData.start_date.replace(regDate, "$1.$2.$3") + " - " + scanData.end_date.replace(regDate, "$1.$2.$3");
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
        a: common_vendor.p({
          title: props.type === 1 ? "新增个人共借人" : "新增个人融担方"
        }),
        b: common_vendor.t(props.type === 1 ? "新增个人共借人" : "新增个人融担方"),
        c: formData.person_id_card_image_front
      }, formData.person_id_card_image_front ? {
        d: formData.person_id_card_image_front
      } : {}, {
        e: common_vendor.o(($event) => uploadImg("front")),
        f: formData.person_id_card_image_back
      }, formData.person_id_card_image_back ? {
        g: formData.person_id_card_image_back
      } : {}, {
        h: common_vendor.o(($event) => uploadImg("back")),
        i: formData.name,
        j: common_vendor.o(($event) => formData.name = $event.detail.value),
        k: formData.card_number,
        l: common_vendor.o(($event) => formData.card_number = $event.detail.value),
        m: common_vendor.t(formData.person_id_card_end_time || "请选择证件有效期"),
        n: common_vendor.s(formData.person_id_card_end_time ? "" : "color:#777777"),
        o: common_vendor.o(() => {
          state.calenderShow = true;
        }),
        p: formData.person_mobile,
        q: common_vendor.o(($event) => formData.person_mobile = $event.detail.value),
        r: common_vendor.t(formData.person_relationship),
        s: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        t: common_vendor.o(($event) => showPicker("person_relationship", "emergency_contact_relationship")),
        v: common_vendor.t(formData.person_marriage),
        w: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        x: common_vendor.o(($event) => showPicker("person_marriage", "marriage")),
        y: common_vendor.t(formData.person_city_address),
        z: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        A: common_vendor.o(($event) => chooseAddress()),
        B: formData.person_address,
        C: common_vendor.o(($event) => formData.person_address = $event.detail.value),
        D: common_vendor.o(($event) => nextStep()),
        E: common_vendor.p({
          confirmText: "确定"
        }),
        F: state.tips_popup
      }, state.tips_popup ? {
        G: common_vendor.t(state.tipsText)
      } : {}, {
        H: common_vendor.sr(uPickerRef, "d11a6134-5", {
          "k": "uPickerRef"
        }),
        I: common_vendor.o(confirm),
        J: common_vendor.o(changeHandler),
        K: common_vendor.o(($event) => close()),
        L: common_vendor.o(($event) => close()),
        M: common_vendor.p({
          show: state.address_show,
          title: "居住城市",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        N: state.pub_picker
      }, state.pub_picker ? {
        O: common_vendor.o(($event) => state.pub_picker = false),
        P: common_vendor.t(state.column[state.key].picker_title),
        Q: common_vendor.o(($event) => picker_confirm()),
        R: common_vendor.f(state.column[state.key].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        S: state.pub_value,
        T: common_vendor.o(bindChange)
      } : {}, {
        U: state.pub_picker
      }, state.pub_picker ? {
        V: common_vendor.o(($event) => state.pub_picker = false)
      } : {}, {
        W: common_vendor.o(handleConfirm),
        X: common_vendor.o(($event) => state.calenderShow = false),
        Y: common_vendor.p({
          visible: state.calenderShow,
          isRange: true,
          idCard: true
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
