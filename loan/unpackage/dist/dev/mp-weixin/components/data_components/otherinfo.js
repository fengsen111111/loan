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
    if (common_vendor.index.getStorageSync("setInfoFormData")) {
      state.id_card_array = [{
        front: common_vendor.index.getStorageSync("setInfoFormData").card_image_front,
        back: common_vendor.index.getStorageSync("setInfoFormData").card_image_back
      }];
    }
    const formData = common_vendor.reactive({
      materials: {
        id_card_image: [],
        hukou_image: [],
        marry_image: [],
        house_image: [],
        house_power_image: []
      },
      has_weituo: "Y",
      // weituo_extend: {
      // 	house_where: "",
      // 	house_book_name: "",
      // 	house_book_number: "",
      // 	name: "",
      // 	card_number: ""
      // },
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
    const preImg = (url) => {
      common_vendor.index.previewImage({
        current: url,
        urls: [url]
      });
    };
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
        count: 9,
        success: (res) => {
          common_vendor.index.showLoading({
            title: "上传中，请稍后……"
          });
          res.tempFiles.map((item) => {
            const name_array = item.path.split("/");
            const name = name_array[name_array.length - 1];
            globalProxy.$request("", {
              file: item.path,
              fileType: "file",
              params: {
                fileSize: parseFloat((item.size / 1024).toFixed(2)),
                fileName: name
              }
            }).then((result) => {
              formData.materials[names].push(result.data.url);
              common_vendor.index.hideLoading();
            });
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
            b: common_vendor.o(($event) => preImg(item), index),
            c: index
          };
        })
      }, {
        e: !props.showFlag
      }, !props.showFlag ? {
        f: common_vendor.o(addUploadBox)
      } : {}, {
        g: common_vendor.f(formData.materials.hukou_image, (item, index, i0) => {
          return common_vendor.e({
            a: item,
            b: common_vendor.o(($event) => preImg(item), index)
          }, !props.showFlag ? {
            c: "0adabe04-0-" + i0,
            d: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            e: common_vendor.o(($event) => deleteImg("hukou_image", index), index)
          } : {}, {
            f: index
          });
        }),
        h: !props.showFlag,
        i: !props.showFlag
      }, !props.showFlag ? {
        j: common_vendor.o(($event) => uploadImg("hukou_image"))
      } : {}, {
        k: common_vendor.f(formData.materials.marry_image, (item, index, i0) => {
          return common_vendor.e({
            a: item,
            b: common_vendor.o(($event) => preImg(item), index)
          }, !props.showFlag ? {
            c: "0adabe04-1-" + i0,
            d: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            e: common_vendor.o(($event) => deleteImg("marry_image", index), index)
          } : {}, {
            f: index
          });
        }),
        l: !props.showFlag,
        m: !props.showFlag
      }, !props.showFlag ? {
        n: common_vendor.o(($event) => uploadImg("marry_image"))
      } : {}, {
        o: common_vendor.f(formData.materials.house_image, (item, index, i0) => {
          return common_vendor.e({
            a: item,
            b: common_vendor.o(($event) => preImg(item), index)
          }, !props.showFlag ? {
            c: "0adabe04-2-" + i0,
            d: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            e: common_vendor.o(($event) => deleteImg("house_image", index), index)
          } : {}, {
            f: index
          });
        }),
        p: !props.showFlag,
        q: !props.showFlag
      }, !props.showFlag ? {
        r: common_vendor.o(($event) => uploadImg("house_image"))
      } : {}, {
        s: common_vendor.f(formData.materials.house_power_image, (item, index, i0) => {
          return common_vendor.e({
            a: item,
            b: common_vendor.o(($event) => preImg(item), index)
          }, !props.showFlag ? {
            c: "0adabe04-3-" + i0,
            d: common_vendor.p({
              name: "close-circle",
              size: "20px",
              color: "#000000"
            }),
            e: common_vendor.o(($event) => deleteImg("house_power_image", index), index)
          } : {}, {
            f: index
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
        B: common_vendor.p({
          name: "Y",
          label: "是"
        }),
        C: common_vendor.p({
          name: "N",
          label: "否"
        }),
        D: common_vendor.o(($event) => formData.has_shengming = $event),
        E: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.has_shengming
        }),
        F: formData.has_shengming === "Y"
      }, formData.has_shengming === "Y" ? {
        G: props.showFlag,
        H: formData.shengming_extend.marry_status,
        I: common_vendor.o(($event) => formData.shengming_extend.marry_status = $event.detail.value)
      } : {}, {
        J: common_vendor.p({
          name: "Y",
          label: "是"
        }),
        K: common_vendor.p({
          name: "N",
          label: "否"
        }),
        L: common_vendor.o(($event) => formData.has_xieyi = $event),
        M: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.has_xieyi
        }),
        N: formData.has_xieyi === "Y"
      }, formData.has_xieyi === "Y" ? common_vendor.e({
        O: common_vendor.p({
          name: "a",
          label: "协议书"
        }),
        P: common_vendor.p({
          name: "b",
          label: "离婚补充协议书"
        }),
        Q: common_vendor.p({
          name: "c",
          label: "婚前确认协议书"
        }),
        R: common_vendor.p({
          name: "d",
          label: "复婚协议书"
        }),
        S: common_vendor.o(($event) => formData.xieyi_extend.xieyi_type = $event),
        T: common_vendor.p({
          placement: "row",
          ["active-color"]: "#F97E39",
          disabled: props.showFlag,
          modelValue: formData.xieyi_extend.xieyi_type
        }),
        U: props.showFlag,
        V: formData.xieyi_extend.house_where,
        W: common_vendor.o(($event) => formData.xieyi_extend.house_where = $event.detail.value),
        X: common_vendor.t(formData.xieyi_extend.marry_time || "请选择结婚时间"),
        Y: common_vendor.s(formData.xieyi_extend.marry_time ? "" : "color:#777777"),
        Z: common_vendor.o(($event) => selectTime("marry_time")),
        aa: formData.xieyi_extend.xieyi_type === "a" || formData.xieyi_extend.xieyi_type === "b"
      }, formData.xieyi_extend.xieyi_type === "a" || formData.xieyi_extend.xieyi_type === "b" ? {
        ab: props.showFlag,
        ac: formData.xieyi_extend.who_has_house,
        ad: common_vendor.o(($event) => formData.xieyi_extend.who_has_house = $event.detail.value)
      } : {}, {
        ae: formData.xieyi_extend.xieyi_type === "a"
      }, formData.xieyi_extend.xieyi_type === "a" ? {
        af: props.showFlag,
        ag: formData.xieyi_extend.who_has_income,
        ah: common_vendor.o(($event) => formData.xieyi_extend.who_has_income = $event.detail.value)
      } : {}, {
        ai: formData.xieyi_extend.xieyi_type === "b" || formData.xieyi_extend.xieyi_type === "c" || formData.xieyi_extend.xieyi_type === "d"
      }, formData.xieyi_extend.xieyi_type === "b" || formData.xieyi_extend.xieyi_type === "c" || formData.xieyi_extend.xieyi_type === "d" ? {
        aj: common_vendor.t(formData.xieyi_extend.marry_end_time || "请选择离婚时间"),
        ak: common_vendor.s(formData.xieyi_extend.marry_end_time ? "" : "color:#777777"),
        al: common_vendor.o(($event) => selectTime("marry_end_time"))
      } : {}, {
        am: formData.xieyi_extend.xieyi_type === "b"
      }, formData.xieyi_extend.xieyi_type === "b" ? {
        an: props.showFlag,
        ao: formData.xieyi_extend.who_has,
        ap: common_vendor.o(($event) => formData.xieyi_extend.who_has = $event.detail.value),
        aq: props.showFlag,
        ar: formData.xieyi_extend.share_plan,
        as: common_vendor.o(($event) => formData.xieyi_extend.share_plan = $event.detail.value)
      } : {}, {
        at: formData.xieyi_extend.xieyi_type === "d"
      }, formData.xieyi_extend.xieyi_type === "d" ? {
        av: common_vendor.t(formData.xieyi_extend.marry_again_time || "请选择复婚时间"),
        aw: common_vendor.s(formData.xieyi_extend.marry_again_time ? "" : "color:#777777"),
        ax: common_vendor.o(($event) => selectTime("marry_again_time"))
      } : {}) : {}, {
        ay: !props.showFlag
      }, !props.showFlag ? {} : {}, {
        az: !props.showFlag
      }, !props.showFlag ? {
        aA: common_vendor.o(($event) => nextStep())
      } : {}, {
        aB: state.tips_popup
      }, state.tips_popup ? {
        aC: common_vendor.t(state.tipsText)
      } : {}, {
        aD: common_vendor.o(handleConfirm),
        aE: common_vendor.o(($event) => state.calenderShow = false),
        aF: common_vendor.p({
          visible: state.calenderShow,
          isRange: false
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
