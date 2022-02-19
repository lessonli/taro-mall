// @ts-nocheck
/**
 * 手机号码一键登录
 * http://yapi.bwyd.com/project/21/interface/api/2036
 **/

import request from "@/service/http.ts";

/**
 * TokenLoginParam :TokenLoginParam
 */
export class IReqapi2036 {
  /**
   * 移动端授权凭据
   */
  accessToken?: string;
}

/**
 * Result<MobileAuthVo> :Result
 */
export class IResapi2036 {
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

export const req2036Config = (data: IReqapi2036) => ({
  url: `/auth/login/accessToken`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 手机号码一键登录
 **/
export default function (data: IReqapi2036 = {}): Promise<IResapi2036["data"]> {
  return request(req2036Config(...arguments));
}
