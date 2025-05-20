import OSS from "ali-oss";
import messageErrorWrapper from '@/utils/message-error-wrapper'
//获取文件存储权限
export const getTicket = async () => {
  const STS_TOKEN_URL = import.meta.env.VITE_API_BASE_URL ; // 获取STS token的接口，后端提供
  // fetch方式可按需更换成axios
  const res = await fetch(STS_TOKEN_URL+'/factory_storage/Ticket/getTicket').then(res => res.json());
  const stsTicket = res || {};
  return {
   stsTicket
  };
};


// 获取STS token
export const getSTSToken = async () => {
  const STS_TOKEN_URL = import.meta.env.VITE_API_BASE_URL ; // 获取STS token的接口，后端提供
  // fetch方式可按需更换成axios
  const res = await fetch(STS_TOKEN_URL+'/factory_storage/File/refreshSTS').then(res => res.json());
  const stsToken = res.data|| {};
  return {
   stsToken
  };
};



// 初始化OSS client实例
export const initOSSClient = async () => {
   const ticket = await getTicket();

   if(ticket.stsTicket.code==1){

   
  const token = await getSTSToken();
 
  // 可按需选择是挂载在window 还是其他变量上
  window.globalOSSClient = new OSS({
    region: token.stsToken.bucket, //根据那你的Bucket地点来填写
    accessKeyId: token.stsToken.keyId, //自己账户的KeyId，这里getSTSToken通过后端获取
    accessKeySecret: token.stsToken.keySecret, //自己账户的KeySecret，这里getSTSToken通过后端获取
    stsToken: token.stsToken.token, // Token,这里getSTSToken通过后端获取
    refreshSTSToken: async () => {
      const tokenInfo = await getSTSToken();
      return tokenInfo;
    },
    // 刷新临时访问凭证的时间间隔，单位为毫秒。
   refreshSTSTokenInterval: 300000,
    bucket: token.stsToken.bucket, //bucket名字
    endpoint: token.stsToken.endpoint,
    secure: true,
    cname: true,
  });
   if (window.globalOSSClient) {
    console.log('OSS Client initialized successfully');
} else {
    console.error('Failed to initialize OSS Client');
}
}else{
    messageErrorWrapper({
          content: '获取文件存储权限失败',
          duration: 5 * 1000
        })
}
};
// 删除oss的资源
export const delOSSUrl = url => {
  if (!url) return;
  const defaulUrl = new URL(url).origin + "/";
  const urlNew = url.replace(defaulUrl, "");
  window.globalOSSClient.delete(urlNew).then(res => {
    console.log("res", res);
  });
};
