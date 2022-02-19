// @ts-nocheck
/**
 * APP微信授权入口
 * http://yapi.bwyd.com/project/21/interface/api/2044
 **/

import request from "@/service/http.ts";

/**
 * AppWxAuthParam :AppWxAuthParam
 */
export class IReqapi2044 {
  /**
   * 微信的APPID
   */
  appId?: string;
  /**
   * 微信授权返回的CODE
   */
  code?: string;
}

/**
 * Result<WxMaAuthVO> :Result
 */
export class IResapi2044 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * WxMaAuthVO
   */
  data?: {
    token?: string;
  };
}

export const req2044Config = (data: IReqapi2044) => ({
  url: `/auth/app/wx/auth`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * APP微信授权入口
 **/
export default function (data: IReqapi2044 = {}): Promise<IResapi2044["data"]> {
  return request(req2044Config(...arguments));
}
