
import request from "@/service/http";

// 获取oss签名
export const getOssSign = (): Promise<{
  /**
     * 临时token
     */
   securityToken?: string;
   /**
    * 临时sts的secret
    */
   accessKeySecret?: string;
   /**
    * 临时sts的key
    */
   accessKeyId?: string;
   /**
    * 过期时间
    */
   expiration?: string;
}> => request({
  url: `/aliyun/stsToken`,
  method: 'GET',
})