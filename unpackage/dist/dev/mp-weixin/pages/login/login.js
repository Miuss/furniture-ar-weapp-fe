"use strict";
var common_vendor = require("../../common/vendor.js");
var store_userStore = require("../../store/userStore.js");
require("../../api/user.js");
require("../../utils/fetch.js");
require("../../utils/index.js");
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  _component_van_button();
}
const _sfc_main = {
  setup(__props) {
    const userStore = store_userStore.useUserStore();
    return (_ctx, _cache) => {
      return {
        a: _ctx.logo,
        b: common_vendor.o(($event) => common_vendor.unref(userStore).userLogin()),
        c: common_vendor.p({
          type: "primary",
          color: "#000000",
          size: "large",
          round: true,
          block: true,
          loading: common_vendor.unref(userStore).loginLoading,
          loadingText: "\u5FAE\u4FE1\u767B\u5F55\u4E2D...",
          plain: true
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b237504c"], ["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
