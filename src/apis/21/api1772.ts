// @ts-nocheck
/**
 * 获取微信公众号jsapi的授权签名
 * http://yapi.bwyd.com/project/21/interface/api/1772
 **/

import request from "@/service/http.ts";

export class IReqapi1772 {
  appId?: string | number;
  url?: string | number;
}

/**
 * Result<WxJsapiSignatureVO> :Result
 */
export class IResapi1772 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * WxJsapiSignatureVO
   */
  data?: {
    appId?: string;
    nonceStr?: string;
    timestamp?: number;
    url?: string;
    signature?: string;
  };
}

export const req1772Config = (data: IReqapi1772) => ({
  url: `/auth/wx/mp/signature`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取微信公众号jsapi的授权签名
 **/
export default function (data: IReqapi1772 = {}): Promise<IResapi1772["data"]> {
  return request(req1772Config(...arguments));
}
