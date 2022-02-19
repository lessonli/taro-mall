// @ts-nocheck
/**
 * 使用微信重新支付订单
 * http://yapi.bwyd.com/project/21/interface/api/2652
 **/

import request from "@/service/http.ts";

/**
 * OrderPayParamCreateParam :OrderPayParamCreateParam
 */
export class IReqapi2652 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 选择支付方式,0->未支付；1->微信2->支付宝,3->余额,目前仅支持微信
   */
  payType?: number;
  /**
   * 余额支付的密码
   */
  payPassword?: string;
  /**
   * 来源类型
   */
  sourceType?: string;
}

/**
 * Result<OrderWechatPayCreateVo> :Result
 */
export class IResapi2652 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderWechatPayCreateVo
   */
  data?: {
    /**
     * 订单id
     */
    orderNo?: string;
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

export const req2652Config = (data: IReqapi2652) => ({
  url: `/order/rePayWithWechat`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 使用微信重新支付订单
 **/
export default function (data: IReqapi2652 = {}): Promise<IResapi2652["data"]> {
  return request(req2652Config(...arguments));
}
