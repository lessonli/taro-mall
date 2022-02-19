// @ts-nocheck
/**
 * 删除订单
 * http://yapi.bwyd.com/project/21/interface/api/3440
 **/

import request from "@/service/http.ts";

/**
 * OrderDeleteParam :OrderDeleteParam
 */
export class IReqapi3440 {
  /**
   * 订单号
   */
  orderNo?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi3440 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req3440Config = (data: IReqapi3440) => ({
  url: `/order/delete`,
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
export default function (data: IReqapi3440 = {}): Promise<IResapi3440["data"]> {
  return request(req3440Config(...arguments));
}
