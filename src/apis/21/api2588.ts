// @ts-nocheck
/**
 * 根据退货单获取物流信息
 * http://yapi.bwyd.com/project/21/interface/api/2588
 **/

import request from "@/service/http.ts";

export class IReqapi2588 {
  /**
   * 退货单号(String)
   */
  orderReturnNo?: string | number;
}

/**
 * Result<OrderExpressRecordVo> :Result
 */
export class IResapi2588 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderExpressRecordVo
   */
  data?: {
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

export const req2588Config = (data: IReqapi2588) => ({
  url: `/orderReturn/listExpress`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据退货单获取物流信息
 **/
export default function (data: IReqapi2588 = {}): Promise<IResapi2588["data"]> {
  return request(req2588Config(...arguments));
}
