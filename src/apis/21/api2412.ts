// @ts-nocheck
/**
 * 设置支付密码
 * http://yapi.bwyd.com/project/21/interface/api/2412
 **/

import request from "@/service/http.ts";

/**
 * PayPasswordSetParam :PayPasswordSetParam
 */
export class IReqapi2412 {
  /**
   * 用户编号
   */
  userNo?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 短信验证码
   */
  mtCode?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2412 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2412Config = (data: IReqapi2412) => ({
  url: `/user/password/pay/set`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 设置支付密码
 **/
export default function (data: IReqapi2412 = {}): Promise<IResapi2412["data"]> {
  return request(req2412Config(...arguments));
}
