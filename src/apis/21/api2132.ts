// @ts-nocheck
/**
 * 绑定手机号
 * http://yapi.bwyd.com/project/21/interface/api/2132
 **/

import request from "@/service/http.ts";

/**
 * BindMobileParam :BindMobileParam
 */
export class IReqapi2132 {
  /**
   * 用户编号（前端不需要传，后端自取）
   */
  userNo?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 登录验证码
   */
  mtCode?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2132 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2132Config = (data: IReqapi2132) => ({
  url: `/auth/bind/mobile`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 绑定手机号
 **/
export default function (data: IReqapi2132 = {}): Promise<IResapi2132["data"]> {
  return request(req2132Config(...arguments));
}
