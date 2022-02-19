// @ts-nocheck
/**
 * 提醒订单付款
 * http://yapi.bwyd.com/project/21/interface/api/3686
 **/

import request from "@/service/http.ts";

/**
 * OrderNoticePayParam :OrderNoticePayParam
 */
export class IReqapi3686 {
  /**
   * 订单号
   */
  orderNo?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi3686 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req3686Config = (data: IReqapi3686) => ({
  url: `/merchant/order/noticePay`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 提醒订单付款
 **/
export default function (data: IReqapi3686 = {}): Promise<IResapi3686["data"]> {
  return request(req3686Config(...arguments));
}
