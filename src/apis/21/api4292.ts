// @ts-nocheck
/**
 * 根据订单号获取当前用户角色       0用户, 1商户
 * http://yapi.bwyd.com/project/21/interface/api/4292
 **/

import request from "@/service/http.ts";

export class IReqapi4292 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi4292 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4292Config = (data: IReqapi4292) => ({
  url: `/order/getOrderRole`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号获取当前用户角色       0用户, 1商户
 **/
export default function (data: IReqapi4292 = {}): Promise<IResapi4292["data"]> {
  return request(req4292Config(...arguments));
}
