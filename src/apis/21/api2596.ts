// @ts-nocheck
/**
 * Oss上传签名生成
 * http://yapi.bwyd.com/project/21/interface/api/2596
 **/

import request from "@/service/http.ts";

export class IReqapi2596 {}

/**
 * Result<STSAccessDataVO> :Result
 */
export class IResapi2596 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * STSAccessDataVO
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
  };
}

export const req2596Config = (data: IReqapi2596) => ({
  url: `/aliyun/stsToken`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * Oss上传签名生成
 **/
export default function (data: IReqapi2596 = {}): Promise<IResapi2596["data"]> {
  return request(req2596Config(...arguments));
}
