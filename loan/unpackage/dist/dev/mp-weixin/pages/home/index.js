"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  (_easycom_u_icon2 + _easycom_u_parse2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_parse = () => "../../node-modules/uview-plus/components/u-parse/u-parse.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_parse + Tabbar)();
}
const Tabbar = () => "../../components/tabbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      tabbarHeight: 0,
      // 轮播图数组
      banner: [],
      // 公告数组
      notice: [],
      // 没有搜索
      isNotSearch: true,
      // 公告打开状态
      popup_state: false,
      // 搜索关键字
      searchVal: "",
      // 筛选数组
      screen_list: [],
      // 列表筛选
      screen_type: 0,
      // 列表
      list: [],
      // 个人、公司
      type: {
        person: 1,
        company: 2
      },
      rate_type: {
        day: "日化",
        month: "月化",
        year: "年化"
      },
      // 公告富文本
      html_content: ``
    });
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    common_vendor.onShow(() => {
      globalProxy.$request("/loan/Banner/getBannerList", {
        user_type: "worker"
      }).then((res) => {
        state.banner = res.data.list;
      });
      globalProxy.$request("/loan/Notice/getNoticeList", {
        user_type: "worker"
      }).then((res) => {
        state.notice = res.data.list;
      });
      globalProxy.$request("/loan/LoanType/getLoanTypeList").then((res) => {
        state.screen_list = res.data.list;
        globalProxy.$request("/loan/Goods/getGoodsList", {
          loan_type_id: state.screen_list[state.screen_type].id
        }).then((ress) => {
          state.list = ress.data.list;
          common_vendor.index.createSelectorQuery().select("#tabbar").boundingClientRect((res2) => {
            state.tabbarHeight = res2.height;
          }).exec();
        });
      });
    });
    const search = (type) => {
      state.screen_type = type;
      state.isNotSearch = state.searchVal === "";
      globalProxy.$request("/loan/Goods/getGoodsList", {
        loan_type_id: state.screen_list[state.screen_type].id
      }).then((ress) => {
        state.list = ress.data.list;
      });
    };
    const changeState = (id) => {
      globalProxy.$request("/loan/Notice/getNoticeRichText", {
        notice_id: id
      }).then((res) => {
        state.html_content = res.data.content;
        state.popup_state = true;
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.p({
          name: "search",
          size: "6vw",
          color: "#666666"
        }),
        c: common_vendor.o(($event) => search(state.screen_type)),
        d: common_vendor.o(($event) => search(state.screen_type)),
        e: state.searchVal,
        f: common_vendor.o(($event) => state.searchVal = $event.detail.value),
        g: state.statusBarHeight + "px",
        h: state.navigationBarHeight + "px",
        i: common_vendor.f(state.banner, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
              id: item.id,
              url: "/loan/Banner/getBannerRichText"
            }), index),
            c: index
          };
        }),
        j: common_assets._imports_1$1,
        k: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/assistant/index")),
        l: common_assets._imports_2$1,
        m: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/record/index")),
        n: common_assets._imports_3$1,
        o: common_vendor.f(state.notice, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: "2392ed52-1-" + i0,
            c: index,
            d: common_vendor.o(($event) => changeState(item.id), index)
          };
        }),
        p: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        q: state.isNotSearch,
        r: common_vendor.f(state.screen_list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.n(state.screen_type === index ? "active" : ""),
            c: common_vendor.o(($event) => search(index), index),
            d: index
          };
        }),
        s: common_vendor.s(state.isNotSearch ? "" : "margin-top:0"),
        t: common_vendor.f(state.list, (item, index, i0) => {
          return common_vendor.e({
            a: item.is_hot === "Y"
          }, item.is_hot === "Y" ? {} : {}, {
            b: common_vendor.t(state.type[item.person_type] === 1 ? "个人" : "企业"),
            c: common_vendor.s(state.type[item.person_type] === 1 ? "background:#FF8177" : "background:#F3A469"),
            d: common_vendor.t(item.name),
            e: common_vendor.t(state.rate_type[item.rate_type]),
            f: common_vendor.t(item.rate_range),
            g: common_vendor.t(item.top_limit),
            h: common_vendor.t(item.loan_cycle),
            i: common_vendor.f(item.sign, (i, j, i1) => {
              return {
                a: common_vendor.t(i),
                b: j
              };
            }),
            j: common_vendor.t(item.special_des),
            k: "2392ed52-2-" + i0,
            l: common_vendor.o(($event) => _ctx.$navigateTo("/home_packages/details/index", {
              id: item.id,
              type: state.type[item.person_type]
            }), index),
            m: index
          });
        }),
        v: common_vendor.p({
          name: "arrow-right",
          size: "4vw",
          color: "#666666"
        }),
        w: "calc(100vh - " + state.navHeight + "px - 4vw - " + state.tabbarHeight + "px)",
        x: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        y: common_vendor.o(($event) => state.popup_state = false),
        z: common_vendor.p({
          content: state.html_content
        }),
        A: state.popup_state,
        B: state.popup_state,
        C: common_vendor.p({
          index: 0,
          id: "tabbar"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
