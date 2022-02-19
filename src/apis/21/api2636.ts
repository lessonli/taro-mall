// @ts-nocheck
/**
 * 下订单并直接返回微信支付的参数
 * http://yapi.bwyd.com/project/21/interface/api/2636
 **/

import request from "@/service/http.ts";

/**
 * OrderCreate :OrderCreate
 */
export class IReqapi2636 {
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
   * 活动id
   */
  activityId?: string;
  /**
   * 优惠id
   */
  couponId?: string;
  /**
   * 关联信息，
   */
  relInfo?: string;
  /**
   * 来源类型0->正常下单,1->直播下单
   */
  bizSource?: number;
  /**
   * 来源类型0->"h5"1->"app";2->"小程序";3->"pc",4->"其他"
   */
  sourceType?: number;
  /**
   * 支付方式,0->未支付,1->微信，2->支付宝,3->余额
   */
  payType?: number;
  /**
   * 余额支付的密码
   */
  payPassword?: string;
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
   * 红包抵扣金额
   */
  redPacketAmount?: number;
  /**
   * 商品价格,,拍卖品设置价格用
   */
  productPrice?: number;
  /**
   * 下单数量
   */
  productQuantity?: number;
  /**
   * 分销比例,%
   */
  distPercent?: number;
  /**
   * 发票类型：0->不开发票；1->电子发票；2->纸质发票
   */
  ReceiptType?: number;
  /**
   * 发票抬头
   */
  receiptHeader?: string;
  /**
   * 发票内容
   */
  receiptContent?: string;
  /**
   * 收票人电话
   */
  receiptReceiverPhone?: string;
  /**
   * 收票人邮箱
   */
  receiptReceiverEmail?: string;
  /**
   * 业务类型，0->商品，1->补差价
   */
  bizType?: number;
  /**
   * 业务子来源：0->自主下单；1->商家派单
   */
  bizSubSource?: number;
  /**
   * 终端类型,前端不需要传
   */
  terminalType?: string;
}

/**
 * Result<OrderWechatPayCreateVo> :Result
 */
export class IResapi2636 {
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

export const req2636Config = (data: IReqapi2636) => ({
  url: `/order/createWithWechat`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 下订单并直接返回微信支付的参数
 **/
export default function (data: IReqapi2636 = {}): Promise<IResapi2636["data"]> {
  return request(req2636Config(...arguments));
}
