"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_dateFormat = require("../../utils/dateFormat.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_radio2 = common_vendor.resolveComponent("u-radio");
  const _easycom_u_radio_group2 = common_vendor.resolveComponent("u-radio-group");
  const _easycom_l_calendar2 = common_vendor.resolveComponent("l-calendar");
  (_easycom_u_icon2 + _easycom_u_radio2 + _easycom_u_radio_group2 + _easycom_l_calendar2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_radio = () => "../../node-modules/uview-plus/components/u-radio/u-radio.js";
const _easycom_u_radio_group = () => "../../node-modules/uview-plus/components/u-radio-group/u-radio-group.js";
const _easycom_l_calendar = () => "../../uni_modules/l-calendar/components/l-calendar/l-calendar.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_radio + _easycom_u_radio_group + optionBt + _easycom_l_calendar)();
}
const optionBt = () => "../option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "otherinfo",
  props: {
    showFlag: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    const state = common_vendor.reactive({
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      id_card_array: [
        {
          front: "",
          back: ""
        }
      ],
      calenderShow: false,
      timeKey: ""
    });
    const formData = common_vendor.reactive({
      materials: {
        id_card_image: [],
        hukou_image: [],
        marry_image: [],
        house_image: [],
        house_power_image: []
      },
      has_weituo: "N",
      weituo_extend: {
        house_where: "",
        house_book_name: "",
        house_book_number: "",
        name: "",
        card_number: ""
      },
      has_shengming: "N",
      shengming_extend: {
        marry_status: ""
      },
      has_xieyi: "N",
      xieyi_extend: {
        xieyi_type: "a",
        house_where: "",
        marry_time: "",
        marry_end_time: "",
        who_has_house: "",
        who_has: "",
        share_plan: "",
        marry_again_time: "",
        who_has_income: ""
      }
    });
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: common_vendor.index.getStorageSync("order_id"),
        page_number: 9
      }).then((res) => {
        if (res.data.order_material.length === 0)
          return;
        Object.assign(formData, res.data.order_material);
        if (!props.showFlag && formData.materials.id_card_image.length !== 0) {
          state.id_card_array = [];
          let num = formData.materials.id_card_image.length / 2;
          for (let i = 0; i < num; i++) {
            state.id_card_array.push({
              front: formData.materials.id_card_image[i * 2],
              back: formData.materials.id_card_image[i * 2 + 1]
            });
          }
        }
      });
    });
    const deleteImg = (key, index) => {
      formData.materials[key].splice(index, 1);
    };
    const selectTime = (name) => {
      if (props.showFlag)
        return;
      state.timeKey = name;
      state.calenderShow = true;
    };
    const addUploadBox = () => {
      if (props.showFlag)
        return;
      formData.materials.id_card_image = [];
      let flag = true;
      state.id_card_array.map((item) => {
        if (item.front === "" || item.back === "") {
          flag = false;
        }
      });
      if (!flag) {
        openTips("请先上传完整身份证件");
        return;
      }
      state.id_card_array.push({
        front: "",
        back: ""
      });
    };
    const uploadIdImg = (names) => {
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
            state.id_card_array[state.id_card_array.length - 1][names] = result.data.url;
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    const handleConfirm = (e) => {
      formData.xieyi_extend[state.timeKey] = utils_dateFormat.dateFormat(e.result, "yyyy年MM月dd日");
    };
    const nextStep = () => {
      formData.materials.id_card_image = [];
      state.id_card_array.map((item) => {
        if (item.front !== "") {
          formData.materials.id_card_image.push(item.front);
        }
        if (item.back !== "") {
          formData.materials.id_card_image.push(item.back);
        }
      });
      if (formData.materials.id_card_image.length % 2 === 1) {
        openTips("资料未填写完成");
        return;
      }
      if (formData.has_weituo === "Y") {
        if (formData.weituo_extend.house_book_name === "" || formData.weituo_extend.house_book_number === "" || formData.weituo_extend.house_where === "" || formData.weituo_extend.name === "" || formData.weituo_extend.card_number === "") {
          openTips("资料未填写完成");
          return;
        }
      }
      if (formData.has_shengming === "Y") {
        if (formData.shengming_extend.marry_status === "") {
          openTips("资料未填写完成");
          return;
        }
      }
      if (formData.has_xieyi === "Y") {
        if (formData.xieyi_extend.house_where === "" || formData.xieyi_extend.marry_time === "") {
          openTips("资料未填写完成");
          return;
        }
        if (formData.xieyi_extend.xieyi_type === "a") {
          if (formData.xieyi_extend.who_has_income === "" || formData.xieyi_extend.who_has_house === "") {
            openTips("资料未填写完成");
            return;
          }
        }
        if (formData.xieyi_extend.xieyi_type === "b") {
          if (formData.xieyi_extend.who_has_house === "" || formData.xieyi_extend.marry_end_time === "" || formData.xieyi_extend.who_has === "" || formData.xieyi_extend.share_plan === "") {
            openTips("资料未填写完成");
            return;
          }
        }
        if (formData.xieyi_extend.xieyi_type === "c") {
          if (formData.xieyi_extend.marry_end_time === "") {
            openTips("资料未填写完成");
            return;
          }
        }
        if (formData.xieyi_extend.xieyi_type === "d") {
          if (formData.xieyi_extend.marry_again_time === "") {
            openTips("资料未填写完成");
            return;
          }
        }
      }
      globalProxy.$request("/loan/Order/makeOrder", {
        id: common_vendor.index.getStorageSync("order_id"),
        page_number: 9,
        ...formData
      }).then(() => {
        emits("next");
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
    const uploadImg = (names) => {
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
            formData.materials[names].push(result.data.url);
            common_vendor.index.hideLoading();
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        b: !props.showFlag
      }, !props.showFlag ? {
        c: common_vendor.f(state.id_card_array, (item, index, i0) => {
          return common_vendor.e({
            a: item.front
          }, item.front ? {
            b: item.front
          } : {}, {
            c: common_vendor.o(($event) => uploadIdImg("front"), index),
            d: item.back
          }, item.back ? {
            e: item.back
          } : {}, {
            f: common_vendor.o(($event) => uploadIdImg("back"), index),
            g: index
          });
        })
      } : {
        d: common_vendor.f(formData.materials.id_card_image, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        })
      }, {
        e: !props.showFlag
      }, !props.showFlag ? {
        f: common_vendor.o(addUploadBox)
      } : {}, {
        g: common_vendor.f(formData.materials.hukou_image, (item, index, i0) => {
          return common_vendor.e({
            a: item
          }, !props.showFlag ? {
            b: "13d36598-0-" + i0,
            c: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            d: common_vendor.o(($event) => deleteImg("hukou_image", index), index)
          } : {}, {
            e: index
          });
        }),
        h: !props.showFlag,
        i: !props.showFlag
      }, !props.showFlag ? {
        j: common_vendor.o(($event) => uploadImg("hukou_image"))
      } : {}, {
        k: common_vendor.f(formData.materials.marry_image, (item, index, i0) => {
          return common_vendor.e({
            a: item
          }, !props.showFlag ? {
            b: "13d36598-1-" + i0,
            c: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            d: common_vendor.o(($event) => deleteImg("marry_image", index), index)
          } : {}, {
            e: index
          });
        }),
        l: !props.showFlag,
        m: !props.showFlag
      }, !props.showFlag ? {
        n: common_vendor.o(($event) => uploadImg("marry_image"))
      } : {}, {
        o: common_vendor.f(formData.materials.house_image, (item, index, i0) => {
          return common_vendor.e({
            a: item
          }, !props.showFlag ? {
            b: "13d36598-2-" + i0,
            c: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            d: common_vendor.o(($event) => deleteImg("house_image", index), index)
          } : {}, {
            e: index
          });
        }),
        p: !props.showFlag,
        q: !props.showFlag
      }, !props.showFlag ? {
        r: common_vendor.o(($event) => uploadImg("house_image"))
      } : {}, {
        s: common_vendor.f(formData.materials.house_power_image, (item, index, i0) => {
          return common_vendor.e({
            a: item
          }, !props.showFlag ? {
            b: "13d36598-3-" + i0,
            c: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            d: common_vendor.o(($event) => deleteImg("house_power_image", index), index)
          } : {}, {
            e: index
          });
        }),
        t: !props.showFlag,
        v: !props.showFlag
      }, !props.showFlag ? {
        w: common_vendor.o(($event) => uploadImg("house_power_image"))
      } : {}, {
        x: common_vendor.p({
          name: "Y",
          label: "是"
        }),
        y: common_vendor.p({
          name: "N",
          label: "否"
        }),
        z: common_vendor.o(($event) => formData.has_weituo = $event),
        A: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.has_weituo
        }),
        B: formData.has_weituo === "Y"
      }, formData.has_weituo === "Y" ? {
        C: props.showFlag,
        D: formData.weituo_extend.house_where,
        E: common_vendor.o(($event) => formData.weituo_extend.house_where = $event.detail.value),
        F: props.showFlag,
        G: formData.weituo_extend.house_book_name,
        H: common_vendor.o(($event) => formData.weituo_extend.house_book_name = $event.detail.value),
        I: props.showFlag,
        J: formData.weituo_extend.house_book_number,
        K: common_vendor.o(($event) => formData.weituo_extend.house_book_number = $event.detail.value),
        L: props.showFlag,
        M: formData.weituo_extend.name,
        N: common_vendor.o(($event) => formData.weituo_extend.name = $event.detail.value),
        O: props.showFlag,
        P: formData.weituo_extend.card_number,
        Q: common_vendor.o(($event) => formData.weituo_extend.card_number = $event.detail.value)
      } : {}, {
        R: common_vendor.p({
          name: "Y",
          label: "是"
        }),
        S: common_vendor.p({
          name: "N",
          label: "否"
        }),
        T: common_vendor.o(($event) => formData.has_shengming = $event),
        U: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.has_shengming
        }),
        V: formData.has_shengming === "Y"
      }, formData.has_shengming === "Y" ? {
        W: props.showFlag,
        X: formData.shengming_extend.marry_status,
        Y: common_vendor.o(($event) => formData.shengming_extend.marry_status = $event.detail.value)
      } : {}, {
        Z: common_vendor.p({
          name: "Y",
          label: "是"
        }),
        aa: common_vendor.p({
          name: "N",
          label: "否"
        }),
        ab: common_vendor.o(($event) => formData.has_xieyi = $event),
        ac: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.has_xieyi
        }),
        ad: formData.has_xieyi === "Y"
      }, formData.has_xieyi === "Y" ? common_vendor.e({
        ae: common_vendor.p({
          name: "a",
          label: "协议书"
        }),
        af: common_vendor.p({
          name: "b",
          label: "离婚补充协议书"
        }),
        ag: common_vendor.p({
          name: "c",
          label: "婚前确认协议书"
        }),
        ah: common_vendor.p({
          name: "d",
          label: "复婚协议书"
        }),
        ai: common_vendor.o(($event) => formData.xieyi_extend.xieyi_type = $event),
        aj: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.xieyi_extend.xieyi_type
        }),
        ak: props.showFlag,
        al: formData.xieyi_extend.house_where,
        am: common_vendor.o(($event) => formData.xieyi_extend.house_where = $event.detail.value),
        an: common_vendor.t(formData.xieyi_extend.marry_time || "请选择结婚时间"),
        ao: common_vendor.s(formData.xieyi_extend.marry_time ? "" : "color:#777777"),
        ap: common_vendor.o(($event) => selectTime("marry_time")),
        aq: formData.xieyi_extend.xieyi_type === "a" || formData.xieyi_extend.xieyi_type === "b"
      }, formData.xieyi_extend.xieyi_type === "a" || formData.xieyi_extend.xieyi_type === "b" ? {
        ar: props.showFlag,
        as: formData.xieyi_extend.who_has_house,
        at: common_vendor.o(($event) => formData.xieyi_extend.who_has_house = $event.detail.value)
      } : {}, {
        av: formData.xieyi_extend.xieyi_type === "a"
      }, formData.xieyi_extend.xieyi_type === "a" ? {
        aw: props.showFlag,
        ax: formData.xieyi_extend.who_has_income,
        ay: common_vendor.o(($event) => formData.xieyi_extend.who_has_income = $event.detail.value)
      } : {}, {
        az: formData.xieyi_extend.xieyi_type === "b" || formData.xieyi_extend.xieyi_type === "c" || formData.xieyi_extend.xieyi_type === "d"
      }, formData.xieyi_extend.xieyi_type === "b" || formData.xieyi_extend.xieyi_type === "c" || formData.xieyi_extend.xieyi_type === "d" ? {
        aA: common_vendor.t(formData.xieyi_extend.marry_end_time || "请选择离婚时间"),
        aB: common_vendor.s(formData.xieyi_extend.marry_end_time ? "" : "color:#777777"),
        aC: common_vendor.o(($event) => selectTime("marry_end_time"))
      } : {}, {
        aD: formData.xieyi_extend.xieyi_type === "b"
      }, formData.xieyi_extend.xieyi_type === "b" ? {
        aE: props.showFlag,
        aF: formData.xieyi_extend.who_has,
        aG: common_vendor.o(($event) => formData.xieyi_extend.who_has = $event.detail.value),
        aH: props.showFlag,
        aI: formData.xieyi_extend.share_plan,
        aJ: common_vendor.o(($event) => formData.xieyi_extend.share_plan = $event.detail.value)
      } : {}, {
        aK: formData.xieyi_extend.xieyi_type === "d"
      }, formData.xieyi_extend.xieyi_type === "d" ? {
        aL: common_vendor.t(formData.xieyi_extend.marry_again_time || "请选择复婚时间"),
        aM: common_vendor.s(formData.xieyi_extend.marry_again_time ? "" : "color:#777777"),
        aN: common_vendor.o(($event) => selectTime("marry_again_time"))
      } : {}) : {}, {
        aO: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        aP: !props.showFlag
      }, !props.showFlag ? {
        aQ: common_vendor.o(($event) => nextStep())
      } : {}, {
        aR: state.tips_popup
      }, state.tips_popup ? {
        aS: common_vendor.t(state.tipsText)
      } : {}, {
        aT: common_vendor.o(handleConfirm),
        aU: common_vendor.o(($event) => state.calenderShow = false),
        aV: common_vendor.p({
          visible: state.calenderShow,
          isRange: false
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
