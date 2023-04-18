"use strict";
var common_vendor = require("../../../../common/vendor.js");
var store_userStore = require("../../../../store/userStore.js");
var api_user = require("../../../../api/user.js");
require("../../../../utils/fetch.js");
require("../../../../utils/index.js");
var infoIcon = "/assets/images/info.svg";
var feedbackIcon = "/assets/images/feedback.svg";
var shareOutlineIcon = "/assets/images/share-outline.svg";
var logoutIcon = "/assets/images/logout.svg";
if (!Array) {
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  const _component_van_cell = common_vendor.resolveComponent("van-cell");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  (_component_van_nav_bar + _component_van_cell + _component_van_cell_group)();
}
const _sfc_main = {
  setup(__props) {
    const userStore = store_userStore.useUserStore();
    const toAbout = () => {
    };
    const toAdminLogin = () => {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res.result);
          api_user.loginAdmin({ token: res.result });
        }
      });
    };
    const userLogout = () => {
      userStore.Restore();
      wx.redirectTo({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.p({
          zIndex: 99,
          fixed: true,
          border: false,
          placeholder: true
        }),
        b: common_vendor.unref(userStore).user.userInfo != null
      }, common_vendor.unref(userStore).user.userInfo != null ? common_vendor.e({
        c: (_a = common_vendor.unref(userStore).user.userInfo.avatarUrl) != null ? _a : "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
        d: common_vendor.t(common_vendor.unref(userStore).user.userInfo.username),
        e: common_vendor.unref(userStore).user.userInfo.roles == "admin"
      }, common_vendor.unref(userStore).user.userInfo.roles == "admin" ? {} : {}, {
        f: common_vendor.t(common_vendor.unref(userStore).user.userInfo.createdAt)
      }) : {}, {
        g: common_vendor.unref(infoIcon),
        h: common_vendor.o(($event) => toAdminLogin()),
        i: common_vendor.p({
          size: "large",
          isLink: true
        }),
        j: common_vendor.unref(infoIcon),
        k: common_vendor.o(($event) => toAbout()),
        l: common_vendor.p({
          size: "large",
          isLink: true
        }),
        m: common_vendor.unref(feedbackIcon),
        n: common_vendor.p({
          size: "large",
          isLink: true
        }),
        o: common_vendor.unref(shareOutlineIcon),
        p: common_vendor.p({
          size: "large",
          isLink: true
        }),
        q: common_vendor.unref(logoutIcon),
        r: common_vendor.o(($event) => userLogout()),
        s: common_vendor.p({
          size: "large",
          isLink: true
        }),
        t: common_vendor.p({
          inset: true
        })
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/miuss/Documents/HBuilderProjects/furniture-ar-weapp-fe/pages/index/basic/me/me.vue"]]);
wx.createComponent(Component);
