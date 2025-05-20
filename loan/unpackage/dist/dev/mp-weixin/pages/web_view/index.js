"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    url: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    if (!props.url) {
      common_vendor.index.showToast({
        title: "链接无效",
        icon: "error",
        duration: 2e3
      });
    }
    return (_ctx, _cache) => {
      return {
        a: props.url
      };
    };
  }
});
wx.createPage(_sfc_main);
