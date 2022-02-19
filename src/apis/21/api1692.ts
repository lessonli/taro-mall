// @ts-nocheck
/**
 * 微信公众号授权回调（强制授权）
 * http://yapi.bwyd.com/project/21/interface/api/1692
 **/

import request from "@/service/http.ts";

export class IReqapi1692 {
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

export class IResapi1692 {}

export const req1692Config = (data: IReqapi1692) => ({
  url: `/auth/wx/mp/callback`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 微信公众号授权回调（强制授权）
 **/
export default function (data: IReqapi1692 = {}): Promise<IResapi1692["data"]> {
  return request(req1692Config(...arguments));
}
