"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  _easycom_u_parse2();
}
const _easycom_u_parse = () => "../../node-modules/uview-plus/components/u-parse/u-parse.js";
if (!Math) {
  _easycom_u_parse();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const state = common_vendor.reactive({
      html_content: ``
    });
    const { appContext } = common_vendor.getCurrentInstance();
    const globalProxy = appContext.config.globalProperties;
    common_vendor.index.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    common_vendor.onLoad((e) => {
      if (e.title) {
        common_vendor.index.setNavigationBarTitle({
          title: e.title
        });
      }
      if (e.id) {
        globalProxy.$request(e.url, {
          banner_id: e.id
        }).then((res) => {
          state.html_content = res.data.content;
        });
      } else {
        globalProxy.$request(e.url).then((res) => {
          state.html_content = res.data.content;
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          content: state.html_content
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c582f483"]]);
wx.createPage(MiniProgramPage);
