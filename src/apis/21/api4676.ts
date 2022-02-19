// @ts-nocheck
/**
 * 查找已打开的红包ID
 * http://yapi.bwyd.com/project/21/interface/api/4676
 **/

import request from "@/service/http.ts";

export class IReqapi4676 {}

/**
 * Result<String> :Result
 */
export class IResapi4676 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4676Config = (data: IReqapi4676) => ({
  url: `/red/packet/user/getOpened`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查找已打开的红包ID
 **/
export default function (data: IReqapi4676 = {}): Promise<IResapi4676["data"]> {
  return request(req4676Config(...arguments));
}
