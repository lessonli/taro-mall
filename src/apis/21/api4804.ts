// @ts-nocheck
/**
 * 创建微信支付请求
 * http://yapi.bwyd.com/project/21/interface/api/4804
 **/

import request from "@/service/http.ts";

/**
 * BasePayParam :BasePayParam
 */
export class IReqapi4804 {
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 用户编号（前端不需要传，根据登录信息获取）
   */
  userNo?: string;
}

/**
 * Result<WxPayCreateVo> :Result
 */
export class IResapi4804 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * WxPayCreateVo
   */
  data?: {
    /**
     * 支付编号
     */
    payNo?: string;
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

export const req4804Config = (data: IReqapi4804) => ({
  url: `/payment/payWithWx`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 创建微信支付请求
 **/
export default function (data: IReqapi4804 = {}): Promise<IResapi4804["data"]> {
  return request(req4804Config(...arguments));
}
