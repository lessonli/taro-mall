// @ts-nocheck
/**
 * 小程序专用的Oss上传签名
 **/

import request from "@/service/http.ts";

export class IReqapi2930 {
  /**
   * (String)
   */
  policy?: string | number;
}

/**
 * Result<STSAccessDataMPVO> :Result
 */
export class IResapi2930 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * STSAccessDataMPVO
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
     * 签名
     */
    signature?: string;
    /**
     * 过期时间
     */
    expiration?: string;
  };
}

export const req2930Config = (data: IReqapi2930) => ({
  url: `/aliyun/mp/stsToken`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2930 = {}): Promise<IResapi2930["data"]> {
  return request(req2930Config(...arguments));
}
