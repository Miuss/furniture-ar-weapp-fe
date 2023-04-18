"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
var store_userStore = require("./store/userStore.js");
var store_index = require("./store/index.js");
require("./api/user.js");
require("./utils/fetch.js");
require("./utils/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/detail/detail.js";
}
const _sfc_main = {
  setup(__props) {
    const userStore = store_userStore.useUserStore();
    console.log(`token: ${userStore.user.token}`);
    if (userStore.user.token == "") {
      userStore.Restore();
      wx.redirectTo({
        url: "/pages/login/login"
      });
    } else {
      userStore.getUserMainInfo();
    }
    return () => {
    };
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
