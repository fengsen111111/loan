"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-read-more",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$6],
  data() {
    return {
      isLongContent: false,
      // 是否需要隐藏一部分内容
      status: "close",
      // 当前隐藏与显示的状态，close-收起状态，open-展开状态
      elId: common_vendor.guid(),
      // 生成唯一class
      contentHeight: 100
      // 内容高度
    };
  },
  computed: {
    // 展开后无需阴影，收起时才需要阴影样式
    innerShadowStyle() {
      if (this.status === "open")
        return {};
      else
        return this.shadowStyle;
    }
  },
  mounted() {
    this.init();
  },
  emits: ["open", "close"],
  methods: {
    addUnit: common_vendor.addUnit,
    async init() {
      this.getContentHeight().then((height) => {
        this.contentHeight = height;
        if (height > common_vendor.getPx(this.showHeight)) {
          this.isLongContent = true;
          this.status = "close";
        } else {
          this.isLongContent = false;
          this.status = "close";
        }
      });
    },
    // 获取内容的高度
    async getContentHeight() {
      await common_vendor.sleep(30);
      return new Promise((resolve) => {
        this.$uGetRect("." + this.elId).then((res) => {
          resolve(res.height);
        });
      });
    },
    // 展开或者收起
    toggleReadMore() {
      this.status = this.status === "close" ? "open" : "close";
      if (this.toggle == false)
        this.isLongContent = false;
      this.$emit(this.status, this.name);
    }
  }
};
if (!Array) {
  const _easycom_up_text2 = common_vendor.resolveComponent("up-text");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_up_text2 + _easycom_u_icon2)();
}
const _easycom_up_text = () => "../u-text/u-text.js";
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  (_easycom_up_text + _easycom_u_icon)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.elId),
    b: $data.isLongContent && $data.status === "close" ? $options.addUnit(_ctx.showHeight) : "auto",
    c: _ctx.textIndent,
    d: $data.isLongContent
  }, $data.isLongContent ? {
    e: common_vendor.p({
      text: $data.status === "close" ? _ctx.closeText : _ctx.openText,
      color: _ctx.color,
      size: _ctx.fontSize,
      lineHeight: _ctx.fontSize,
      margin: "0 5px 0 0"
    }),
    f: common_vendor.p({
      color: _ctx.color,
      size: _ctx.fontSize + 2,
      name: $data.status === "close" ? "arrow-down" : "arrow-up"
    }),
    g: common_vendor.o((...args) => $options.toggleReadMore && $options.toggleReadMore(...args)),
    h: common_vendor.s($options.innerShadowStyle)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-235f9756"]]);
wx.createComponent(Component);
