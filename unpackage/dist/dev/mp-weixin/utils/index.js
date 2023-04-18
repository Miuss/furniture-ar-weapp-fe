"use strict";
const api = "http://192.168.1.102:3001/api";
const showToast = function(message) {
  wx.showToast({
    title: message,
    icon: "none",
    duration: 2e3
  });
};
const showError = function(message) {
  wx.showToast({
    title: message.toString().replace(/Error/, "\u9519\u8BEF"),
    icon: "none",
    duration: 2e3
  });
};
exports.api = api;
exports.showError = showError;
exports.showToast = showToast;
