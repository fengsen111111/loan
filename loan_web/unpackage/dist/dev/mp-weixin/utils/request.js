"use strict";
const common_vendor = require("../common/vendor.js");
const utils_config = require("./config.js");
function request(path, data = {}, method = "POST") {
  let url = utils_config.baseUrl + path;
  return new Promise(async (resolve, reject) => {
    let {
      file,
      fileType,
      params
    } = data;
    if (fileType === "file") {
      let computeSignature = function(accessKeySecret, canonicalString) {
        return common_vendor.crypto.enc.Base64.stringify(common_vendor.crypto.HmacSHA1(canonicalString, accessKeySecret));
      };
      const date = /* @__PURE__ */ new Date();
      date.setHours(date.getHours() + 1);
      const policyText = {
        expiration: date.toISOString(),
        // 设置policy过期时间。
        conditions: [
          // 限制上传大小。
          ["content-length-range", 0, 1024 * 1024 * 1024]
        ]
      };
      const credentials = await request("/factory_storage/File/refreshSTS");
      const policy = common_vendor.gBase64.encode(JSON.stringify(policyText));
      const signature = computeSignature(credentials.data.keySecret, policy);
      const serverFilePath = "user/" + params.fileName;
      common_vendor.index.getFileSystemManager();
      params.fileSize;
      const res = await common_vendor.index.uploadFile({
        url: credentials.data.endpoint,
        filePath: file,
        name: "file",
        formData: {
          key: serverFilePath,
          policy,
          OSSAccessKeyId: credentials.data.keyId,
          signature,
          "x-oss-security-token": credentials.data.token
        }
      });
      let obj = res;
      if (obj.errMsg == "uploadFile:ok") {
        resolve(await request("/factory_storage/File/frontUpload", {
          url: credentials.data.endpoint + "/" + serverFilePath,
          name: params.fileName,
          size: params.fileSize + "KB",
          upload_type: "oss",
          fileType: "image"
        }));
      } else {
        common_vendor.index.showToast({
          title: obj.errMsg || "网络是否有点问题",
          duration: 1e3,
          icon: "none"
        });
        reject();
      }
    } else {
      common_vendor.index.request({
        url,
        data: JSON.stringify(data) == "{}" ? "" : {
          post_params: data
        },
        method,
        header: {
          "Authorization": common_vendor.index.getStorageSync("token") || ""
        },
        timeout: 6e3,
        success: (res) => {
          let obj = res.data;
          if (obj.code == 1) {
            resolve(obj);
          } else {
            if (obj.code === -1 || obj.code === -2) {
              common_vendor.index.clearStorageSync();
              common_vendor.index.showToast({
                title: "登录验证失败，请重新登录",
                duration: 2e3,
                icon: "none"
              });
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: "/pages/mine/index"
                });
              }, 2200);
            } else {
              common_vendor.index.showToast({
                title: obj.message || "网络是否有点问题",
                duration: 1e3,
                icon: "none"
              });
            }
            reject();
          }
        },
        fail: (res) => {
          common_vendor.index.showToast({
            title: res.message || "网络是否有点问题",
            duration: 1e3,
            icon: "none"
          });
          reject(res.errMsg);
        }
      });
    }
  });
}
exports.request = request;
