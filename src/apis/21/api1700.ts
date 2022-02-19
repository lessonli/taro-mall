// @ts-nocheck
/**
 * 微信公众号授权回调（静默授权）
 * http://yapi.bwyd.com/project/21/interface/api/1700
 **/

import request from "@/service/http.ts";

export class IReqapi1700 {
  /**
   * 微信的AppId
   */
  appId?: string | number;
  /**
   * code
   */
  code?: string | number;
  /**
   * 前端重定向URL
   */
  redirectUrl?: string | number;
  /**
   * 强制授权静默授权
   */
  wxH5LoginType?: string | number;
  /**
   * 渠道编号
   */
  channel?: string | number;
  /**
   * 终端
   */
  terminal?: string | number;
}

export class IResapi1700 {}

export const req1700Config = (data: IReqapi1700) => ({
  url: `/auth/wx/mp/callback/silent`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 微信公众号授权回调（静默授权）
 **/
export default function (data: IReqapi1700 = {}): Promise<IResapi1700["data"]> {
  return request(req1700Config(...arguments));
}
