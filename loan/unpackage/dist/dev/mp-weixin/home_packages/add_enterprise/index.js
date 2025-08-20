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
      type: "company",
      name: "",
      card_number: "",
      company_license_image: "",
      company_end_time: "",
      company_work_city: "",
      company_work_address: "",
      company_leader_name: "",
      company_leader_relationship: "",
      company_leader_card_type: "",
      company_leader_card_number: ""
    });
    const uPickerRef = common_vendor.ref(null);
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
    const bindChange = (val) => {
      state.select_value = val.detail.value[0];
    };
    const handleConfirm = (e) => {
      formData.company_end_time = e.startDate + "-" + e.endDate;
      state.calenderShow = false;
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
    const scanBank = () => {
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
            formData.company_license_image = result.data.url;
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
                const regDate = /^(\d{4})(\d{2})(\d{2})$/;
                formData.name = scanData.name;
                formData.card_number = scanData.reg_num;
                formData.company_end_time = scanData.establish_date.replace(regDate, "$1.$2.$3") + " - " + scanData.valid_period.replace(regDate, "$1.$2.$3");
              }
            });
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    const nextStep = () => {
      if (formData.card_number === "" || formData.company_end_time === "" || formData.company_leader_card_number === "" || formData.company_leader_card_type === "" || formData.company_leader_name === "" || formData.company_leader_relationship === "" || formData.company_work_address === "" || formData.company_work_city === "") {
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
      formData.company_work_city = "";
      e.value.map((item, index) => {
        formData.company_work_city += index === e.value.length - 1 ? item.label : item.label + "-";
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
          title: props.type === 1 ? "新增企业共借人" : "新增企业融担方"
        }),
        b: common_vendor.t(props.type === 1 ? "新增企业共借人" : "新增企业融担方"),
        c: formData.company_license_image
      }, formData.company_license_image ? {
        d: formData.company_license_image
      } : {}, {
        e: common_vendor.o(($event) => scanBank()),
        f: formData.name,
        g: common_vendor.o(($event) => formData.name = $event.detail.value),
        h: formData.card_number,
        i: common_vendor.o(($event) => formData.card_number = $event.detail.value),
        j: common_vendor.t(formData.company_end_time || "请选择营业期限"),
        k: common_vendor.s(formData.company_end_time ? "" : "color:#777777"),
        l: common_vendor.o(() => {
          state.calenderShow = true;
        }),
        m: common_vendor.t(formData.company_work_city),
        n: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        o: common_vendor.o(($event) => chooseAddress()),
        p: formData.company_work_address,
        q: common_vendor.o(($event) => formData.company_work_address = $event.detail.value),
        r: formData.company_leader_name,
        s: common_vendor.o(($event) => formData.company_leader_name = $event.detail.value),
        t: common_vendor.t(formData.company_leader_relationship),
        v: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        w: common_vendor.o(($event) => showPicker("company_leader_relationship", "emergency_contact_relationship")),
        x: common_vendor.t(formData.company_leader_card_type),
        y: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        z: common_vendor.o(($event) => showPicker("company_leader_card_type", "leader_card_type")),
        A: formData.company_leader_card_number,
        B: common_vendor.o(($event) => formData.company_leader_card_number = $event.detail.value),
        C: common_vendor.o(($event) => nextStep()),
        D: common_vendor.p({
          confirmText: "确定"
        }),
        E: state.tips_popup
      }, state.tips_popup ? {
        F: common_vendor.t(state.tipsText)
      } : {}, {
        G: common_vendor.sr(uPickerRef, "49bb5ef2-5", {
          "k": "uPickerRef"
        }),
        H: common_vendor.o(confirm),
        I: common_vendor.o(changeHandler),
        J: common_vendor.o(($event) => close()),
        K: common_vendor.o(($event) => close()),
        L: common_vendor.p({
          show: state.address_show,
          title: "办公城市",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        M: state.pub_picker
      }, state.pub_picker ? {
        N: common_vendor.o(($event) => state.pub_picker = false),
        O: common_vendor.t(state.column[state.key].picker_title),
        P: common_vendor.o(($event) => picker_confirm()),
        Q: common_vendor.f(state.column[state.key].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        R: state.pub_value,
        S: common_vendor.o(bindChange)
      } : {}, {
        T: state.pub_picker
      }, state.pub_picker ? {
        U: common_vendor.o(($event) => state.pub_picker = false)
      } : {}, {
        V: common_vendor.o(handleConfirm),
        W: common_vendor.o(($event) => state.calenderShow = false),
        X: common_vendor.p({
          visible: state.calenderShow,
          isRange: true
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
