// @ts-nocheck
/**
 * 支付成功的回调
 * http://yapi.bwyd.com/project/21/interface/api/2180
 **/

import request from "@/service/http.ts";

/**
 * OrderPayParam :OrderPayParam
 */
export class IReqapi2180 {
  /**
   * 订单号
   */
  orderNo?: string;
  payType?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2180 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2180Config = (data: IReqapi2180) => ({
  url: `/order/paid`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 支付成功的回调
 **/
export default function (data: IReqapi2180 = {}): Promise<IResapi2180["data"]> {
  return request(req2180Config(...arguments));
}
