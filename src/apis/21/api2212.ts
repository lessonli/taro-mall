// @ts-nocheck
/**
 * 创建PC专用的支付的参数
 **/

import request from "@/service/http.ts";

/**
 * OrderPayParamCreateParam :OrderPayParamCreateParam
 */
export class IReqapi2212 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 选择支付方式,0->未支付；1->微信2->支付宝,3->余额,目前仅支持微信
   */
  payType?: number;
  /**
   * 来源类型
   */
  sourceType?: string;
}

/**
 * Result<OrderPayResponse> :Result
 */
export class IResapi2212 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderPayResponse
   */
  data?: {
    /**
     * 订单id
     */
    orderNo?: string;
    /**
     * 支付状态，0为待支付，1为已支付成功
     */
    payStatus?: number;
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

export const req2212Config = (data: IReqapi2212) => ({
  url: `/order/pc/rePay`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2212 = {}): Promise<IResapi2212["data"]> {
  return request(req2212Config(...arguments));
}
