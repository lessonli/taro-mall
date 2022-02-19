// @ts-nocheck
/**
 * 根据交易类型获取支付配置列表
 * http://yapi.bwyd.com/project/21/interface/api/4808
 **/

import request from "@/service/http.ts";

export class IReqapi4808 {
  /**
   * 交易类型：1-用户充值 2-支付订单 3-缴纳拍卖保证金 4-缴纳店铺保证金 9-充值开店 30-支付红包(Integer)
   */
  tradeType?: string | number;
}

/**
 * Result<List<PayConfigVo>> :Result
 */
export class IResapi4808 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PayConfigVo
   */
  data?: {
    /**
     * 交易类型：1-用户充值2-支付订单3-缴纳拍卖保证金4-缴纳店铺保证金9-充值开店30-支付红包,,@seecom.bwyd.trade.enums.TradeType
     */
    tradeType?: number;
    /**
     * 支付方式：1-微信2-余额21-微信组合支付,,@seecom.bwyd.trade.enums.PayType
     */
    payType?: number;
    /**
     * 是否支持支付：0-不支持1-支持
     */
    enablePay?: number;
    /**
     * 排序值：自然排序（从小到大排序）
     */
    sort?: number;
  }[];
}

export const req4808Config = (data: IReqapi4808) => ({
  url: `/payment/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据交易类型获取支付配置列表
 **/
export default function (data: IReqapi4808 = {}): Promise<IResapi4808["data"]> {
  return request(req4808Config(...arguments));
}
