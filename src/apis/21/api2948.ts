// @ts-nocheck
/**
 * 小程序专用的Oss上传签名
 * http://yapi.bwyd.com/project/21/interface/api/2948
 **/

import request from "@/service/http.ts";

/**
 * StsAccessPolicyParam :StsAccessPolicyParam
 */
export class IReqapi2948 {
  /**
   * policy参数
   */
  policy?: string;
}

/**
 * Result<STSAccessDataMaVO> :Result
 */
export class IResapi2948 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * STSAccessDataMaVO
   */
  data?: {
    /**
     * 阿里云的endpoint
     */
    endPoint?: string;
    /**
     * 阿里云bucket名称
     */
    bucketName?: string;
    /**
     * 临时token
     */
    securityToken?: string;
    /**
     * 临时sts的key
     */
    accessKeyId?: string;
    /**
     * policy
     */
    policy?: string;
    /**
     * 签名
     */
    signature?: string;
    /**
     * 过期时间
     */
    expiration?: string;
  };
}

export const req2948Config = (data: IReqapi2948) => ({
  url: `/aliyun/ma/stsToken`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 小程序专用的Oss上传签名
 **/
export default function (data: IReqapi2948 = {}): Promise<IResapi2948["data"]> {
  return request(req2948Config(...arguments));
}
