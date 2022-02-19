// @ts-nocheck
/**
 * 下订单并直接使用余额支付
 * http://yapi.bwyd.com/project/21/interface/api/2644
 **/

import request from "@/service/http.ts";

/**
 * OrderCreate :OrderCreate
 */
export class IReqapi2644 {
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
 * Result<OrderBalancePayVo> :Result
 */
export class IResapi2644 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderBalancePayVo
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
  };
}

export const req2644Config = (data: IReqapi2644) => ({
  url: `/order/createWithBalance`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 下订单并直接使用余额支付
 **/
export default function (data: IReqapi2644 = {}): Promise<IResapi2644["data"]> {
  return request(req2644Config(...arguments));
}
