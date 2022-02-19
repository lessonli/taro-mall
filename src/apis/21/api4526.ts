// @ts-nocheck
/**
 * 上报用户信息
 * http://yapi.bwyd.com/project/21/interface/api/4526
 **/

import request from "@/service/http.ts";

export class IReqapi4526 {}

/**
 * Result<Void> :Result
 */
export class IResapi4526 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4526Config = (data: IReqapi4526) => ({
  url: `/message/receive/submit`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 上报用户信息
 **/
export default function (data: IReqapi4526 = {}): Promise<IResapi4526["data"]> {
  return request(req4526Config(...arguments));
}
