// @ts-nocheck
/**
 * 根据退货单号获取物流信息
 * http://yapi.bwyd.com/project/21/interface/api/2548
 **/

import request from "@/service/http.ts";

export class IReqapi2548 {
  /**
   * 退货单号(String)
   */
  orderReturnNo?: string | number;
}

/**
 * Result<OrderExpressRecordVO> :Result
 */
export class IResapi2548 {
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
     * 快递单的总状态描述
     */
    statusDescribe?: string;
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

export const req2548Config = (data: IReqapi2548) => ({
  url: `/merchant/orderReturn/listExpress`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据退货单号获取物流信息
 **/
export default function (data: IReqapi2548 = {}): Promise<IResapi2548["data"]> {
  return request(req2548Config(...arguments));
}
