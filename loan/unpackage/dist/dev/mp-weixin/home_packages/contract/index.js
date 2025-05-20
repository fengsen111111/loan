"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_checkbox2 = common_vendor.resolveComponent("u-checkbox");
  const _easycom_u_checkbox_group2 = common_vendor.resolveComponent("u-checkbox-group");
  (_easycom_u_checkbox2 + _easycom_u_checkbox_group2)();
}
const _easycom_u_checkbox = () => "../../node-modules/uview-plus/components/u-checkbox/u-checkbox.js";
const _easycom_u_checkbox_group = () => "../../node-modules/uview-plus/components/u-checkbox-group/u-checkbox-group.js";
if (!Math) {
  (navbar + _easycom_u_checkbox + _easycom_u_checkbox_group + optionBt)();
}
const navbar = () => "../../components/navbar.js";
const optionBt = () => "../../components/option-bt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      checked: [],
      autograph: "",
      info: {},
      tips_popup: false,
      tips_timer: null,
      tipsText: "资料未填写完成",
      flag: true
    });
    const formData = common_vendor.reactive({
      verify_code: common_vendor.index.getStorageSync("user_order_info").verify_code,
      auth_mobile: common_vendor.index.getStorageSync("user_order_info").auth_mobile,
      order_id: "",
      sign_image: ""
    });
    globalProxy.$request("/loan/Order/getUnSignOrderDetail").then((res) => {
      state.info = res.data;
      formData.order_id = res.data.id;
    });
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("autograph") === "empty") {
        state.autograph = "";
        common_vendor.index.removeStorageSync("autograph");
        return;
      }
      if (common_vendor.index.getStorageSync("autograph")) {
        state.autograph = common_vendor.index.getStorageSync("autograph");
        const name_array = state.autograph.split("/");
        const name = name_array[name_array.length - 1];
        common_vendor.index.getFileSystemManager().getFileInfo({
          filePath: state.autograph,
          success: (res) => {
            globalProxy.$request("", {
              file: state.autograph,
              fileType: "file",
              params: {
                fileSize: parseFloat((res.size / 1024).toFixed(2)),
                fileName: name
              }
            }).then((result) => {
              formData.sign_image = result.data.url;
            });
          }
        });
        common_vendor.index.removeStorageSync("autograph");
      }
    });
    const convertCurrency = (money) => {
      var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var cnIntRadice = ["", "拾", "佰", "仟"];
      var cnIntUnits = ["", "万", "亿", "兆"];
      var cnDecUnits = ["角", "分", "毫", "厘"];
      var cnInteger = "整";
      var cnIntLast = "元";
      var maxNum = 1e15;
      let integerNum;
      let decimalNum;
      var chineseStr = "";
      let parts;
      if (money === "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        return "";
      }
      if (money === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      money = money.toString();
      if (money.indexOf(".") === -1) {
        integerNum = money;
        decimalNum = "";
      } else {
        parts = money.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n === "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      if (decimalNum !== "") {
        var decLen = decimalNum.length;
        for (i = 0; i < decLen; i++) {
          n = decimalNum.substr(i, 1);
          if (n !== "0") {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr === "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum === "") {
        chineseStr += cnInteger;
      }
      return chineseStr;
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
    const nextStep = () => {
      if (!state.flag)
        return;
      if (state.checked[0] !== 1) {
        openTips("请阅读并同意相关授权书");
        return;
      }
      if (formData.sign_image === "") {
        openTips("资料未填写完成");
        return;
      }
      state.flag = false;
      common_vendor.index.showLoading({
        title: "请稍后",
        mask: true
      });
      globalProxy.$request("/loan/Order/signOrder", formData).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          mask: true,
          title: "签约成功",
          icon: "success",
          duration: 2e3
        });
        setTimeout(() => {
          state.flag = true;
          common_vendor.index.switchTab({
            url: "/pages/user_home/index"
          });
        }, 2e3);
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          mask: true,
          title: err.message,
          icon: "none",
          duration: 2e3
        });
        state.flag = true;
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "合同确认"
        }),
        b: state.info.order_material
      }, state.info.order_material ? {
        c: common_vendor.t(_ctx.$cardUtil(state.info.order_material.card_number)),
        d: common_vendor.t(state.info.contract_num),
        e: common_vendor.t(state.info.order_material.apply_money),
        f: common_vendor.t(convertCurrency(state.info.order_material.apply_money)),
        g: common_vendor.t(state.info.rate_type === "day" ? "按天" : state.info.rate_type === "month" ? "按月" : state.info.rate_type === "year" ? "按年" : ""),
        h: common_vendor.t(state.info.order_material.loan_time),
        i: common_vendor.t(state.info.order_material.loan_rate),
        j: common_vendor.t(state.info.order_material.repayment_type)
      } : {}, {
        k: common_vendor.p({
          name: 1,
          shape: "circle"
        }),
        l: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getDigitalAgreeContent",
          title: "电子签意授权书"
        })),
        m: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/getUserMessageAuthContent",
          title: "征信授权书"
        })),
        n: common_vendor.o(($event) => state.checked = $event),
        o: common_vendor.p({
          modelValue: state.checked
        }),
        p: formData.sign_image !== ""
      }, formData.sign_image !== "" ? {
        q: formData.sign_image
      } : {}, {
        r: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/autograph/index", {
          name: state.info.order_material.leader_name || state.info.order_material.name
        })),
        s: common_vendor.o(($event) => nextStep()),
        t: common_vendor.o(($event) => _ctx.$back()),
        v: common_vendor.p({
          confirmText: "提交",
          confirmBgColor: "#1592E6",
          showCancel: true,
          cancelText: "返回",
          cancelColor: "#999999",
          cancelBgColor: "#F6F7FB"
        }),
        w: state.tips_popup
      }, state.tips_popup ? {
        x: common_vendor.t(state.tipsText)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
