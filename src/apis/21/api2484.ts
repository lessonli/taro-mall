// @ts-nocheck
/**
 * 查询商户资金流水
 * http://yapi.bwyd.com/project/21/interface/api/2484
 **/

import request from "@/service/http.ts";

export class IReqapi2484 {
  /**
   * 商户编号
   */
  merchantNo?: string | number;
  /**
   * 资金账号类型：1-货款2-佣金,@seeMerchantCapitalType
   */
  accountType?: string | number;
  /**
   * 交易类型：,@seecom.bwyd.trade.enums.TradeType
   */
  tradeType?: string | number;
  /**
   * 资金符号：1-正（收入）-1-负（支出）,@seecom.bwyd.trade.enums.SignType
   */
  amountSign?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<MerchantCapitalStreamVO>> :Result
 */
export class IResapi2484 {
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
       * 商户编号
       */
      merchantNo?: string;
      /**
       * 流水类型：1-充值2-订单下单3-拍卖保证金,,@seecom.bwyd.trade.enums.TradeType
       */
      tradeType?: number;
      /**
       * 交易金额（分）
       */
      tradeAmount?: number;
      /**
       * 资金符号：1-正（收入）-1-负（支出）,@seecom.bwyd.trade.enums.SignType
       */
      amountSign?: number;
      /**
       * 订单编号（不同交易类型有不同的含义）
       */
      orderNo?: string;
      /**
       * 交易状态：1-待入账2-已入账
       */
      tradeStatus?: number;
      /**
       * 服务费
       */
      serviceFee?: number;
      /**
       * 实际入账金额（分）
       */
      actualAmount?: number;
    }[];
  };
}

export const req2484Config = (data: IReqapi2484) => ({
  url: `/merchant/capital/stream`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询商户资金流水
 **/
export default function (data: IReqapi2484 = {}): Promise<IResapi2484["data"]> {
  return request(req2484Config(...arguments));
}
