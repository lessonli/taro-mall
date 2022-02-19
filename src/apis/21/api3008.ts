// @ts-nocheck
/**
 * 根据订单状态统计
 * http://yapi.bwyd.com/project/21/interface/api/3008
 **/

import request from "@/service/http.ts";

export class IReqapi3008 {}

/**
 * Result<OrderStatusCountVo> :Result
 */
export class IResapi3008 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderStatusCountVo
   */
  data?: {
    /**
     * 待付款订单数
     */
    pendingPayCount?: number;
    /**
     * 待发货订单数
     */
    pendingDeliveryCount?: number;
    /**
     * 已发货待收货订单数
     */
    deliveredCount?: number;
    /**
     * 已收货待评价订单数
     */
    receivedCount?: number;
    /**
     * 售后退款订单数
     */
    returnCount?: number;
    /**
     * 已关闭订单数
     */
    closedCount?: number;
    /**
     * 所有订单数
     */
    allCount?: number;
  };
}

export const req3008Config = (data: IReqapi3008) => ({
  url: `/order/countByStatus`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单状态统计
 **/
export default function (data: IReqapi3008 = {}): Promise<IResapi3008["data"]> {
  return request(req3008Config(...arguments));
}
