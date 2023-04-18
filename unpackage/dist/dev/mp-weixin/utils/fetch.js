"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var utils_index = require("./index.js");
var store_userStore = require("../store/userStore.js");
async function request(obj) {
  const userStore = store_userStore.useUserStore();
  const token = userStore.user.token;
  let Authorization = "";
  if (token !== "" && token !== void 0) {
    Authorization = {
      "Authorization": "Bearer " + token
    };
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${utils_index.api}${obj.url}`,
      data: obj.data,
      method: obj.method,
      header: __spreadValues(__spreadValues({
        "Content-Type": "application/x-www-form-urlencoded"
      }, Authorization), obj.header),
      success(res) {
        handleResult(res);
        resolve(res.data);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
async function wxlogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
function handleResult(res) {
  let code = res.statusCode;
  switch (code) {
    case 200:
      break;
    case 401:
      utils_index.showToast("\u8EAB\u4EFD\u6821\u9A8C\u4FE1\u606F\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\uFF01");
      const userStore = store_userStore.useUserStore();
      userStore.Restore();
      wx.redirectTo({
        url: "/pages/login/login"
      });
      console.error("\u8EAB\u4EFD\u6821\u9A8C\u4FE1\u606F\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\uFF01");
      break;
    default:
      let msg = res.data.message ? res.data.message : "\u672A\u77E5\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5\uFF01";
      utils_index.showToast(msg);
  }
}
exports.request = request;
exports.wxlogin = wxlogin;
