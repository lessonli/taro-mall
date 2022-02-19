// @ts-nocheck
/**
 * 根据订单号获取订单物流信息
 **/

import request from "@/service/http.ts";

export class IReqapi3098 {}

/**
 * Result<OrderExpressRecordVO> :Result
 */
export class IResapi3098 {
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

export const req3098Config = (orderNo, data: IReqapi3098) => ({
  url: `/order/listExpress/${orderNo}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  orderNo,
  data: IReqapi3098 = {}
): Promise<IResapi3098["data"]> {
  return request(req3098Config(...arguments));
}
