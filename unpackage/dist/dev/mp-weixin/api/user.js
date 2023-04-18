"use strict";
var utils_fetch = require("../utils/fetch.js");
const login = async function(data) {
  const res = await utils_fetch.request({
    url: `/v1/auth/login`,
    method: "POST",
    data
  });
  return res;
};
const getUserInfo = async function() {
  const res = await utils_fetch.request({
    url: `/v1/user/maininfo`,
    method: "GET"
  });
  return res;
};
const loginAdmin = async function(data) {
  const res = await utils_fetch.request({
    url: `/v1/auth/confirmAdminLogin`,
    method: "POST",
    data
  });
  return res;
};
exports.getUserInfo = getUserInfo;
exports.login = login;
exports.loginAdmin = loginAdmin;
