// @ts-nocheck
/**
 * 获取微信公众号授权跳转地址
 * http://yapi.bwyd.com/project/21/interface/api/1684
 **/

import request from "@/service/http.ts";

export class IReqapi1684 {
  sourceUrl?: string | number;
  redirectUrl?: string | number;
  appId?: string | number;
  wxH5LoginType?: string | number;
  channel?: string | number;
}

export class IResapi1684 {}

export const req1684Config = (data: IReqapi1684) => ({
  url: `/auth/wx/mp/auth-url`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取微信公众号授权跳转地址
 **/
export default function (data: IReqapi1684 = {}): Promise<IResapi1684["data"]> {
  return request(req1684Config(...arguments));
}
