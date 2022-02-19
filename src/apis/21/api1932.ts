// @ts-nocheck
/**
 * 商家立即发货接口
 * http://yapi.bwyd.com/project/21/interface/api/1932
 **/

import request from "@/service/http.ts";

/**
 * OrderDeliveryParam :OrderDeliveryParam
 */
export class IReqapi1932 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 发货单号
   */
  deliveryNo?: string;
  /**
   * 物流公司
   */
  deliveryCompany?: string;
  /**
   * 物流公司
   */
  deliveryCompanyCode?: string;
  /**
   * 是否已订阅
   */
  pollStatus?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi1932 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req1932Config = (data: IReqapi1932) => ({
  url: `/merchant/order/delivery`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家立即发货接口
 **/
export default function (data: IReqapi1932 = {}): Promise<IResapi1932["data"]> {
  return request(req1932Config(...arguments));
}
