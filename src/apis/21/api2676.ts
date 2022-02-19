// @ts-nocheck
/**
 * 取消订单
 * http://yapi.bwyd.com/project/21/interface/api/2676
 **/

import request from "@/service/http.ts";

/**
 * OrderCloseParam :OrderCloseParam
 */
export class IReqapi2676 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 关闭订单的原因
   */
  closeReason?: number;
  /**
   * 备注
   */
  note?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2676 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2676Config = (data: IReqapi2676) => ({
  url: `/order/cancel`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 取消订单
 **/
export default function (data: IReqapi2676 = {}): Promise<IResapi2676["data"]> {
  return request(req2676Config(...arguments));
}
