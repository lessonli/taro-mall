// @ts-nocheck
/**
 * 删除订单
 * http://yapi.bwyd.com/project/21/interface/api/3434
 **/

import request from "@/service/http.ts";

/**
 * OrderDeleteParam :OrderDeleteParam
 */
export class IReqapi3434 {
  /**
   * 订单号
   */
  orderNo?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi3434 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req3434Config = (data: IReqapi3434) => ({
  url: `/merchant/order/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 删除订单
 **/
export default function (data: IReqapi3434 = {}): Promise<IResapi3434["data"]> {
  return request(req3434Config(...arguments));
}
