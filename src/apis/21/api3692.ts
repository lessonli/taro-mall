// @ts-nocheck
/**
 * 发送用户实名认证短信验证码
 * http://yapi.bwyd.com/project/21/interface/api/3692
 **/

import request from "@/service/http.ts";

/**
 * MtCodeParam :MtCodeParam
 */
export class IReqapi3692 {
  /**
   * 手机号码
   */
  mobile?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi3692 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3692Config = (data: IReqapi3692) => ({
  url: `/user/authorization/send/mtCode`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 发送用户实名认证短信验证码
 **/
export default function (data: IReqapi3692 = {}): Promise<IResapi3692["data"]> {
  return request(req3692Config(...arguments));
}
