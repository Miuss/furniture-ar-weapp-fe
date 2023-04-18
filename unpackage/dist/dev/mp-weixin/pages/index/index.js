"use strict";
var common_vendor = require("../../common/vendor.js");
var svg_home = "/assets/images/explore.svg";
var svg_home_a = "/assets/images/explore_active.svg";
var svg_mine = "/assets/images/me.svg";
var svg_mine_a = "/assets/images/me_active.svg";
var svg_ar = "/assets/images/cube-outline.svg";
var svg_ar_a = "/assets/images/cube-outline_active.svg";
if (!Array) {
  const _component_van_tabbar_item = common_vendor.resolveComponent("van-tabbar-item");
  const _component_van_tabbar = common_vendor.resolveComponent("van-tabbar");
  (_component_van_tabbar_item + _component_van_tabbar)();
}
if (!Math) {
  (home + ar + me)();
}
const home = () => "./basic/home/home.js";
const me = () => "./basic/me/me.js";
const ar = () => "./basic/ar/ar.js";
const _sfc_main = {
  setup(__props) {
    const active = common_vendor.ref("home");
    const iconWidth = "34px";
    const iconHeight = "25px";
    const icons = common_vendor.ref([{
      name: "home",
      default: svg_home,
      active: svg_home_a,
      text: "\u9996\u9875"
    }, {
      name: "ar",
      default: svg_ar,
      active: svg_ar_a,
      text: "AR\u63A2\u7D22"
    }, {
      name: "me",
      default: svg_mine,
      active: svg_mine_a,
      text: "\u6211\u7684"
    }]);
    const onChange = (event) => {
      active.value = event.detail;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: active.value == "home"
      }, active.value == "home" ? {} : {}, {
        b: active.value == "ar"
      }, active.value == "ar" ? {} : {}, {
        c: active.value == "me"
      }, active.value == "me" ? {} : {}, {
        d: common_vendor.f(icons.value, (item, index, i0) => {
          return {
            a: item.default,
            b: item.active,
            c: common_vendor.t(item.text),
            d: index,
            e: "f87cbb10-4-" + i0 + ",f87cbb10-3",
            f: common_vendor.p({
              name: item.name
            })
          };
        }),
        e: common_vendor.s("width:" + iconWidth + ";height:" + iconHeight + ";"),
        f: common_vendor.s("width:" + iconWidth + ";height:" + iconHeight + ";"),
        g: common_vendor.o(onChange),
        h: common_vendor.p({
          zIndex: 1e3,
          active: active.value,
          activeColor: "#ffffff",
          inactiveColor: "#8a8a8a"
        })
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
