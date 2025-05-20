"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_navbar = common_vendor.resolveComponent("navbar");
  const _easycom_u_read_more2 = common_vendor.resolveComponent("u-read-more");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_component_navbar + _easycom_u_read_more2 + _easycom_u_icon2)();
}
const _easycom_u_read_more = () => "../../node-modules/uview-plus/components/u-read-more/u-read-more.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (information + information1 + detailed + detailed1 + bankcard + borrowing + borrower + rongdan + houseproperty + capture + otherinfo + _easycom_u_read_more + _easycom_u_icon)();
}
const information = () => "../../components/data_components/information.js";
const information1 = () => "../../components/data_components/information1.js";
const detailed = () => "../../components/data_components/detailed.js";
const detailed1 = () => "../../components/data_components/detailed1.js";
const bankcard = () => "../../components/data_components/bankcard.js";
const borrowing = () => "../../components/data_components/borrowing.js";
const borrower = () => "../../components/data_components/borrower.js";
const rongdan = () => "../../components/data_components/rongdan.js";
const houseproperty = () => "../../components/data_components/houseproperty.js";
const capture = () => "../../components/data_components/capture.js";
const otherinfo = () => "../../components/data_components/otherinfo.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    const state = common_vendor.reactive({
      id: "",
      com_type: null,
      goods_name: "",
      leftheight: 0,
      step: 1,
      info: {},
      type: {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 4,
        f: 4,
        g: 5,
        z: 2
      }
    });
    const getUrlParams = () => {
      let url = location.href;
      var params = {};
      if (url.indexOf("?") !== -1) {
        var queryString = url.split("?")[1];
        var pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split("=");
          var key = decodeURIComponent(pair[0]);
          var value = decodeURIComponent(pair[1]);
          params[key] = value;
        }
      }
      return params;
    };
    if (getUrlParams().order_id) {
      common_vendor.index.showLoading({
        title: "请稍后",
        mask: true
      });
      state.goods_name = getUrlParams().goods_name;
      state.id = getUrlParams().order_id;
      state.com_type = Number(getUrlParams().type);
      common_vendor.index.setStorageSync("order_id", state.id);
    } else {
      alert("参数传递有误，请检查后重试");
    }
    common_vendor.onMounted(() => {
      console.log(state.id);
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: state.id
      }).then((res) => {
        state.info = res.data;
        common_vendor.index.setStorageSync("orderInfo", res.data);
        setTimeout(() => {
          common_vendor.index.createSelectorQuery().select("#setupContent").boundingClientRect().exec((res2) => {
            if (res2[0]) {
              common_vendor.index.hideLoading();
              state.leftheight = res2[0].height - 15;
            }
          });
        }, 200);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: state.id
      }, state.id ? common_vendor.e({
        b: common_vendor.p({
          title: "订单详情"
        }),
        c: state.info.order_material
      }, state.info.order_material ? {
        d: common_vendor.t(state.info.order_material.name),
        e: common_vendor.t(state.info.order_material.mobile || state.info.order_material.leader_mobile),
        f: common_assets._imports_0,
        g: common_vendor.t(state.goods_name),
        h: common_vendor.t(state.info.contract_num),
        i: common_vendor.t(state.info.order_material.apply_money),
        j: common_vendor.t(state.info.rate_type === "day" ? "按天" : state.info.rate_type === "month" ? "按月" : state.info.rate_type === "year" ? "按年" : ""),
        k: common_vendor.t(state.info.loan_rate)
      } : {}, {
        l: state.com_type === 1
      }, state.com_type === 1 ? {
        m: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        n: state.com_type === 2
      }, state.com_type === 2 ? {
        o: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        p: state.com_type === 1
      }, state.com_type === 1 ? {
        q: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        r: state.com_type === 2
      }, state.com_type === 2 ? {
        s: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        t: common_vendor.p({
          showFlag: true
        }),
        v: common_vendor.p({
          showFlag: true
        }),
        w: common_vendor.p({
          showFlag: true
        }),
        x: common_vendor.p({
          showFlag: true
        }),
        y: common_vendor.p({
          showFlag: true
        }),
        z: common_vendor.p({
          showFlag: true
        }),
        A: common_vendor.p({
          showFlag: true
        }),
        B: common_vendor.p({
          closeText: "更多信息",
          openText: "收起更多",
          showHeight: "260",
          color: "#FF8177",
          toggle: true,
          textIndent: "0px"
        }),
        C: state.info.id
      }, state.info.id ? common_vendor.e({
        D: state.type[state.info.status] > 1
      }, state.type[state.info.status] > 1 ? {} : {}, {
        E: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {
        F: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "5vw",
          color: "#F97E39"
        })
      } : {}, {
        G: common_vendor.f(state.info.check_logs, (i, j, i0) => {
          return common_vendor.e({
            a: state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1
          }, state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1 ? {
            b: common_vendor.t(j + 2),
            c: common_vendor.n(state.type[state.info.status] > 2 || j < state.info.check_logs.length - 1 ? "finish" : "")
          } : {}, {
            d: state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1
          }, state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1 ? {
            e: "3dd59bc3-14-" + i0,
            f: common_vendor.p({
              name: "checkmark-circle-fill",
              size: "5vw",
              color: "#F97E39"
            })
          } : {}, {
            g: j
          });
        }),
        H: state.type[state.info.status] !== 3
      }, state.type[state.info.status] !== 3 ? {
        I: common_vendor.t(state.info.check_logs.length + 2),
        J: common_vendor.n(state.type[state.info.status] > 3 ? "finish" : "")
      } : {}, {
        K: state.type[state.info.status] === 3
      }, state.type[state.info.status] === 3 ? {
        L: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "5vw",
          color: "#F97E39"
        })
      } : {}, {
        M: state.type[state.info.status] !== 4
      }, state.type[state.info.status] !== 4 ? {
        N: common_vendor.t(state.info.check_logs.length + 3),
        O: common_vendor.n(state.type[state.info.status] > 4 ? "finish" : "")
      } : {}, {
        P: state.type[state.info.status] === 4
      }, state.type[state.info.status] === 4 ? {
        Q: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "5vw",
          color: "#F97E39"
        })
      } : {}, {
        R: state.leftheight + "px",
        S: common_vendor.t(state.info.create_time),
        T: common_vendor.t(state.info.businesser_name),
        U: common_vendor.n(state.type[state.info.status] === 1 ? "current" : "finish1"),
        V: common_vendor.f(state.info.check_logs, (i, j, i0) => {
          return {
            a: common_vendor.t(i.check_process === "a" ? "资料复核" : i.check_process === "b" ? "风险审查" : "合同复核"),
            b: common_vendor.t(i.status === "a" ? "认领" : i.status === "b" ? "通过" : "拒绝"),
            c: common_vendor.t(i.handler_name),
            d: j,
            e: common_vendor.n(state.type[state.info.status] === 2 && j == state.info.check_logs.length - 1 ? "current" : state.type[state.info.status] > 2 || j < state.info.check_logs.length - 1 ? "finish1" : "")
          };
        }),
        W: state.type[state.info.status] < 3
      }, state.type[state.info.status] < 3 ? {} : {}, {
        X: state.type[state.info.status] === 3
      }, state.type[state.info.status] === 3 ? {} : {}, {
        Y: state.type[state.info.status] > 3
      }, state.type[state.info.status] > 3 ? {} : {}, {
        Z: common_vendor.n(state.type[state.info.status] === 3 ? "current" : state.type[state.info.status] > 3 ? "finish1" : ""),
        aa: state.type[state.info.status] < 4
      }, state.type[state.info.status] < 4 ? {} : {}, {
        ab: state.info.status === "d"
      }, state.info.status === "d" ? {} : {}, {
        ac: state.info.status === "e"
      }, state.info.status === "e" ? {} : {}, {
        ad: state.info.status === "f"
      }, state.info.status === "f" ? {} : {}, {
        ae: state.info.status === "g"
      }, state.info.status === "g" ? {} : {}, {
        af: common_vendor.n(state.type[state.info.status] === 4 ? "current" : state.type[state.info.status] > 4 ? "finish1" : "")
      }) : {}) : {});
    };
  }
});
wx.createPage(_sfc_main);
