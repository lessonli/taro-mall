// @ts-nocheck
/**
 * 查询用户资金流水
 * http://yapi.bwyd.com/project/21/interface/api/2284
 **/

import request from "@/service/http.ts";

export class IReqapi2284 {
  /**
   * 用户编号
   */
  userNo?: string | number;
  /**
   * 交易类型：1-充值2-订单支付12-订单退款,@seecom.bwyd.trade.enums.TradeType
   */
  tradeType?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<UserTradeStreamVO>> :Result
 */
export class IResapi2284 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 流水编号
       */
      streamNo?: string;
      /**
       * 用户编号
       */
      userNo?: string;
      /**
       * 流水类型：1-充值2-订单下单3-拍卖保证金,@seecom.bwyd.trade.enums.TradeType
       */
      tradeType?: number;
      /**
       * 交易金额（分）
       */
      tradeAmount?: number;
      /**
       * 金额符号：1-正-1-负,@seecom.bwyd.trade.enums.SignType
       */
      amountSign?: number;
      /**
       * 订单编号（不同交易类型有不同的含义）
       */
      orderNo?: string;
      /**
       * 源头账户类型：1-余额2-三方支付,@seecom.bwyd.trade.enums.PaySourceType
       */
      sourceType?: number;
    }[];
  };
}

export const req2284Config = (data: IReqapi2284) => ({
  url: `/user/capital/stream`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询用户资金流水
 **/
export default function (data: IReqapi2284 = {}): Promise<IResapi2284["data"]> {
  return request(req2284Config(...arguments));
}
