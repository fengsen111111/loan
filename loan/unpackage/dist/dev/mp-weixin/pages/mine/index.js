"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_icon + Tabbar)();
}
const Tabbar = () => "../../components/tabbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      statusBarHeight: getApp().globalData.statusBarHeight,
      navigationBarHeight: getApp().globalData.navigationBarHeight,
      navHeight: getApp().globalData.navHeight,
      popup_state: false,
      html_content: ``,
      openId: null,
      userInfo: {},
      token: common_vendor.index.getStorageSync("token"),
      tab_index: 1,
      popup_not_open: false,
      nickName: "",
      appType: common_vendor.index.getStorageSync("appType") || 1
    });
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    const getUserInfo = () => {
      globalProxy.$request("/loan/User/getUserInfo").then((ress) => {
        state.userInfo = ress.data;
        if (state.userInfo.user_type.length > 1 && common_vendor.index.getStorageSync("appType") === 2) {
          if (state.userInfo.types_order_number.length > 1) {
            state.userInfo.types_order_number.splice(1, 0, {
              type: "line"
            });
          }
          state.tab_index = 2;
        }
        common_vendor.index.setStorageSync("userInfo", ress.data);
        state.nickName = ress.data.nickname;
        common_vendor.index.hideTabBar();
      });
    };
    const changeAppType = (type) => {
      common_vendor.index.setStorageSync("appType", type);
      state.appType = common_vendor.index.getStorageSync("appType");
      state.tab_index = state.appType;
      getUserInfo();
    };
    const getUser = () => {
      common_vendor.index.login({
        success: (e) => {
          globalProxy.$request("/factory_system/Base/wechatUserRegister", {
            platform: "mini",
            code: e.code
          }).then((res) => {
            state.openId = res.data.mini_openid;
            common_vendor.index.showToast({
              title: "微信授权成功",
              icon: "none",
              duration: 2e3
            });
          });
        }
      });
    };
    const getPhone = (e) => {
      globalProxy.$request("/factory_system/Base/getWechatPhoneNumber", {
        platform: "mini",
        code: e.detail.code,
        mini_openid: state.openId
      }).then((res) => {
        globalProxy.$request("/loan/User/loginAndRegister", { mobile: res.data.phone_number, openid: state.openId }).then((result) => {
          common_vendor.index.setStorageSync("token", result.data.token);
          if (result.data.business_code === 2) {
            globalProxy.$request("/loan/User/updateUserInfo", {
              mobile: res.data.phone_number
            }).then(() => {
              getUserInfo();
            });
          } else {
            getUserInfo();
          }
        });
      });
    };
    const changeAvatar = (e) => {
      common_vendor.index.showLoading({
        title: "上传中，请稍后……"
      });
      const name_array = e.detail.avatarUrl.split("/");
      const name = name_array[name_array.length - 1];
      globalProxy.$request("", {
        file: e.detail.avatarUrl,
        fileType: "file",
        params: {
          fileSize: 0,
          fileName: name
        }
      }).then((result) => {
        globalProxy.$request("/loan/User/updateUserInfo", { head_image: result.data.url }).then(() => {
          common_vendor.index.hideLoading();
          getUserInfo();
        });
      });
      common_vendor.index.hideLoading();
    };
    const getNickname = (e) => {
      state.nickName = e.detail.value;
    };
    const changeNickname = () => {
      setTimeout(() => {
        globalProxy.$request("/loan/User/updateUserInfo", { nickname: state.nickName }).then(() => {
          getUserInfo();
        });
      }, 200);
    };
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("token")) {
        getUserInfo();
      }
    });
    const navTo = (url, data) => {
      if (data.id) {
        common_vendor.index.navigateTo({
          url: url + "?id=" + data.id + "&title=" + data.title
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: state.statusBarHeight + "px",
        c: state.navigationBarHeight + "px",
        d: !state.openId && !state.token
      }, !state.openId && !state.token ? {
        e: common_assets._imports_1$3,
        f: common_vendor.o(getUser)
      } : state.openId && !state.userInfo.id && !state.token ? {
        h: common_assets._imports_1$3,
        i: common_vendor.o(getPhone)
      } : {
        j: state.userInfo.head_image,
        k: common_vendor.o(changeAvatar),
        l: common_vendor.o(getNickname),
        m: common_vendor.o(changeNickname),
        n: state.nickName,
        o: common_vendor.o(($event) => state.nickName = $event.detail.value)
      }, {
        g: state.openId && !state.userInfo.id && !state.token,
        p: common_vendor.f(state.userInfo.types_order_number, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "line"
          }, item.type === "line" ? {} : {
            b: item.icon
          }, {
            c: common_vendor.t(item.label),
            d: common_vendor.t(item.order_number),
            e: common_vendor.o(($event) => navTo("/mine_packages/signing/index", {
              id: item.loan_type_id,
              title: item.label
            }), index),
            f: index
          });
        }),
        q: state.userInfo.id && state.userInfo.user_type.length === 1 || state.appType === 1
      }, state.userInfo.id && state.userInfo.user_type.length === 1 || state.appType === 1 ? {
        r: common_assets._imports_2$3,
        s: common_vendor.t(state.userInfo.e_order_number),
        t: common_vendor.o(($event) => state.popup_not_open = true)
      } : {}, {
        v: common_assets._imports_3$3,
        w: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        x: common_vendor.o(($event) => _ctx.$navigateTo("/mine_packages/message/index", true)),
        y: common_assets._imports_4$1,
        z: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        A: common_vendor.o(($event) => _ctx.$navigateTo("/mine_packages/schedule/index", true)),
        B: common_assets._imports_5,
        C: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        D: common_vendor.o(($event) => _ctx.$navigateTo("/pages/rich_text/index", {
          url: "/loan/Setting/aboutUs",
          title: "关于我们"
        })),
        E: state.appType === 2 && state.userInfo.id && state.userInfo.user_type.length > 2
      }, state.appType === 2 && state.userInfo.id && state.userInfo.user_type.length > 2 ? {
        F: common_assets._imports_6,
        G: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        H: common_vendor.o(($event) => changeAppType(1))
      } : {}, {
        I: state.appType === 1 && state.userInfo.id && state.userInfo.user_type.length > 2
      }, state.appType === 1 && state.userInfo.id && state.userInfo.user_type.length > 2 ? {
        J: common_assets._imports_6,
        K: common_vendor.p({
          name: "arrow-right",
          size: "5vw",
          color: "#666666"
        }),
        L: common_vendor.o(($event) => changeAppType(2))
      } : {}, {
        M: state.popup_not_open
      }, state.popup_not_open ? {
        N: common_vendor.o(($event) => state.popup_not_open = false),
        O: common_vendor.p({
          name: "close",
          size: "5vw",
          color: "#666666"
        }),
        P: common_assets._imports_7,
        Q: common_vendor.o(($event) => state.popup_not_open = false)
      } : {}, {
        R: state.popup_not_open,
        S: common_vendor.o(($event) => state.popup_not_open = false),
        T: common_vendor.p({
          index: state.tab_index
        })
      });
    };
  }
});
wx.createPage(_sfc_main);
