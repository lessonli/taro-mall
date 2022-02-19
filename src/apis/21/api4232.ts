// @ts-nocheck
/**
 * IOS一键登录
 * http://yapi.bwyd.com/project/21/interface/api/4232
 **/

import request from "@/service/http.ts";

export class IReqapi4232 {}

/**
 * Result<MobileAuthVo> :Result
 */
export class IResapi4232 {
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

export const req4232Config = (data: IReqapi4232) => ({
  url: `/auth/login/ios`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * IOS一键登录
 **/
export default function (data: IReqapi4232 = {}): Promise<IResapi4232["data"]> {
  return request(req4232Config(...arguments));
}
