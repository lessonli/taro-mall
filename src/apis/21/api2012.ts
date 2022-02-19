// @ts-nocheck
/**
 * 发送登录验证码
 * http://yapi.bwyd.com/project/21/interface/api/2012
 **/

import request from "@/service/http.ts";

/**
 * MtCodeParam :MtCodeParam
 */
export class IReqapi2012 {
  /**
   * 手机号码
   */
  mobile?: string;
}

/**
 * Result<String> :Result
 */
export class IResapi2012 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req2012Config = (data: IReqapi2012) => ({
  url: `/auth/login/sendMtCode`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 发送登录验证码
 **/
export default function (data: IReqapi2012 = {}): Promise<IResapi2012["data"]> {
  return request(req2012Config(...arguments));
}
