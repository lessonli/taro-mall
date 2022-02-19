// @ts-nocheck
/**
 * 微信小程序登陆
 * http://yapi.bwyd.com/project/21/interface/api/1788
 **/

import request from "@/service/http.ts";

/**
 * WxMaAuthParam :WxMaAuthParam
 */
export class IReqapi1788 {
  /**
   * 微信的AppId
   */
  appId?: string;
  /**
   * 微信授权code
   */
  code?: string;
  /**
   * 用户信息加密串
   */
  encryptedData?: string;
  /**
   * iv
   */
  iv?: string;
  channelNo?: string;
  terminal?: string;
}

/**
 * Result<WxMaAuthVO> :Result
 */
export class IResapi1788 {
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

export const req1788Config = (data: IReqapi1788) => ({
  url: `/auth/wx/ma/login`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 微信小程序登陆
 **/
export default function (data: IReqapi1788 = {}): Promise<IResapi1788["data"]> {
  return request(req1788Config(...arguments));
}
