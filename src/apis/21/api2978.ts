// @ts-nocheck
/**
 * 用户缴纳保证金
 * http://yapi.bwyd.com/project/21/interface/api/2978
 **/

import request from "@/service/http.ts";

/**
 * AucMarginPayReq :AucMarginPayReq
 */
export class IReqapi2978 {
  /**
   * 商品id
   */
  productId?: string;
  /**
   * 支付方式,0->未支付；1->微信2->支付宝,3->余额,目前仅支持微信
   */
  payType?: number;
}

/**
 * Result<TotalPayResponse> :Result
 */
export class IResapi2978 {
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

export const req2978Config = (data: IReqapi2978) => ({
  url: `/margin/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户缴纳保证金
 **/
export default function (data: IReqapi2978 = {}): Promise<IResapi2978["data"]> {
  return request(req2978Config(...arguments));
}
