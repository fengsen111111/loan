"use strict";
const common_vendor = require("../../common/vendor.js");
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
      select_value: 0,
      showPayment: common_vendor.index.getStorageSync("open_ll_status") === "N",
      rate_range: "",
      dxMoney: ""
      //大写金额
    });
    const formData = common_vendor.reactive({
      sign_address: "四川省-成都市-彭州市",
      apply_money: "",
      loan_rate: "",
      loan_time: "",
      start_time: "",
      end_time: "",
      repayment_type: "",
      use_type: "",
      payment_bank_id: "",
      payment_bank_text: "",
      return_bank_id: "",
      return_bank_text: ""
    });
    common_vendor.onShow(() => {
      if (state.showPayment) {
        if (common_vendor.index.getStorageSync("bankInfo1")) {
          const bankInfo = common_vendor.index.getStorageSync("bankInfo1");
          formData.payment_bank_id = bankInfo.id;
          formData.payment_bank_text = (bankInfo.bank_name || "") + " " + bankInfo.bank_acctno;
          common_vendor.index.removeStorageSync("bankInfo1");
        }
      }
      if (common_vendor.index.getStorageSync("bankInfo2")) {
        const bankInfo = common_vendor.index.getStorageSync("bankInfo2");
        formData.return_bank_id = bankInfo.id;
        formData.return_bank_text = (bankInfo.bank_name || "") + " " + bankInfo.bank_acctno;
        common_vendor.index.removeStorageSync("bankInfo2");
      }
    });
    common_vendor.onMounted(() => {
      state.rate_range = common_vendor.index.getStorageSync("rate_range");
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 4
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
      });
    });
    const moneyChange = () => {
      ToString(formData.apply_money);
    };
    const ToString = (n) => {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        state.dxMoney = "数据非法";
        return "数据非法";
      }
      const digit = "零壹贰叁肆伍陆柒捌玖";
      const unit = "仟佰拾亿仟佰拾万仟佰拾元角分";
      let str = "";
      n = n.toString();
      const indexpoint = n.indexOf(".");
      if (indexpoint >= 0) {
        const integer = n.substring(0, indexpoint);
        const decimal = n.substr(indexpoint + 1, 2).padEnd(2, "0");
        n = integer + decimal;
      } else {
        n = n + "00";
      }
      const unitSlice = unit.substr(unit.length - n.length);
      for (let i = 0; i < n.length; i++) {
        const num = parseInt(n.charAt(i), 10);
        str += digit.charAt(num) + unitSlice.charAt(i);
      }
      state.dxMoney = str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    };
    const nextStep = () => {
      if (formData.sign_address === "" || formData.apply_money === "" || formData.loan_rate === "" || formData.loan_time === "" || formData.start_time === "" || formData.repayment_type === "" || formData.use_type === "") {
        openTips("资料未填写完成");
        return;
      }
      if (state.showPayment && formData.payment_bank_id === "") {
        openTips("资料未填写完成");
        return;
      }
      const value = state.rate_range.split("-");
      const minValue = Number(value[0].split("%")[0]);
      const maxValue = Number(value[1].split("%")[0]);
      if (parseFloat(formData.loan_rate) < minValue) {
        openTips(`执行利率设置最小值不能超过产品设置的执行利率：${minValue}-${maxValue}`);
        return;
      }
      if (parseFloat(formData.loan_rate) > maxValue) {
        openTips(`执行利率设置最大值不能超过产品设置的执行利率：${minValue}-${maxValue}`);
        return;
      }
      if (Number(formData.loan_time) > Number(common_vendor.index.getStorageSync("loan_time"))) {
        openTips("贷款期数超过可贷期数");
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
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}/${m}/${d}`;
    };
    const addMonthsChange = (date, months) => {
      const newDate = new Date(date);
      const d = newDate.getDate();
      newDate.setMonth(newDate.getMonth() + months * 1);
      if (newDate.getDate() !== d) {
        newDate.setDate(0);
      }
      return newDate;
    };
    const onChange = () => {
      console.log("贷款期数变化了", formData.loan_time);
      const now = /* @__PURE__ */ new Date();
      const start = new Date(now);
      formData.start_time = formatDate(start);
      const end = addMonthsChange(start, formData.loan_time);
      formData.end_time = formatDate(end);
      console.log(formData.start_time, formData.end_time);
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
        c: common_vendor.o(moneyChange),
        d: props.showFlag,
        e: formData.apply_money,
        f: common_vendor.o(($event) => formData.apply_money = $event.detail.value),
        g: common_vendor.t(state.dxMoney),
        h: "请输入执行利率(" + state.rate_range + ")",
        i: props.showFlag,
        j: formData.loan_rate,
        k: common_vendor.o(($event) => formData.loan_rate = $event.detail.value),
        l: props.showFlag,
        m: common_vendor.o(($event) => onChange()),
        n: formData.loan_time,
        o: common_vendor.o(($event) => formData.loan_time = $event.detail.value),
        p: common_vendor.t(formData.start_time ? formData.start_time + " - " + formData.end_time : "请选择借款期限"),
        q: common_vendor.s(formData.start_time ? "" : "color:#666666"),
        r: common_vendor.o(($event) => state.calenderShow = true),
        s: common_vendor.t(formData.repayment_type),
        t: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        v: common_vendor.o(($event) => showPicker("repayment_type")),
        w: common_vendor.t(formData.use_type),
        x: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        y: common_vendor.o(($event) => showPicker("use_type")),
        z: state.showPayment
      }, state.showPayment ? {
        A: common_vendor.t(formData.payment_bank_text),
        B: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        C: common_vendor.o(($event) => props.showFlag ? "" : _ctx.$navigateTo("/home_packages/select_bank_card/index", {
          type: 1
        }))
      } : {}, {
        D: common_vendor.t(formData.return_bank_text),
        E: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        F: common_vendor.o(($event) => props.showFlag ? "" : _ctx.$navigateTo("/home_packages/select_bank_card/index", {
          type: 2
        })),
        G: !props.showFlag
      }, !props.showFlag ? {
        H: common_vendor.o(($event) => nextStep())
      } : {}, {
        I: state.tips_popup
      }, state.tips_popup ? {
        J: common_vendor.t(state.tipsText)
      } : {}, {
        K: common_vendor.sr(uPickerRef, "0d221e55-5", {
          "k": "uPickerRef"
        }),
        L: common_vendor.o(confirm),
        M: common_vendor.o(changeHandler),
        N: common_vendor.o(($event) => close()),
        O: common_vendor.o(($event) => close()),
        P: common_vendor.p({
          show: state.address_show,
          title: "合同签署地",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        Q: common_vendor.o(handleConfirm),
        R: common_vendor.o(($event) => state.calenderShow = false),
        S: common_vendor.p({
          visible: state.calenderShow,
          isRange: true
        }),
        T: state.pub_picker
      }, state.pub_picker ? {
        U: common_vendor.o(($event) => state.pub_picker = false),
        V: common_vendor.t(state.column[state.pub_name].picker_title),
        W: common_vendor.o(($event) => picker_confirm()),
        X: common_vendor.f(state.column[state.pub_name].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        Y: state.pub_value,
        Z: common_vendor.o(bindChange)
      } : {}, {
        aa: state.pub_picker
      }, state.pub_picker ? {
        ab: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
