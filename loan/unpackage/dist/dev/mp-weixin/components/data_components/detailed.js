"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_icon + optionBt)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detailed",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
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
      select_value: 0
    });
    const emits = __emit;
    const formData = common_vendor.reactive({
      marriage: "",
      educational: "",
      degree: "",
      occupation: "",
      city_address: "",
      address: "",
      company_name: "",
      industry: "",
      post: "",
      professional_title: "",
      spouse_name: "",
      spouse_id_card: "",
      spouse_mobile: "",
      emergency_contact_name: "",
      emergency_contact_mobile: "",
      emergency_contact_relationship: "",
      other_contact_name: "",
      other_contact_mobile: ""
    });
    if (common_vendor.index.getStorageSync("setInfoFormData")) {
      formData.address = common_vendor.index.getStorageSync("setInfoFormData").id_card_address;
    }
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
      if (formData.marriage === "" || formData.address === "") {
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
    const showPicker = (name) => {
      if (props.showFlag)
        return;
      state.pub_name = name;
      state.pub_picker = true;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: common_vendor.t(formData.marriage),
        c: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        d: common_vendor.o(($event) => showPicker("marriage")),
        e: common_vendor.t(formData.educational),
        f: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        g: common_vendor.o(($event) => showPicker("educational")),
        h: common_vendor.t(formData.degree),
        i: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        j: common_vendor.o(($event) => showPicker("degree")),
        k: common_vendor.t(formData.occupation),
        l: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        m: common_vendor.o(($event) => showPicker("occupation")),
        n: props.showFlag,
        o: formData.city_address,
        p: common_vendor.o(($event) => formData.city_address = $event.detail.value),
        q: props.showFlag,
        r: formData.address,
        s: common_vendor.o(($event) => formData.address = $event.detail.value),
        t: props.showFlag,
        v: formData.company_name,
        w: common_vendor.o(($event) => formData.company_name = $event.detail.value),
        x: common_vendor.t(formData.industry),
        y: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        z: common_vendor.o(($event) => showPicker("industry")),
        A: common_vendor.t(formData.post),
        B: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        C: common_vendor.o(($event) => showPicker("post")),
        D: common_vendor.t(formData.professional_title),
        E: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        F: common_vendor.o(($event) => showPicker("professional_title")),
        G: formData.marriage !== "未婚"
      }, formData.marriage !== "未婚" ? {
        H: props.showFlag,
        I: formData.spouse_name,
        J: common_vendor.o(($event) => formData.spouse_name = $event.detail.value),
        K: props.showFlag,
        L: formData.spouse_id_card,
        M: common_vendor.o(($event) => formData.spouse_id_card = $event.detail.value),
        N: props.showFlag,
        O: formData.spouse_mobile,
        P: common_vendor.o(($event) => formData.spouse_mobile = $event.detail.value)
      } : {}, {
        Q: props.showFlag,
        R: formData.emergency_contact_name,
        S: common_vendor.o(($event) => formData.emergency_contact_name = $event.detail.value),
        T: props.showFlag,
        U: formData.emergency_contact_mobile,
        V: common_vendor.o(($event) => formData.emergency_contact_mobile = $event.detail.value),
        W: common_vendor.t(formData.emergency_contact_relationship),
        X: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        Y: common_vendor.o(($event) => showPicker("emergency_contact_relationship")),
        Z: props.showFlag,
        aa: formData.other_contact_name,
        ab: common_vendor.o(($event) => formData.other_contact_name = $event.detail.value),
        ac: props.showFlag,
        ad: formData.other_contact_mobile,
        ae: common_vendor.o(($event) => formData.other_contact_mobile = $event.detail.value),
        af: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        ag: !props.showFlag
      }, !props.showFlag ? {
        ah: common_vendor.o(($event) => nextStep())
      } : {}, {
        ai: state.tips_popup
      }, state.tips_popup ? {
        aj: common_vendor.t(state.tipsText)
      } : {}, {
        ak: state.pub_picker
      }, state.pub_picker ? {
        al: common_vendor.o(($event) => state.pub_picker = false),
        am: common_vendor.t(state.column[state.pub_name].picker_title),
        an: common_vendor.o(($event) => picker_confirm()),
        ao: common_vendor.f(state.column[state.pub_name].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        ap: state.pub_value,
        aq: common_vendor.o(bindChange)
      } : {}, {
        ar: state.pub_picker
      }, state.pub_picker ? {
        as: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
