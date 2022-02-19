// @ts-nocheck
/**
 * 用户开店充值
 * http://yapi.bwyd.com/project/21/interface/api/3386
 **/

import request from "@/service/http.ts";

export class IReqapi3386 {}

/**
 * Result<TotalPayVo> :Result
 */
export class IResapi3386 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * TotalPayVo
   */
  data?: {
    /**
     * h5支付使用的参数 ,H5PayVo
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
     * app支付使用的参数 ,AppPayVo
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
     * 小程序支付使用的参数 ,MPPayVo
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
     * pc页面支付使用的参数 ,NativePayVo
     */
    pcPay?: {
      payNo?: string;
      codeUrl?: string;
    };
  };
}

export const req3386Config = (data: IReqapi3386) => ({
  url: `/merchant/open/shop/recharge`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户开店充值
 **/
export default function (data: IReqapi3386 = {}): Promise<IResapi3386["data"]> {
  return request(req3386Config(...arguments));
}
