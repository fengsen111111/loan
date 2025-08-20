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
  setup(__props) {
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const state = common_vendor.reactive({
      list: [],
      search_type: "name",
      search_name: "选择按姓名",
      search_word: "",
      pub_picker: false,
      pub_value: [],
      column: [
        {
          name: "选择按姓名",
          value: "name"
        },
        {
          name: "选择按证件号",
          value: "card_number"
        },
        {
          name: "选择按手机号",
          value: "mobile"
        },
        {
          name: "选择按合同编号",
          value: "contract_num"
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
          color: "#FF8177",
          name: "流程完结"
        },
        f: {
          color: "#FF8177",
          name: "转债中"
        },
        z: {
          color: "#FF8177",
          name: "合同作废"
        }
      }
    });
    common_vendor.onMounted(() => {
      netWork(1);
    });
    const netWork = (type) => {
      if (type === 1) {
        state.page = 1;
      }
      common_vendor.index.showLoading({
        title: "请稍后"
      });
      globalProxy.$request("/loan/Order/getOrderList", {
        currentPage: state.page,
        perPage: state.pageSize,
        user_type: common_vendor.index.getStorageSync("userInfo").user_type.length > 1 ? "b" : "a",
        status: "c",
        search_type: state.search_type,
        search_data: state.search_word
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
    const bindChange = (res) => {
      state.pub_value = res.detail.value;
    };
    const confirm = () => {
      state.search_type = state.column[state.pub_value[0]].value;
      state.search_name = state.column[state.pub_value[0]].name;
      state.pub_picker = false;
    };
    common_vendor.onReachBottom(() => {
      if (state.page + 1 <= Math.ceil(state.total / state.pageSize)) {
        state.page++;
        netWork(2);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "待办件"
        }),
        b: common_vendor.t(state.search_name),
        c: common_vendor.p({
          name: "arrow-down",
          size: "3vw",
          color: "#666666"
        }),
        d: common_vendor.o(($event) => state.pub_picker = true),
        e: common_vendor.p({
          name: "search",
          size: "5vw",
          color: "#666666"
        }),
        f: state.search_word,
        g: common_vendor.o(($event) => state.search_word = $event.detail.value),
        h: common_vendor.o(($event) => netWork(1)),
        i: common_vendor.f(state.list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.type === "person" ? _ctx.$cardUtil(item.card_number) : ""),
            c: "66f10499-3-" + i0,
            d: common_vendor.o(($event) => _ctx.$navigateTo("/work_packages/detail/index", {
              id: item.id,
              goods_name: item.goods_name
            }), index),
            e: common_vendor.t(item.goods_name),
            f: common_vendor.t(item.contract_num),
            g: common_vendor.t(item.create_time),
            h: index
          };
        }),
        j: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        k: state.list.length === 0
      }, state.list.length === 0 ? {
        l: common_assets._imports_0$5
      } : {}, {
        m: state.pub_picker
      }, state.pub_picker ? {
        n: common_vendor.o(($event) => state.pub_picker = false),
        o: common_vendor.o(($event) => confirm()),
        p: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        q: state.pub_value,
        r: common_vendor.o(bindChange)
      } : {}, {
        s: state.pub_picker
      }, state.pub_picker ? {
        t: common_vendor.o(($event) => state.pub_picker = false)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
