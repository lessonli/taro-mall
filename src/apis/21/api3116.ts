// @ts-nocheck
/**
 * 根据订单号获取订单物流信息
 **/

import request from "@/service/http.ts";

export class IReqapi3116 {}

/**
 * Result<OrderExpressRecordVO> :Result
 */
export class IResapi3116 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderExpressRecordVO
   */
  data?: {
    /**
     * 快递公司code
     */
    company?: string;
    /**
     * 快递单号
     */
    number?: string;
    /**
     * 快递单的总状态
     */
    status?: number;
    /**
     * 快递单明细 ,OrderExpressRecordDetailVO
     */
    detailList?: {
      context?: string;
      /**
       * 条目时间
       */
      recordTime?: string;
      /**
       * 条目状态
       */
      status?: string;
      /**
       * 当前所在地区code
       */
      areaCode?: string;
      /**
       * 所在地区名
       */
      areaName?: string;
    }[];
  };
}

export const req3116Config = (orderNo, data: IReqapi3116) => ({
  url: `/merchant/order/listExpress/${orderNo}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  orderNo,
  data: IReqapi3116 = {}
): Promise<IResapi3116["data"]> {
  return request(req3116Config(...arguments));
}
