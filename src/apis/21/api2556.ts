// @ts-nocheck
/**
 * 根据订单号获取订单物流信息
 * http://yapi.bwyd.com/project/21/interface/api/2556
 **/

import request from "@/service/http.ts";

export class IReqapi2556 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<OrderExpressRecordVo> :Result
 */
export class IResapi2556 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderExpressRecordVo
   */
  data?: {
    uuid?: string;
    /**
     * 类型
     */
    type?: number;
    /**
     * 订单或退货单号
     */
    orderNo?: string;
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
     * 快递单的总状态描述
     */
    statusDescribe?: string;
    /**
     * 是否签收
     */
    signed?: boolean;
    /**
     * 签收时间
     */
    signedTime?: string;
    /**
     * 快递单明细 ,OrderExpressRecordDetailVo
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

export const req2556Config = (data: IReqapi2556) => ({
  url: `/order/listExpress`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号获取订单物流信息
 **/
export default function (data: IReqapi2556 = {}): Promise<IResapi2556["data"]> {
  return request(req2556Config(...arguments));
}
