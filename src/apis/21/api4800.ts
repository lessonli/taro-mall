// @ts-nocheck
/**
 * 根据订单号查询支付信息
 * http://yapi.bwyd.com/project/21/interface/api/4800
 **/

import request from "@/service/http.ts";

export class IReqapi4800 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<PaymentOrderVo> :Result
 */
export class IResapi4800 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaymentOrderVo
   */
  data?: {
    /**
     * 订单编号
     */
    orderNo?: string;
    /**
     * 支付状态：1-待支付2-支付成功6-余额已支付,,@seecom.bwyd.trade.enums.PayStatus
     */
    payStatus?: number;
    /**
     * 订单金额
     */
    tradeAmount?: number;
    /**
     * 余额支付金额
     */
    availablePayAmount?: number;
    /**
     * 三方支付金额
     */
    thirdPayAmount?: number;
  };
}

export const req4800Config = (data: IReqapi4800) => ({
  url: `/payment/get`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号查询支付信息
 **/
export default function (data: IReqapi4800 = {}): Promise<IResapi4800["data"]> {
  return request(req4800Config(...arguments));
}
