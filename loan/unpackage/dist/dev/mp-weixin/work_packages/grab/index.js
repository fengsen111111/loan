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
      },
      tips_pop: false,
      tips_flag: false,
      contract_num: ""
    });
    common_vendor.onMounted(() => {
      netWork(1);
    });
    const rob = (id, contract_num) => {
      state.contract_num = contract_num;
      globalProxy.$request("/loan/Order/hasOrder", {
        order_id: id
      }).then((res) => {
        if (res.data.business_code === 1) {
          state.tips_flag = true;
        }
        state.tips_pop = true;
        netWork(1);
      });
    };
    const navTo = (obj) => {
      let type = obj.type === "person" ? 1 : 2;
      common_vendor.index.navigateTo({
        url: "/mine_packages/order_detail/index?id=" + obj.id + "&type=" + type + "&goods_name=" + obj.goods_name
      });
    };
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
        status: "b",
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
          title: "可抢件"
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
            c: common_vendor.o(($event) => rob(item.id, item.contract_num), index),
            d: common_vendor.t(item.goods_name),
            e: common_vendor.t(item.contract_num),
            f: common_vendor.t(item.create_time),
            g: index,
            h: common_vendor.o(($event) => navTo(item), index)
          };
        }),
        j: state.list.length === 0
      }, state.list.length === 0 ? {
        k: common_assets._imports_0$5
      } : {}, {
        l: state.pub_picker
      }, state.pub_picker ? {
        m: common_vendor.o(($event) => state.pub_picker = false),
        n: common_vendor.o(($event) => confirm()),
        o: common_vendor.f(state.column, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index
          };
        }),
        p: state.pub_value,
        q: common_vendor.o(bindChange)
      } : {}, {
        r: state.pub_picker
      }, state.pub_picker ? {
        s: common_vendor.o(($event) => state.pub_picker = false)
      } : {}, {
        t: state.tips_pop
      }, state.tips_pop ? {
        v: common_vendor.t(state.tips_flag ? "抢件成功" : "抢件失败"),
        w: common_vendor.o(($event) => state.tips_pop = false),
        x: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        y: common_vendor.p({
          name: state.tips_flag ? "checkmark-circle" : "close-circle",
          size: "50vw",
          color: state.tips_flag ? "#109181" : "#FF3030"
        }),
        z: common_vendor.t(state.contract_num),
        A: common_vendor.o(($event) => state.tips_pop = false)
      } : {}, {
        B: state.tips_pop
      }, state.tips_pop ? {
        C: common_vendor.o(($event) => state.tips_pop = false)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
