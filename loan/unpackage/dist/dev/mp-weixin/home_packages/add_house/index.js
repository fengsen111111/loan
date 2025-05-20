"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_jump = require("../../utils/jump.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  (_easycom_u_icon2 + _easycom_u_picker2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_picker = () => "../../node-modules/uview-plus/components/u-picker/u-picker.js";
if (!Math) {
  (navbar + _easycom_u_icon + optionBt + _easycom_u_picker)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    type: { type: Number },
    houseIndex: { type: Number }
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
      houseImg: "",
      // 公共回显值
      pub_value: [],
      // 公共picker
      pub_picker: false,
      // 公共picker列表
      column: {},
      pub_name: "",
      select_value: 0,
      address_show: false,
      columns: [],
      firstIndex: 0,
      dxMoney: ""
      //大写金额
    });
    const formData = common_vendor.reactive({
      city_address: "",
      address: "",
      house_mortgage_order: "",
      area: "",
      house_has_type: "",
      house_use_type: "",
      house_power_type: "",
      price: "",
      card_number: "",
      card_name: "",
      owners: [],
      weituo_person: []
    });
    common_vendor.onMounted(() => {
      if (props.type === 2) {
        Object.assign(formData, common_vendor.index.getStorageSync("houseArray")[props.houseIndex]);
      } else {
        common_vendor.index.removeStorageSync("ownerArray");
      }
    });
    const moneyChange = () => {
      ToString(formData.price);
    };
    const ToString = (n) => {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        state.dxMoney = "数据非法";
        return false;
      }
      var unit = "千佰拾亿千佰拾万千佰拾元角分", str = "";
      n += "00";
      var indexpoint = n.indexOf(".");
      if (indexpoint >= 0) {
        n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2);
      }
      unit = unit.substr(unit.length - n.length);
      for (var i = 0; i < n.length; i++) {
        str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
      }
      state.dxMoney = str.replace(/零(千|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
      return false;
    };
    const deleteInfo = (index) => {
      formData.owners.splice(index, 1);
    };
    const navTo = () => {
      common_vendor.index.setStorageSync("ownerArray", formData.owners);
      common_vendor.index.navigateTo({
        url: "/home_packages/ownership/index"
      });
    };
    const deleteInfoTwo = (index) => {
      formData.weituo_person.splice(index, 1);
    };
    const navToTwo = () => {
      common_vendor.index.setStorageSync("weituo_personArray", formData.weituo_person);
      common_vendor.index.navigateTo({
        url: "/home_packages/weituo_person/index"
      });
    };
    const nextStep = () => {
      if (formData.address === "" || formData.area === "" || formData.card_number === "" || formData.card_name === "" || formData.house_has_type === "" || formData.house_mortgage_order === "" || formData.house_power_type === "" || formData.house_use_type === "" || formData.owners.length === 0 || formData.price === "") {
        openTips("资料未填写完成");
        return;
      }
      let array;
      if (props.type === 2) {
        array = common_vendor.index.getStorageSync("houseArray");
        array[props.houseIndex] = formData;
      } else {
        if (common_vendor.index.getStorageSync("houseArray")) {
          array = common_vendor.index.getStorageSync("houseArray");
          array.push(formData);
        } else {
          array = [];
          array.push(formData);
        }
      }
      common_vendor.index.setStorageSync("houseArray", array);
      common_vendor.index.removeStorageSync("ownerArray");
      common_vendor.index.removeStorageSync("weituo_personArray");
      utils_jump.back();
    };
    const uploadImg = () => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          state.houseImg = res.tempFiles[0].path;
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
            common_vendor.index.request({
              url: "https://bdcqz.market.alicloudapi.com/ocrservice/estateCert",
              header: {
                "Authorization": "APPCODE 5076c8ae1e57459986eb77b688d5d91d"
              },
              method: "POST",
              data: {
                url: result.data.url
              },
              success: (scan) => {
                let scanData = scan.data.data;
                formData.address = scanData["坐落"];
                formData.area = scanData["房屋建筑面积"];
                formData.card_number = scanData["证号"];
              }
            });
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("ownerArray")) {
        formData.owners = common_vendor.index.getStorageSync("ownerArray");
      }
      if (common_vendor.index.getStorageSync("weituo_personArray")) {
        formData.weituo_person = common_vendor.index.getStorageSync("weituo_personArray");
      }
    });
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
      formData.city_address = "";
      e.value.map((item, index) => {
        formData.city_address += index === e.value.length - 1 ? item.label : item.label + "-";
      });
      close();
    };
    const changeHandler = (e) => {
      const { columnIndex, index } = e;
      if (columnIndex === 0) {
        if (state.columns[0][index].children.length) {
          uPickerRef.value.setColumnValues(1, state.columns[0][index].children);
          uPickerRef.value.setColumnValues(2, state.columns[0][index].children[0].children);
        } else {
          uPickerRef.value.setColumnValues(1, []);
          uPickerRef.value.setColumnValues(2, []);
        }
        state.firstIndex = index;
      }
      if (columnIndex === 1) {
        uPickerRef.value.setColumnValues(2, state.columns[0][state.firstIndex].children[index].children);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: props.type === 1 ? "新增房产信息" : "编辑房产信息"
        }),
        b: common_vendor.t(formData.city_address),
        c: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        d: common_vendor.o(($event) => chooseAddress()),
        e: formData.address,
        f: common_vendor.o(($event) => formData.address = $event.detail.value),
        g: common_vendor.t(formData.house_mortgage_order),
        h: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        i: common_vendor.o(($event) => showPicker("house_mortgage_order")),
        j: formData.area,
        k: common_vendor.o(($event) => formData.area = $event.detail.value),
        l: common_vendor.t(formData.house_has_type),
        m: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        n: common_vendor.o(($event) => showPicker("house_has_type")),
        o: common_vendor.t(formData.house_use_type),
        p: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        q: common_vendor.o(($event) => showPicker("house_use_type")),
        r: common_vendor.t(formData.house_power_type),
        s: common_vendor.p({
          name: "arrow-down",
          size: "5vw",
          color: "#666666"
        }),
        t: common_vendor.o(($event) => showPicker("house_power_type")),
        v: common_vendor.o(moneyChange),
        w: formData.price,
        x: common_vendor.o(($event) => formData.price = $event.detail.value),
        y: common_vendor.t(state.dxMoney),
        z: formData.card_number,
        A: common_vendor.o(($event) => formData.card_number = $event.detail.value),
        B: formData.card_name,
        C: common_vendor.o(($event) => formData.card_name = $event.detail.value),
        D: common_vendor.f(formData.owners, (i, j, i0) => {
          return common_vendor.e({
            a: common_vendor.t(i.name),
            b: common_vendor.o(($event) => deleteInfo(j), j),
            c: "76c98a10-6-" + i0,
            d: j === 0
          }, j === 0 ? {
            e: common_assets._imports_0$4,
            f: common_vendor.o(($event) => navTo(), j)
          } : {}, {
            g: j,
            h: common_vendor.s(j < formData.owners.length - 1 ? "margin-bottom: 10px;" : "")
          });
        }),
        E: common_vendor.p({
          name: "trash",
          size: "5vw",
          color: "#FF8177"
        }),
        F: formData.owners.length === 0
      }, formData.owners.length === 0 ? {
        G: common_assets._imports_0$4,
        H: common_vendor.o(($event) => navTo())
      } : {}, {
        I: common_vendor.f(formData.weituo_person, (i, j, i0) => {
          return common_vendor.e({
            a: common_vendor.t(i.name),
            b: common_vendor.o(($event) => deleteInfoTwo(j), j),
            c: "76c98a10-7-" + i0,
            d: j === 0
          }, j === 0 ? {
            e: common_assets._imports_0$4,
            f: common_vendor.o(($event) => navToTwo(), j)
          } : {}, {
            g: j,
            h: common_vendor.s(j < formData.weituo_person.length - 1 ? "margin-bottom: 10px;" : "")
          });
        }),
        J: common_vendor.p({
          name: "trash",
          size: "5vw",
          color: "#FF8177"
        }),
        K: formData.weituo_person.length === 0
      }, formData.weituo_person.length === 0 ? {
        L: common_assets._imports_0$4,
        M: common_vendor.o(($event) => navToTwo())
      } : {}, {
        N: state.houseImg
      }, state.houseImg ? {
        O: state.houseImg
      } : {}, {
        P: common_vendor.o(($event) => uploadImg()),
        Q: common_vendor.o(($event) => nextStep()),
        R: common_vendor.p({
          confirmText: "确定"
        }),
        S: state.tips_popup
      }, state.tips_popup ? {
        T: common_vendor.t(state.tipsText)
      } : {}, {
        U: common_vendor.sr(uPickerRef, "76c98a10-9", {
          "k": "uPickerRef"
        }),
        V: common_vendor.o(confirm),
        W: common_vendor.o(changeHandler),
        X: common_vendor.o(($event) => close()),
        Y: common_vendor.o(($event) => close()),
        Z: common_vendor.p({
          show: state.address_show,
          title: "坐落城市",
          columns: state.columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        aa: state.pub_picker
      }, state.pub_picker ? {
        ab: common_vendor.o(($event) => state.pub_picker = false),
        ac: common_vendor.t(state.column[state.pub_name].picker_title),
        ad: common_vendor.o(($event) => picker_confirm()),
        ae: common_vendor.f(state.column[state.pub_name].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        af: state.pub_value,
        ag: common_vendor.o(bindChange)
      } : {}, {
        ah: state.pub_picker
      }, state.pub_picker ? {
        ai: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
