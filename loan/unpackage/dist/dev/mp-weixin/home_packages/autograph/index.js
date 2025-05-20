"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    name: {
      type: String
    }
  },
  setup(__props) {
    const state = common_vendor.reactive({
      navigationBarHeight: 0,
      ctx: null,
      points: [],
      clearFlag: false
    });
    common_vendor.onMounted(() => {
      common_vendor.index.getSystemInfo({
        success: () => {
          const custom = common_vendor.index.getMenuButtonBoundingClientRect();
          state.navigationBarHeight = custom.height + custom.top * 2;
        }
      });
    });
    state.ctx = common_vendor.index.createCanvasContext("autograph", this);
    state.ctx.lineWidth = 8;
    state.ctx.lineCap = "round";
    state.ctx.lineJoin = "round";
    const starts = (e) => {
      let startX = e.changedTouches[0].x;
      let startY = e.changedTouches[0].y;
      let startPoint = { X: startX, Y: startY };
      state.points.push(startPoint);
      state.ctx.beginPath();
    };
    const moves = (e) => {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = { X: moveX, Y: moveY };
      state.points.push(movePoint);
      let len = state.points.length;
      if (len >= 2) {
        draw();
      }
    };
    const end = () => {
      state.points = [];
      state.clearFlag = false;
    };
    const save = () => {
      common_vendor.index.canvasToTempFilePath({
        canvasId: "autograph",
        success: (res) => {
          if (state.clearFlag) {
            common_vendor.index.setStorageSync("autograph", "empty");
            back();
            return;
          }
          common_vendor.index.setStorageSync("autograph", res.tempFilePath);
          back();
        }
      });
    };
    const draw = () => {
      let point1 = state.points[0];
      let point2 = state.points[1];
      state.points.shift();
      state.ctx.moveTo(point1.X, point1.Y);
      state.ctx.lineTo(point2.X, point2.Y);
      state.ctx.stroke();
      state.ctx.draw(true);
    };
    const clear = () => {
      state.clearFlag = true;
      common_vendor.index.createSelectorQuery().select("#signature").boundingClientRect((res) => {
        state.ctx.clearRect(0, 0, res.width, res.height);
        state.ctx.draw(true);
      }).exec();
    };
    const props = __props;
    const back = () => {
      common_vendor.index.navigateBack({
        fail: () => {
          console.log("返回首页");
          common_vendor.index.switchTab({
            url: "/pages/home/index"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => back()),
        b: common_vendor.p({
          name: "arrow-left",
          size: "5vh",
          color: "#333333"
        }),
        c: state.navigationBarHeight + "px",
        d: common_vendor.t(props.name),
        e: props.name.length * 40 + "vh",
        f: common_vendor.o(starts),
        g: common_vendor.o(moves),
        h: common_vendor.o(end),
        i: common_vendor.o(($event) => clear()),
        j: common_vendor.o(($event) => save()),
        k: "calc(100vh - " + state.navigationBarHeight + "px - 2vw - 6vh)"
      };
    };
  }
});
wx.createPage(_sfc_main);
