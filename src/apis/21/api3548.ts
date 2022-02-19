// @ts-nocheck
/**
 * 店铺保证金充值
 * http://yapi.bwyd.com/project/21/interface/api/3548
 **/

import request from "@/service/http.ts";

/**
 * ShopMarginRechargeParam :ShopMarginRechargeParam
 */
export class IReqapi3548 {
  /**
   * 充值金额
   */
  rechargeAmount?: number;
}

/**
 * Result<TotalPayResponse> :Result
 */
export class IResapi3548 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * TotalPayResponse
   */
  data?: {
    /**
     * h5支付使用的参数 ,H5PayResponse
     */
    h5Pay?: {
      /**
       * 付款单编号
       */
      payNo?: string;
      /**
       * 支付链接
       */
      h5Url?: string;
    };
    /**
     * app支付使用的参数 ,AppPayResponse
     */
    appPay?: {
      payNo?: string;
      sign?: string;
      prepayId?: string;
      partnerId?: string;
      appId?: string;
      packageValue?: string;
      timeStamp?: string;
      nonceStr?: string;
    };
    /**
     * 小程序支付使用的参数 ,MPPayResponse
     */
    mpPay?: {
      payNo?: string;
      appId?: string;
      timeStamp?: string;
      nonceStr?: string;
      packageValue?: string;
      signType?: string;
      paySign?: string;
    };
    /**
     * pc页面支付使用的参数 ,NativePayResponse
     */
    pcPay?: {
      payNo?: string;
      codeUrl?: string;
    };
  };
}

export const req3548Config = (data: IReqapi3548) => ({
  url: `/merchant/capital/shop/margin/recharge`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 店铺保证金充值
 **/
export default function (data: IReqapi3548 = {}): Promise<IResapi3548["data"]> {
  return request(req3548Config(...arguments));
}
