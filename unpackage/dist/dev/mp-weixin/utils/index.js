"use strict";
const api = "https://furniture-ar-server.miuss.icu/api";
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
