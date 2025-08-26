"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_read_more2 = common_vendor.resolveComponent("u-read-more");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_read_more2 + _easycom_u_icon2)();
}
const _easycom_u_read_more = () => "../../node-modules/uview-plus/components/u-read-more/u-read-more.js";
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + information + information1 + detailed + detailed1 + bankcard + borrowing + borrower + rongdan + houseproperty + capture + otherinfo + _easycom_u_read_more + _easycom_u_icon)();
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
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    id: { type: String },
    type: { type: Number },
    goods_name: { type: String }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const props = __props;
    common_vendor.index.setStorageSync("order_id", props.id);
    const state = common_vendor.reactive({
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
    const callPhone = () => {
      common_vendor.index.makePhoneCall({
        phoneNumber: state.info.order_material.mobile
      });
    };
    common_vendor.onMounted(() => {
      globalProxy.$request("/loan/Order/getOrderDetail", {
        order_id: props.id
      }).then((res) => {
        state.info = res.data;
        setTimeout(() => {
          common_vendor.index.createSelectorQuery().select("#setupContent").boundingClientRect().exec((res2) => {
            if (res2[0]) {
              state.leftheight = res2[0].height - 15;
            }
          });
        }, 200);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "订单详情"
        }),
        b: state.info.order_material
      }, state.info.order_material ? {
        c: common_vendor.t(state.info.order_material.name),
        d: common_vendor.t(state.info.order_material.mobile || state.info.order_material.leader_mobile),
        e: common_assets._imports_0$6,
        f: common_vendor.o(($event) => callPhone()),
        g: common_vendor.t(props.goods_name),
        h: common_vendor.t(state.info.contract_num),
        i: common_vendor.t(state.info.order_material.apply_money),
        j: common_vendor.t(state.info.rate_type === "day" ? "按天" : state.info.rate_type === "month" ? "按月" : state.info.rate_type === "year" ? "按年" : ""),
        k: common_vendor.t(state.info.loan_rate)
      } : {}, {
        l: props.type === 1
      }, props.type === 1 ? {
        m: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        n: props.type === 2
      }, props.type === 2 ? {
        o: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        p: props.type === 1
      }, props.type === 1 ? {
        q: common_vendor.p({
          showFlag: true
        })
      } : {}, {
        r: props.type === 2
      }, props.type === 2 ? {
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
          showHeight: "240",
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
        G: common_vendor.n(state.type[state.info.status] > 2 ? "finish" : ""),
        H: common_vendor.f(state.info.check_logs, (i, j, i0) => {
          return common_vendor.e({
            a: state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1
          }, state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1 ? {
            b: common_vendor.t(j + 2),
            c: common_vendor.n(state.type[state.info.status] > 2 || j < state.info.check_logs.length - 1 ? "finish" : "")
          } : {}, {
            d: state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1
          }, state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1 ? {
            e: "1703dee0-14-" + i0,
            f: common_vendor.p({
              name: "checkmark-circle-fill",
              size: "5vw",
              color: "#F97E39"
            })
          } : {}, {
            g: j
          });
        }),
        I: state.type[state.info.status] !== 3
      }, state.type[state.info.status] !== 3 ? {
        J: common_vendor.t(state.info.check_logs.length + 2),
        K: common_vendor.n(state.type[state.info.status] > 3 ? "finish" : "")
      } : {}, {
        L: common_vendor.n(state.type[state.info.status] > 3 ? "finish" : ""),
        M: state.type[state.info.status] !== 4
      }, state.type[state.info.status] !== 4 ? {
        N: common_vendor.t(state.info.check_logs.length + 3),
        O: common_vendor.n(state.type[state.info.status] > 4 ? "finish" : "")
      } : {}, {
        P: common_vendor.n(state.type[state.info.status] > 4 ? "finish" : ""),
        Q: state.leftheight + "px",
        R: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {
        S: common_vendor.t(state.info.businesser_name)
      } : {}, {
        T: state.type[state.info.status] > 1
      }, state.type[state.info.status] > 1 ? {
        U: common_vendor.t(state.info.create_time),
        V: common_vendor.t(state.info.businesser_name)
      } : {}, {
        W: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {} : {}, {
        X: state.type[state.info.status] === 2 && state.info.checker_id == 0
      }, state.type[state.info.status] === 2 && state.info.checker_id == 0 ? {} : {}, {
        Y: state.type[state.info.status] === 2 && state.info.checker_id > 0
      }, state.type[state.info.status] === 2 && state.info.checker_id > 0 ? {
        Z: common_vendor.t(state.info.checker_name)
      } : {}, {
        aa: state.type[state.info.status] > 2
      }, state.type[state.info.status] > 2 ? {
        ab: common_vendor.t(state.info.checker_name)
      } : {}, {
        ac: state.type[state.info.status] < 3
      }, state.type[state.info.status] < 3 ? {} : {}, {
        ad: state.type[state.info.status] === 3
      }, state.type[state.info.status] === 3 ? {} : {}, {
        ae: state.type[state.info.status] > 3
      }, state.type[state.info.status] > 3 ? {} : {}, {
        af: common_vendor.n(state.type[state.info.status] === 3 ? "current" : state.type[state.info.status] > 3 ? "finish1" : ""),
        ag: state.type[state.info.status] < 4
      }, state.type[state.info.status] < 4 ? {} : {}, {
        ah: state.info.status === "d"
      }, state.info.status === "d" ? {} : {}, {
        ai: state.info.status === "e"
      }, state.info.status === "e" ? {} : {}, {
        aj: state.info.status === "f"
      }, state.info.status === "f" ? {} : {}, {
        ak: state.info.status === "g"
      }, state.info.status === "g" ? {} : {}, {
        al: common_vendor.n(state.type[state.info.status] === 4 ? "current" : state.type[state.info.status] > 4 ? "finish1" : "")
      }) : {});
    };
  }
});
wx.createPage(_sfc_main);
