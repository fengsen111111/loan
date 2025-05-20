"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dateFormat = require("../../utils/dateFormat.js");
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
  (_easycom_u_icon + optionBt + _easycom_u_picker + _easycom_l_calendar)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "borrowing",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
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
      calenderShow: false,
      // 公共回显值
      pub_value: [],
      // 公共picker
      pub_picker: false,
      // 公共picker列表
      column: {},
      pub_name: "",
      select_value: 0
    });
    const formData = common_vendor.reactive({
      sign_address: "",
      apply_money: "",
      loan_rate: "",
      loan_time_type: "",
      loan_time: "",
      start_time: "",
      end_time: "",
      repayment_type: "",
      use_type: "",
      payment_bank_id: "",
      payment_bank_text: "",
      bank_acctno: "",
      return_bank_id: "",
      return_bank_text: "",
      bank_name: "",
      bank_number: "",
      return_bank: {
        bank_name: "",
        bank_acctno: ""
      }
    });
    common_vendor.onShow(() => {
    });
    const addMonths = (date, months) => {
      let newDate;
      if (isNaN(Number(date))) {
        newDate = new Date(date);
      } else {
        newDate = new Date(Number(date));
        formData.start_time = utils_dateFormat.dateFormat(new Date(Number(date)), "yyyy-MM-dd");
      }
      newDate.setMonth(newDate.getMonth() + months);
      return utils_dateFormat.dateFormat(newDate, "yyyy-MM-dd");
    };
    common_vendor.onMounted(() => {
      if (common_vendor.index.getStorageSync("loan_time")) {
        formData.loan_time = common_vendor.index.getStorageSync("loan_time");
        formData.start_time = common_vendor.index.getStorageSync("order_time").split(" ")[0];
        formData.end_time = addMonths(formData.start_time, Number(formData.loan_time.slice(0, -1)));
      }
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 4
      }).then((res) => {
        Object.assign(formData, res.data.order_material);
        formData.bank_name = res.data.bank_name;
        formData.bank_acctno = res.data.bank_acctno;
        formData.return_bank = res.data.return_bank;
      });
    });
    const nextStep = () => {
      if (formData.sign_address === "" || formData.apply_money === "" || formData.loan_rate === "" || formData.loan_time_type === "" || formData.loan_time === "" || formData.start_time === "" || formData.repayment_type === "" || formData.use_type === "" || formData.payment_bank_id === "") {
        openTips("资料未填写完成");
        return;
      }
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 4,
        ...formData
      }).then(() => {
        emits("next");
      });
    };
    const handleConfirm = (e) => {
      formData.start_time = e.startDate;
      formData.end_time = e.endDate;
      state.calenderShow = false;
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
    const picker_confirm = () => {
      formData[state.pub_name] = state.column[state.pub_name].list[state.select_value].name;
      state.select_value = 0;
      state.pub_picker = false;
    };
    const showPicker = (name) => {
      if (props.showFlag)
        return;
      state.pub_name = name;
      state.pub_picker = true;
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
      formData.sign_address = "";
      e.value.map((item, index) => {
        formData.sign_address += index === e.value.length - 1 ? item.label : item.label + "-";
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
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: common_vendor.t(formData.sign_address),
        c: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        d: common_vendor.o(($event) => chooseAddress()),
        e: props.showFlag,
        f: formData.apply_money,
        g: common_vendor.o(($event) => formData.apply_money = $event.detail.value),
        h: props.showFlag,
        i: formData.loan_rate,
        j: common_vendor.o(($event) => formData.loan_rate = $event.detail.value),
        k: common_vendor.t(formData.loan_time_type),
        l: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        m: common_vendor.o(($event) => showPicker("loan_time_type")),
        n: common_vendor.t(formData.loan_time),
        o: common_vendor.t(formData.start_time ? formData.start_time + " - " + formData.end_time : ""),
        p: common_vendor.t(formData.repayment_type),
        q: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        r: common_vendor.o(($event) => showPicker("repayment_type")),
        s: common_vendor.t(formData.use_type),
        t: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        v: common_vendor.o(($event) => showPicker("use_type")),
        w: common_vendor.t(formData.bank_name),
        x: common_vendor.t(formData.bank_acctno),
        y: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        z: common_vendor.o(($event) => props.showFlag ? "" : _ctx.$navigateTo("/home_packages/select_bank_card/index", {
          type: 1
        })),
        A: common_vendor.t(formData.return_bank.bank_name),
        B: common_vendor.t(formData.return_bank.bank_acctno),
        C: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        D: common_vendor.o(($event) => props.showFlag ? "" : _ctx.$navigateTo("/home_packages/select_bank_card/index", {
          type: 2
        })),
        E: !props.showFlag
      }, !props.showFlag ? {
        F: common_vendor.o(($event) => nextStep())
      } : {}, {
        G: state.tips_popup
      }, state.tips_popup ? {
        H: common_vendor.t(state.tipsText)
      } : {}, {
        I: common_vendor.sr(uPickerRef, "00d0cfb2-7", {
          "k": "uPickerRef"
        }),
        J: common_vendor.o(confirm),
        K: common_vendor.o(changeHandler),
        L: common_vendor.o(($event) => close()),
        M: common_vendor.o(($event) => close()),
        N: common_vendor.p({
          show: state.address_show,
          title: "合同签署地",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        O: common_vendor.o(handleConfirm),
        P: common_vendor.o(($event) => state.calenderShow = false),
        Q: common_vendor.p({
          visible: state.calenderShow,
          isRange: true
        }),
        R: state.pub_picker
      }, state.pub_picker ? {
        S: common_vendor.o(($event) => state.pub_picker = false),
        T: common_vendor.t(state.column[state.pub_name].picker_title),
        U: common_vendor.o(($event) => picker_confirm()),
        V: common_vendor.f(state.column[state.pub_name].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        W: state.pub_value,
        X: common_vendor.o(bindChange)
      } : {}, {
        Y: state.pub_picker
      }, state.pub_picker ? {
        Z: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
