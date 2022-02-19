// @ts-nocheck
/**
 * 确认收货，完成订单
 * http://yapi.bwyd.com/project/21/interface/api/2004
 **/

import request from "@/service/http.ts";

/**
 * OrderReceiveParam :OrderReceiveParam
 */
export class IReqapi2004 {
  /**
   * 订单号
   */
  orderNo?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2004 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2004Config = (data: IReqapi2004) => ({
  url: `/order/receive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 确认收货，完成订单
 **/
export default function (data: IReqapi2004 = {}): Promise<IResapi2004["data"]> {
  return request(req2004Config(...arguments));
}
