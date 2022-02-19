// @ts-nocheck
/**
 * 用户充值
 * http://yapi.bwyd.com/project/21/interface/api/2516
 **/

import request from "@/service/http.ts";

/**
 * UserRechargeParam :UserRechargeParam
 */
export class IReqapi2516 {
  /**
   * 充值金额（分）
   */
  rechargeAmount?: number;
}

/**
 * Result<TotalPayResponse> :Result
 */
export class IResapi2516 {
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

export const req2516Config = (data: IReqapi2516) => ({
  url: `/user/capital/recharge`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户充值
 **/
export default function (data: IReqapi2516 = {}): Promise<IResapi2516["data"]> {
  return request(req2516Config(...arguments));
}
