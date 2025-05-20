"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  (_easycom_u_icon2 + _easycom_u_picker2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_picker = () => "../../node-modules/uview-plus/components/u-picker/u-picker.js";
if (!Math) {
  (_easycom_u_icon + optionBt + _easycom_u_picker)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detailed1",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const state = common_vendor.reactive({
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
      select_value: 0,
      address_title: "",
      address_show: false,
      columns: [],
      firstIndex: 0
    });
    const emits = __emit;
    const uPickerRef = common_vendor.ref(null);
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    const formData = common_vendor.reactive({
      card_type: "",
      card_number: "",
      leader_name: "",
      leader_card_type: "",
      leader_card_number: "",
      leader_mobile: "",
      company_city_address: "",
      company_address: "",
      company_work_city_address: "",
      company_work_address: "",
      company_mobile: ""
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 2
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
      });
    });
    const nextStep = () => {
      if (formData.leader_name === "" || formData.leader_mobile === "" || formData.leader_card_number === "") {
        openTips("资料未填写完成");
        return;
      }
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 2,
        ...formData
      }).then(() => {
        emits("next");
      });
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
    const chooseAddress = (name) => {
      if (props.showFlag)
        return;
      state.address_show = true;
      state.pub_name = name;
    };
    const close = () => {
      state.address_show = false;
    };
    const confirm = (e) => {
      formData[state.pub_name] = "";
      e.value.map((item, index) => {
        formData[state.pub_name] += index === e.value.length - 1 ? item.label : item.label + "-";
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
        b: props.showFlag,
        c: formData.leader_name,
        d: common_vendor.o(($event) => formData.leader_name = $event.detail.value),
        e: common_vendor.t(formData.leader_card_type),
        f: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        g: common_vendor.o(($event) => showPicker("leader_card_type")),
        h: props.showFlag,
        i: formData.leader_card_number,
        j: common_vendor.o(($event) => formData.leader_card_number = $event.detail.value),
        k: props.showFlag,
        l: formData.leader_mobile,
        m: common_vendor.o(($event) => formData.leader_mobile = $event.detail.value),
        n: common_vendor.t(formData.company_city_address),
        o: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        p: common_vendor.o(($event) => chooseAddress("company_city_address")),
        q: props.showFlag,
        r: formData.company_address,
        s: common_vendor.o(($event) => formData.company_address = $event.detail.value),
        t: common_vendor.t(formData.company_work_city_address),
        v: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        w: common_vendor.o(($event) => chooseAddress("company_work_city_address")),
        x: props.showFlag,
        y: formData.company_work_address,
        z: common_vendor.o(($event) => formData.company_work_address = $event.detail.value),
        A: props.showFlag,
        B: formData.company_mobile,
        C: common_vendor.o(($event) => formData.company_mobile = $event.detail.value),
        D: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        E: !props.showFlag
      }, !props.showFlag ? {
        F: common_vendor.o(($event) => nextStep())
      } : {}, {
        G: state.tips_popup
      }, state.tips_popup ? {
        H: common_vendor.t(state.tipsText)
      } : {}, {
        I: common_vendor.sr(uPickerRef, "6ecfa25f-4", {
          "k": "uPickerRef"
        }),
        J: common_vendor.o(confirm),
        K: common_vendor.o(changeHandler),
        L: common_vendor.o(($event) => close()),
        M: common_vendor.o(($event) => close()),
        N: common_vendor.p({
          show: state.address_show,
          title: state.address_title,
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        O: state.pub_picker
      }, state.pub_picker ? {
        P: common_vendor.o(($event) => state.pub_picker = false),
        Q: common_vendor.t(state.column[state.pub_name].picker_title),
        R: common_vendor.o(($event) => picker_confirm()),
        S: common_vendor.f(state.column[state.pub_name].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        T: state.pub_value,
        U: common_vendor.o(bindChange)
      } : {}, {
        V: state.pub_picker
      }, state.pub_picker ? {
        W: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
