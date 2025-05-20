// import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707';
// import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
// import Util, * as $Util from '@alicloud/tea-util';

// export function aliOCR(type, url) {
// 	type = type + "Request"
// 	return new Promise(async (resolve, reject) => {
// 		let config = new $OpenApi.Config({
// 			// 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
// 			accessKeyId: "LTAI5tK5pRCSZ6mznHGR31RZ",
// 			// 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
// 			accessKeySecret: "1Dq607xuxZ4RJqEKCqUWsxoHDe0wu2",
// 		});
// 		config.endpoint = `ocr-api.cn-hangzhou.aliyuncs.com`;
// 		let client = new ocr_api20210707(config);
// 		let recognizeIdcardRequest = new $ocr_api20210707[type]({
// 			url
// 		});
// 		let runtime = new $Util.RuntimeOptions({});
// 		resolve(await client.recognizeIdcardWithOptions(recognizeIdcardRequest, runtime))
// 	})
// }