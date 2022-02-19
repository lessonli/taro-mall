// @ts-nocheck
/**
 * 手机号码登录
 * http://yapi.bwyd.com/project/21/interface/api/2028
 **/

import request from "@/service/http.ts";

/**
 * MobileLoginParam :MobileLoginParam
 */
export class IReqapi2028 {
  /**
   * 手机号码
   */
  mobile?: string;
  /**
   * 登录验证码
   */
  mtCode?: string;
}

/**
 * Result<MobileAuthVo> :Result
 */
export class IResapi2028 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MobileAuthVo
   */
  data?: {
    /**
     * 用户登录token
     */
    token?: string;
  };
}

export const req2028Config = (data: IReqapi2028) => ({
  url: `/auth/login/mobile`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 手机号码登录
 **/
export default function (data: IReqapi2028 = {}): Promise<IResapi2028["data"]> {
  return request(req2028Config(...arguments));
}
