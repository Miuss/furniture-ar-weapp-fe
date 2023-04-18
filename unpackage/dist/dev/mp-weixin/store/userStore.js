"use strict";
var common_vendor = require("../common/vendor.js");
var api_user = require("../api/user.js");
var utils_fetch = require("../utils/fetch.js");
var utils_index = require("../utils/index.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const user = common_vendor.ref({
    token: wx.getStorageSync("token") || "",
    isLogin: false,
    userInfo: null
  });
  const loginLoading = common_vendor.ref(false);
  const getUserMainInfo = async () => {
    try {
      const res = await api_user.getUserInfo();
      user.value.userInfo = res.data;
    } catch (e) {
      console.error(e);
    }
  };
  const userLogin = async () => {
    loginLoading.value = true;
    try {
      const wxLoginRes = await utils_fetch.wxlogin();
      console.log(wxLoginRes);
      const res = await api_user.login({
        code: wxLoginRes.code
      });
      console.log("\u767B\u5F55\u6210\u529F");
      wx.setStorageSync("token", res.data.token);
      user.value.token = res.data.token;
      user.value.isLogin = true;
      await getUserMainInfo();
      wx.redirectTo({
        url: "/pages/index/index"
      });
      utils_index.showToast("\u767B\u5F55\u6210\u529F");
    } catch (e) {
      utils_index.showError("\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      console.error(e);
    } finally {
      loginLoading.value = false;
    }
  };
  const Restore = async () => {
    wx.removeStorageSync("token");
    user.value.isLogin = false;
    user.value.token = "";
    user.value.userInfo = null;
  };
  return {
    user,
    userLogin,
    Restore,
    loginLoading,
    getUserMainInfo
  };
});
exports.useUserStore = useUserStore;
