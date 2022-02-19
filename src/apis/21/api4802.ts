// @ts-nocheck
/**
 * 余额支付请求
 * http://yapi.bwyd.com/project/21/interface/api/4802
 **/

import request from "@/service/http.ts";

/**
 * AvailablePayParam :AvailablePayParam
 */
export class IReqapi4802 {
  /**
   * 支付密码
   */
  payPassword?: string;
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 用户编号（前端不需要传，根据登录信息获取）
   */
  userNo?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4802 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4802Config = (data: IReqapi4802) => ({
  url: `/payment/payWithAvailable`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 余额支付请求
 **/
export default function (data: IReqapi4802 = {}): Promise<IResapi4802["data"]> {
  return request(req4802Config(...arguments));
}
