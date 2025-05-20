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
  (navbar + information + information1 + detailed + detailed1 + borrowing + borrower + rongdan + houseproperty + capture + otherinfo + _easycom_u_read_more + _easycom_u_icon)();
}
const information = () => "../../components/data_components/information.js";
const information1 = () => "../../components/data_components/information1.js";
const detailed = () => "../../components/data_components/detailed.js";
const detailed1 = () => "../../components/data_components/detailed1.js";
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
          closeText: "更多信息",
          openText: "收起更多",
          showHeight: "240",
          color: "#FF8177",
          toggle: true,
          textIndent: "0px"
        }),
        B: state.info.id
      }, state.info.id ? common_vendor.e({
        C: state.type[state.info.status] > 1
      }, state.type[state.info.status] > 1 ? {} : {}, {
        D: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {
        E: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "5vw",
          color: "#F97E39"
        })
      } : {}, {
        F: common_vendor.n(state.type[state.info.status] > 2 ? "finish" : ""),
        G: common_vendor.f(state.info.check_logs, (i, j, i0) => {
          return common_vendor.e({
            a: state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1
          }, state.type[state.info.status] !== 2 || j < state.info.check_logs.length - 1 ? {
            b: common_vendor.t(j + 2),
            c: common_vendor.n(state.type[state.info.status] > 2 || j < state.info.check_logs.length - 1 ? "finish" : "")
          } : {}, {
            d: state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1
          }, state.type[state.info.status] === 2 && j === state.info.check_logs.length - 1 ? {
            e: "642b6436-13-" + i0,
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
        K: common_vendor.n(state.type[state.info.status] > 3 ? "finish" : ""),
        L: state.type[state.info.status] !== 4
      }, state.type[state.info.status] !== 4 ? {
        M: common_vendor.t(state.info.check_logs.length + 3),
        N: common_vendor.n(state.type[state.info.status] > 4 ? "finish" : "")
      } : {}, {
        O: common_vendor.n(state.type[state.info.status] > 4 ? "finish" : ""),
        P: state.leftheight + "px",
        Q: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {
        R: common_vendor.t(state.info.businesser_name)
      } : {}, {
        S: state.type[state.info.status] > 1
      }, state.type[state.info.status] > 1 ? {
        T: common_vendor.t(state.info.create_time),
        U: common_vendor.t(state.info.businesser_name)
      } : {}, {
        V: state.type[state.info.status] === 1
      }, state.type[state.info.status] === 1 ? {} : {}, {
        W: state.type[state.info.status] === 2 && state.info.checker_id == 0
      }, state.type[state.info.status] === 2 && state.info.checker_id == 0 ? {} : {}, {
        X: state.type[state.info.status] === 2 && state.info.checker_id > 0
      }, state.type[state.info.status] === 2 && state.info.checker_id > 0 ? {
        Y: common_vendor.t(state.info.checker_name)
      } : {}, {
        Z: state.type[state.info.status] > 2
      }, state.type[state.info.status] > 2 ? {
        aa: common_vendor.t(state.info.checker_name)
      } : {}, {
        ab: state.type[state.info.status] < 3
      }, state.type[state.info.status] < 3 ? {} : {}, {
        ac: state.type[state.info.status] === 3
      }, state.type[state.info.status] === 3 ? {} : {}, {
        ad: state.type[state.info.status] > 3
      }, state.type[state.info.status] > 3 ? {} : {}, {
        ae: common_vendor.n(state.type[state.info.status] === 3 ? "current" : state.type[state.info.status] > 3 ? "finish1" : ""),
        af: state.type[state.info.status] < 4
      }, state.type[state.info.status] < 4 ? {} : {}, {
        ag: state.info.status === "d"
      }, state.info.status === "d" ? {} : {}, {
        ah: state.info.status === "e"
      }, state.info.status === "e" ? {} : {}, {
        ai: state.info.status === "f"
      }, state.info.status === "f" ? {} : {}, {
        aj: state.info.status === "g"
      }, state.info.status === "g" ? {} : {}, {
        ak: common_vendor.n(state.type[state.info.status] === 4 ? "current" : state.type[state.info.status] > 4 ? "finish1" : "")
      }) : {});
    };
  }
});
wx.createPage(_sfc_main);
