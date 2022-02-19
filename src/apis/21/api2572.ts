// @ts-nocheck
/**
 * 退货单发货
 * http://yapi.bwyd.com/project/21/interface/api/2572
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnDeliveryParam :OrderReturnDeliveryParam
 */
export class IReqapi2572 {
  /**
   * 售后单号
   */
  uuid?: string;
  /**
   * 发货单号
   */
  deliveryNo?: string;
  /**
   * 物流公司
   */
  deliveryCompany?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2572 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2572Config = (data: IReqapi2572) => ({
  url: `/orderReturn/delivery`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 退货单发货
 **/
export default function (data: IReqapi2572 = {}): Promise<IResapi2572["data"]> {
  return request(req2572Config(...arguments));
}
