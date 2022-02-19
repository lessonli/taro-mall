// @ts-nocheck
/**
 * 查找下一个红包ID
 * http://yapi.bwyd.com/project/21/interface/api/4674
 **/

import request from "@/service/http.ts";

export class IReqapi4674 {
  /**
   * 当前红包ID(String)
   */
  uuid?: string | number;
}

/**
 * Result<String> :Result
 */
export class IResapi4674 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4674Config = (data: IReqapi4674) => ({
  url: `/red/packet/user/findNext`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查找下一个红包ID
 **/
export default function (data: IReqapi4674 = {}): Promise<IResapi4674["data"]> {
  return request(req4674Config(...arguments));
}
