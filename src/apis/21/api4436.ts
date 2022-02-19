// @ts-nocheck
/**
 * 根据订单号获取基本物流信息
 * http://yapi.bwyd.com/project/21/interface/api/4436
 **/

import request from "@/service/http.ts";

export class IReqapi4436 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<BaseExpressRecordVo> :Result
 */
export class IResapi4436 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * BaseExpressRecordVo
   */
  data?: {
    /**
     * 快递公司
     */
    company?: string;
    /**
     * 快递单号
     */
    number?: string;
  };
}

export const req4436Config = (data: IReqapi4436) => ({
  url: `/order/getExpressInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号获取基本物流信息
 **/
export default function (data: IReqapi4436 = {}): Promise<IResapi4436["data"]> {
  return request(req4436Config(...arguments));
}
