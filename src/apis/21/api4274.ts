// @ts-nocheck
/**
 * 获取h5的地址
 * http://yapi.bwyd.com/project/21/interface/api/4274
 **/

import request from "@/service/http.ts";

export class IReqapi4274 {}

/**
 * Result<String> :Result
 */
export class IResapi4274 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4274Config = (data: IReqapi4274) => ({
  url: `/config/h5/host`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取h5的地址
 **/
export default function (data: IReqapi4274 = {}): Promise<IResapi4274["data"]> {
  return request(req4274Config(...arguments));
}
