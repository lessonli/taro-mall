// @ts-nocheck
/**
 * 从app下订单
 **/

import request from "@/service/http.ts";

/**
 * OrderCreate :OrderCreate
 */
export class IReqapi2156 {
  orderNo?: string;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 分享渠道
   */
  shareChannel?: string;
  /**
   * 关联信息，
   */
  relInfo?: string;
  /**
   * 来源类型0->"h5"1->"app";2->"小程序";3->"pc",4->"其他"
   */
  sourceType?: number;
  /**
   * 支付方式,0->未支付,1->微信，2->支付宝,3->余额
   */
  payType?: number;
  /**
   * 优惠id
   */
  couponId?: string;
  /**
   * 订单备注
   */
  note?: string;
  /**
   * 关联地址id
   */
  addressNo?: string;
  /**
   * 关联的商品id
   */
  productId?: string;
  /**
   * 下单数量
   */
  productQuantity?: number;
  /**
   * 发票类型：0->不开发票；1->电子发票；2->纸质发票
   */
  billType?: number;
  /**
   * 发票抬头
   */
  billHeader?: string;
  /**
   * 发票内容
   */
  billContent?: string;
  /**
   * 收票人电话
   */
  billReceiverPhone?: string;
  /**
   * 收票人邮箱
   */
  billReceiverEmail?: string;
}

/**
 * Result<OrderPayResponse> :Result
 */
export class IResapi2156 {
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

export const req2156Config = (data: IReqapi2156) => ({
  url: `/order/app/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2156 = {}): Promise<IResapi2156["data"]> {
  return request(req2156Config(...arguments));
}
