// @ts-nocheck
/**
 * 用户缴纳保证金
 **/

import request from "@/service/http.ts";

/**
 * AucMarginPayReq :AucMarginPayReq
 */
export class IReqapi2918 {
  /**
   * 商品id
   */
  productId?: string;
  /**
   * 支付方式,0->未支付；1->微信2->支付宝,3->余额,目前仅支持微信
   */
  payType?: number;
  /**
   * 来源类型，0->h5;1->app;2->小程序;3->pc;
   */
  sourceType?: number;
}

/**
 * Result<TotalPayResponse> :Result
 */
export class IResapi2918 {
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
      mwebUrl?: string;
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

export const req2918Config = (data: IReqapi2918) => ({
  url: `/auction/margin`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2918 = {}): Promise<IResapi2918["data"]> {
  return request(req2918Config(...arguments));
}
