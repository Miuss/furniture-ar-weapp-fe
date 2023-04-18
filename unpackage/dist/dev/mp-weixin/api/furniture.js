"use strict";
var utils_fetch = require("../utils/fetch.js");
var common_vendor = require("../common/vendor.js");
const getFurnitureList = async function(data) {
  const res = await utils_fetch.request({
    url: `/v1/furniture/list?${common_vendor.lib.stringify(data)}`,
    method: "GET"
  });
  return res;
};
const getFurnitureDetail = async function(data) {
  const res = await utils_fetch.request({
    url: `/v1/furniture/info?${common_vendor.lib.stringify(data)}`,
    method: "GET"
  });
  return res;
};
exports.getFurnitureDetail = getFurnitureDetail;
exports.getFurnitureList = getFurnitureList;
