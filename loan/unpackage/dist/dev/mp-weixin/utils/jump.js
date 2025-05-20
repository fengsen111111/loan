"use strict";
const common_vendor = require("../common/vendor.js");
function navigateTo(url, data = {}) {
  if (data === true && !common_vendor.index.getStorageSync("userInfo")) {
    return;
  }
  common_vendor.index.navigateTo({
    url: `${url}?${getObjectKeys(data).map((key) => `${key}=${data[key]}`).join("&")}`
  });
}
function back() {
  common_vendor.index.navigateBack();
}
function cardUtil(card) {
  if (card) {
    return card.substr(0, 5) + "****" + card.substr(card.length - 4);
  }
}
function getObjectKeys(obj) {
  return Object.keys(obj);
}
exports.back = back;
exports.cardUtil = cardUtil;
exports.navigateTo = navigateTo;
