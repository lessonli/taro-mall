// @ts-nocheck
/**
 * 发送绑定手机号验证码
 * http://yapi.bwyd.com/project/21/interface/api/3698
 **/

import request from "@/service/http.ts";

/**
 * MtCodeParam :MtCodeParam
 */
export class IReqapi3698 {
  /**
   * 手机号码
   */
  mobile?: string;
}

/**
 * Result<String> :Result
 */
export class IResapi3698 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req3698Config = (data: IReqapi3698) => ({
  url: `/auth/bind/mobile/sendMtCode`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 发送绑定手机号验证码
 **/
export default function (data: IReqapi3698 = {}): Promise<IResapi3698["data"]> {
  return request(req3698Config(...arguments));
}
