"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (navbar + _easycom_u_icon)();
}
const navbar = () => "../../components/navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    card_number: { type: String }
  },
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const props = __props;
    const state = common_vendor.reactive({
      appType: common_vendor.index.getStorageSync("appType"),
      list: [],
      search_type: "选择按姓名",
      pub_picker: false,
      pub_value: [],
      column: [
        {
          name: "选择按姓名"
        },
        {
          name: "选择按证件号"
        },
        {
          name: "选择按手机号"
        },
        {
          name: "选择按申请编号"
        }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      status_type: {
        a: {
          color: "#FF8177",
          name: "待提交"
        },
        b: {
          color: "#F97E39",
          name: "待审核"
        },
        c: {
          color: "#FF8177",
          name: "待签约"
        },
        d: {
          color: "#FF8177",
          name: "公证中"
        },
        e: {
          color: "#FF8177",
          name: "待放款"
        },
        g: {
          color: "#109181",
          name: "流程完结"
        },
        f: {
          color: "#FF8177",
          name: "转债中"
        },
        z: {
          color: "#FF3030",
          name: "合同作废"
        }
      },
      notarization_status: {
        a: {
          color: "#FF8177",
          name: "未提交"
        },
        b: {
          color: "#FF8177",
          name: "公证中"
        },
        c: {
          color: "#109181",
          name: "审核完成"
        },
        d: {
          color: "#109181",
          name: "已下证"
        },
        z: {
          color: "#FF3030",
          name: "公证异常"
        }
      }
    });
    const bindChange = (res) => {
      state.pub_value = res.detail.value;
    };
    const confirm = () => {
      state.search_type = state.column[state.pub_value[0]].name;
      state.pub_picker = false;
    };
    const navTo = (obj) => {
      let type = obj.type === "person" ? 1 : 2;
      common_vendor.index.navigateTo({
        url: "/mine_packages/order_detail/index?id=" + obj.id + "&type=" + type + "&goods_name=" + obj.goods_name
      });
    };
    const show_reason = (url) => {
      common_vendor.index.showToast({
        title: url,
        duration: 2e3,
        icon: "none"
      });
    };
    const copyHref = (url) => {
      console.log(url);
      common_vendor.index.navigateTo({
        url: "/pages/web_view/index?url=" + encodeURIComponent(url)
      });
    };
    common_vendor.onMounted(() => {
      netWork();
    });
    const netWork = () => {
      common_vendor.index.showLoading({
        title: "请稍后"
      });
      globalProxy.$request("/loan/Order/getOrderList", {
        currentPage: state.page,
        perPage: state.pageSize,
        user_type: common_vendor.index.getStorageSync("userInfo").user_type.length > 1 ? "b" : "a",
        search_type: "card_number",
        search_data: props.card_number
      }).then((res) => {
        state.total = res.data.count;
        if (state.page === 1) {
          state.list = res.data.list;
        } else {
          state.list = state.list.concat(res.data.list);
        }
        common_vendor.index.hideLoading();
      });
    };
    common_vendor.onReachBottom(() => {
      if (state.page + 1 <= Math.ceil(state.total / state.pageSize)) {
        state.page++;
        netWork();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "进度查询"
        }),
        b: common_vendor.f(state.list, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.s(item.type === "person" ? "max-width:17vw;min-width:17vw;width:fit-content" : "max-width:40vw;min-width:17vw;width:fit-content"),
            c: common_vendor.t(item.type === "person" ? _ctx.$cardUtil(item.card_number) : ""),
            d: common_vendor.t(state.status_type[item.status].name),
            e: "solid 1px " + state.status_type[item.status].color,
            f: state.status_type[item.status].color,
            g: item.status === "d" || item.status === "e" || item.status === "f" || item.status === "g"
          }, item.status === "d" || item.status === "e" || item.status === "f" || item.status === "g" ? {
            h: common_vendor.t(state.notarization_status[item.notarization_status].name),
            i: "solid 1px " + state.notarization_status[item.notarization_status].color,
            j: state.notarization_status[item.notarization_status].color
          } : {}, {
            k: "4552a308-1-" + i0,
            l: common_vendor.o(($event) => navTo(item), index),
            m: common_vendor.t(item.goods_name),
            n: common_vendor.t(item.type === "person" ? "个人" : "企业"),
            o: common_vendor.s(item.type === "person" ? "background: #FF8177;" : "background: #F3A469;"),
            p: common_vendor.t(item.contract_num),
            q: common_vendor.t(item.create_time),
            r: (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "a"
          }, (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "a" ? {
            s: common_vendor.o(($event) => copyHref(item.open_ll_account_url), index)
          } : {}, {
            t: (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "c"
          }, (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "c" ? {
            v: common_vendor.o(($event) => show_reason(item.open_ll_account_url), index)
          } : {}, {
            w: item.status !== "a" && item.status !== "b" && item.status !== "c" && item.open_ll_status === "Y" && state.appType === 1 && item.ll_account_status == "b"
          }, item.status !== "a" && item.status !== "b" && item.status !== "c" && item.open_ll_status === "Y" && state.appType === 1 && item.ll_account_status == "b" ? {
            x: common_vendor.o(($event) => copyHref(item.manage_ll_account_url), index)
          } : {}, {
            y: index
          });
        }),
        c: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        d: state.list.length === 0
      }, state.list.length === 0 ? {
        e: common_assets._imports_0$5
      } : {}, {
        f: state.pub_picker
      }, state.pub_picker ? {
        g: common_vendor.o(($event) => state.pub_picker = false),
        h: common_vendor.o(($event) => confirm()),
        i: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        j: state.pub_value,
        k: common_vendor.o(bindChange)
      } : {}, {
        l: state.pub_picker
      }, state.pub_picker ? {
        m: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
