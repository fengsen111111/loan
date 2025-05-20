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
    id: { type: String },
    title: { type: String }
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
          name: "公证未提交"
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
    common_vendor.onMounted(() => {
      netWork(1);
    });
    const sqmimy = (id) => {
      globalProxy.$request("/loan/Order/jumpPass", {
        order_id: id
      }).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: res.data.jump_url,
          confirmText: "复制",
          success: function(resule) {
            if (resule.confirm) {
              console.log("用户点击确定");
              common_vendor.index.setClipboardData({
                data: res.data.jump_url,
                success: () => {
                  common_vendor.index.showToast({
                    title: "复制成功"
                  });
                }
              });
            } else if (resule.cancel) {
              console.log("用户点击取消");
            }
          }
        });
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
        // user_type: uni.getStorageSync("userInfo").user_type.length > 1 ? 'b' : 'a',
        user_type: common_vendor.index.getStorageSync("appType") == "2" ? "b" : "a",
        loan_type_id: props.id,
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
    const navTo = (obj) => {
      let type = obj.type === "person" ? 1 : 2;
      if (obj.status === "a") {
        common_vendor.index.navigateTo({
          url: "/home_packages/details/index?id=" + obj.goods_id + "&order_id=" + obj.id + "&type=" + type
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/mine_packages/order_detail/index?id=" + obj.id + "&type=" + type + "&goods_name=" + obj.goods_name
        });
      }
    };
    const bindChange = (res) => {
      state.pub_value = res.detail.value;
    };
    const confirm = () => {
      state.search_type = state.column[state.pub_value[0]].value;
      state.search_name = state.column[state.pub_value[0]].name;
      state.pub_picker = false;
    };
    const show_reason = (url) => {
      common_vendor.index.showToast({
        title: url,
        duration: 2e3,
        icon: "none"
      });
    };
    const copyHref = (url) => {
      common_vendor.index.navigateTo({
        url: "/pages/web_view/index?url=" + encodeURIComponent(url)
      });
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
          title: props.title
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
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.s(item.type === "person" ? "max-width:15vw;min-width:14vw;width:fit-content" : "max-width:40vw;min-width:17vw;width:fit-content"),
            c: common_vendor.t(item.type === "person" ? _ctx.$cardUtil(item.card_number) : ""),
            d: item.delete_status == "Y"
          }, item.delete_status == "Y" ? common_vendor.e({
            e: item.status == "b" || item.status == "c" || item.status == "e"
          }, item.status == "b" || item.status == "c" || item.status == "e" ? {} : {
            f: common_vendor.t(state.status_type[item.status].name),
            g: "solid 1px " + state.status_type[item.status].color,
            h: state.status_type[item.status].color
          }) : {
            i: common_vendor.t(state.status_type[item.status].name),
            j: "solid 1px " + state.status_type[item.status].color,
            k: state.status_type[item.status].color
          }, {
            l: item.status === "d" || item.status === "e" || item.status === "f" || item.status === "g"
          }, item.status === "d" || item.status === "e" || item.status === "f" || item.status === "g" ? {
            m: common_vendor.t(state.notarization_status[item.notarization_status].name),
            n: "solid 1px " + state.notarization_status[item.notarization_status].color,
            o: state.notarization_status[item.notarization_status].color
          } : {}, {
            p: "413355f2-3-" + i0,
            q: common_vendor.o(($event) => navTo(item), index),
            r: common_vendor.t(item.goods_name),
            s: common_vendor.t(item.type === "person" ? "个人" : "企业"),
            t: common_vendor.s(item.type === "person" ? "background: #FF8177;" : "background: #F3A469;"),
            v: common_vendor.t(item.contract_num),
            w: item.delete_status !== "Y"
          }, item.delete_status !== "Y" ? common_vendor.e({
            x: item.open_ll_status === "Y" && item.ll_account_status == "b" && item.jump_pass_status == "c"
          }, item.open_ll_status === "Y" && item.ll_account_status == "b" && item.jump_pass_status == "c" ? {
            y: common_vendor.o(($event) => sqmimy(item.id), index)
          } : {}) : {}, {
            z: common_vendor.t(item.create_time),
            A: item.delete_status !== "Y"
          }, item.delete_status !== "Y" ? common_vendor.e({
            B: (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "a"
          }, (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "a" ? {
            C: common_vendor.o(($event) => copyHref(item.open_ll_account_url), index)
          } : {}, {
            D: (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "c"
          }, (item.status === "b" || item.status === "c") && item.open_ll_status === "Y" && state.appType === 2 && item.ll_account_status == "c" ? {
            E: common_vendor.o(($event) => show_reason(item.open_ll_account_url), index)
          } : {}, {
            F: item.status !== "a" && item.status !== "b" && item.status !== "c" && item.open_ll_status === "Y" && state.appType === 1 && item.ll_account_status == "b"
          }, item.status !== "a" && item.status !== "b" && item.status !== "c" && item.open_ll_status === "Y" && state.appType === 1 && item.ll_account_status == "b" ? {
            G: common_vendor.o(($event) => copyHref(item.manage_ll_account_url), index)
          } : {}) : {}, {
            H: index
          });
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
