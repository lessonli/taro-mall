// @ts-nocheck
/**
 * 发送支付密码修改验证码
 * http://yapi.bwyd.com/project/21/interface/api/3578
 **/

import request from "@/service/http.ts";

export class IReqapi3578 {}

/**
 * Result<Void> :Result
 */
export class IResapi3578 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3578Config = (data: IReqapi3578) => ({
  url: `/user/password/pay/mtCode`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 发送支付密码修改验证码
 **/
export default function (data: IReqapi3578 = {}): Promise<IResapi3578["data"]> {
  return request(req3578Config(...arguments));
}
