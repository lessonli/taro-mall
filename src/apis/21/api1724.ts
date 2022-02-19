// @ts-nocheck
/**
 * 取消支付，自动关闭订单
 **/

import request from "@/service/http.ts";

/**
 * OrderCloseParam :OrderCloseParam
 */
export class IReqapi1724 {
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
export class IResapi1724 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req1724Config = (data: IReqapi1724) => ({
  url: `/order/cancelPay`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1724 = {}): Promise<IResapi1724["data"]> {
  return request(req1724Config(...arguments));
}
