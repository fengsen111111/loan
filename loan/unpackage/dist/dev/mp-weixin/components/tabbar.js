"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_u_tabbar_item2 = common_vendor.resolveComponent("u-tabbar-item");
  const _easycom_u_tabbar2 = common_vendor.resolveComponent("u-tabbar");
  (_easycom_u_tabbar_item2 + _easycom_u_tabbar2)();
}
const _easycom_u_tabbar_item = () => "../node-modules/uview-plus/components/u-tabbar-item/u-tabbar-item.js";
const _easycom_u_tabbar = () => "../node-modules/uview-plus/components/u-tabbar/u-tabbar.js";
if (!Math) {
  (_easycom_u_tabbar_item + _easycom_u_tabbar)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "tabbar",
  props: {
    index: { type: Number, default: 0 }
  },
  setup(__props) {
    const props = __props;
    const state = common_vendor.reactive({
      current: props.index,
      list: [
        {
          text: "首页",
          iconPath: "/static/home.png",
          selectedIconPath: "/static/home_active.png",
          pagePath: "/pages/user_home/index"
        },
        {
          text: "我的",
          iconPath: "/static/mine.png",
          selectedIconPath: "/static/mine_active.png",
          pagePath: "/pages/mine/index"
        }
      ],
      user_list: [
        {
          text: "首页",
          iconPath: "/static/home.png",
          selectedIconPath: "/static/home_active.png",
          pagePath: "/pages/user_home/index"
        },
        {
          text: "我的",
          iconPath: "/static/mine.png",
          selectedIconPath: "/static/mine_active.png",
          pagePath: "/pages/mine/index"
        }
      ],
      worker_list: [
        {
          text: "首页",
          iconPath: "/static/home.png",
          selectedIconPath: "/static/home_active.png",
          pagePath: "/pages/home/index"
        },
        {
          text: "工作台",
          iconPath: "/static/work.png",
          selectedIconPath: "/static/work_active.png",
          pagePath: "/pages/work/index"
        },
        {
          text: "我的",
          iconPath: "/static/mine.png",
          selectedIconPath: "/static/mine_active.png",
          pagePath: "/pages/mine/index"
        }
      ]
    });
    common_vendor.watch(() => props.index, (newValue) => {
      if (newValue == 2) {
        state.list = state.worker_list;
      } else {
        state.list = state.user_list;
      }
      state.current = newValue;
    });
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const pagePath = currentPage.route;
    const tabbarPage = [
      "pages/home/index",
      "pages/mine/index",
      "pages/user_home/index",
      "pages/work/index"
    ];
    if (tabbarPage.includes(pagePath)) {
      common_vendor.index.hideTabBar();
    }
    if (common_vendor.index.getStorageSync("userInfo") && common_vendor.index.getStorageSync("userInfo").user_type.length > 1 && common_vendor.index.getStorageSync("appType") === 2) {
      state.list = state.worker_list;
    }
    if (common_vendor.index.getStorageSync("first_in") && common_vendor.index.getStorageSync("userInfo") && common_vendor.index.getStorageSync("userInfo").user_type.length > 1) {
      if (common_vendor.index.getStorageSync("appType") === 2) {
        common_vendor.index.reLaunch({
          url: "/pages/home/index"
        });
      } else {
        common_vendor.index.reLaunch({
          url: "/pages/user_home/index"
        });
      }
      common_vendor.index.removeStorageSync("first_in");
    }
    const change = (index) => {
      common_vendor.index.switchTab({
        url: state.list[index].pagePath
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(state.list, (item, index, i0) => {
          return {
            a: item.selectedIconPath,
            b: item.iconPath,
            c: index,
            d: "470e5e44-1-" + i0 + ",470e5e44-0",
            e: common_vendor.p({
              text: item.text
            })
          };
        }),
        b: common_vendor.o(change),
        c: common_vendor.p({
          fixed: true,
          placeholder: true,
          value: state.current,
          activeColor: "#F97E39"
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
