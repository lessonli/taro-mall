// @ts-nocheck
/**
 * 获取当前用户的未支付的直播订单
 * http://yapi.bwyd.com/project/21/interface/api/4628
 **/

import request from "@/service/http.ts";

export class IReqapi4628 {}

/**
 * Result<Integer> :Result
 */
export class IResapi4628 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4628Config = (data: IReqapi4628) => ({
  url: `/live/room/countToPayOrder`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取当前用户的未支付的直播订单
 **/
export default function (data: IReqapi4628 = {}): Promise<IResapi4628["data"]> {
  return request(req4628Config(...arguments));
}
