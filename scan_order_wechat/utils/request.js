import {
	baseUrl
} from "./config.js"

import crypto from "crypto-js"
import {
	Base64
} from "js-base64"

function request(path, data, method = "POST") {
	let url = baseUrl + path;
	return new Promise(async (resolve, reject) => {
		if (path === "") {
			// 计算签名。
			function computeSignature(accessKeySecret, canonicalString) {
				return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
			}

			const date = new Date();
			date.setHours(date.getHours() + 1);
			const policyText = {
				expiration: date.toISOString(), // 设置policy过期时间。
				conditions: [
					// 限制上传大小。
					["content-length-range", 0, 1024 * 1024 * 1024],
				],
			};

			//获取OSS配置
			const credentials = await request("/factory_storage/File/refreshSTS")

			const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
			const signature = computeSignature(credentials.keySecret, policy)
			//获取文件名和服务器存储路径
			const serverFilePath = "user/" + data.params.fileName
			//获取文件大小
			const fileSys = uni.getFileSystemManager()
			let fileSize = data.params.fileSize
			//上传文件到oss
			const res = await uni.uploadFile({
				url: credentials.endpoint,
				filePath: data.file,
				name: "file",
				formData: {
					key: serverFilePath,
					policy,
					OSSAccessKeyId: credentials.keyId,
					signature,
					'x-oss-security-token': credentials.token
				}
			})

			let obj = res;
			if (obj.errMsg == 'uploadFile:ok') {
				// 返回上传OSS结果
				resolve(await request("/factory_storage/File/frontUpload", {
					url: credentials.endpoint + "/" + serverFilePath,
					name: data.params.fileName,
					size: data.params.fileSize + "KB",
					upload_type: "oss",
					file_type: "image"
				}))
			} else {
				uni.showToast({
					title: obj.errMsg || '网络是否有点问题',
					duration: 1000,
					icon: 'none'
				});
				reject();
			}
		} else {
			uni.request({
				url,
				data: JSON.stringify(data) == "{}" ? '' : {
					post_params: data
				},
				method,
				header: {
					"Authorization": uni.getStorageSync("token") || "",
				},
				timeout: 6000,
				success: (res) => {
					let obj = res.data;
					if (obj.code === 1) {
						resolve(obj.data)
					} else {
						if (obj.code === -1) {
							uni.showToast({
								title: "登录验证失败，请重新登录",
								duration: 2000,
								icon: "none"
							})
							// if (!uni.getStorageSync("token")) return;
							uni.clearStorageSync();

						} else if (obj.code === -2) {
							uni.showToast({
								title: "登录异常，请联系管理员",
								duration: 2000,
								icon: "none"
							})
							uni.clearStorageSync();
						} else {
							uni.showToast({
								title: obj.message || '网络是否有点问题',
								duration: 1000,
								icon: 'none'
							});
						}
						reject();
					}
				},
				fail: res => {
					uni.showToast({
						title: res.message || '网络是否有点问题',
						duration: 1000,
						icon: 'none'
					});
					reject(res.errMsg)
				}
			})
		}
	})
}

export default request;