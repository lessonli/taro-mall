// @ts-nocheck
/**
 * 根据订单号获取订单详情
 **/

import request from "@/service/http.ts";

export class IReqapi3092 {}

/**
 * Result<OrderDetailVO> :Result
 */
export class IResapi3092 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderDetailVO
   */
  data?: {
    /**
     * 订单商品 ,OrderItemVO
     */
    orderItemVO?: {
      /**
       * 关联订单号
       */
      orderNo?: string;
      /**
       * 商品商户id
       */
      merchantId?: string;
      /**
       * 关联的商品id
       */
      productId?: string;
      /**
       * 分成比例，百分比
       */
      distPercent?: number;
      /**
       * 关联的商品图片
       */
      productPic?: string;
      /**
       * 关联的商品名
       */
      productName?: string;
      /**
       * 关联的商品品牌
       */
      productBrand?: string;
      /**
       * 商品单价
       */
      productPrice?: number;
      /**
       * 下单数量
       */
      productQuantity?: number;
      /**
       * 促销名称
       */
      promotionName?: string;
      /**
       * 促销分解金额
       */
      promotionAmount?: number;
      /**
       * 优惠券分解金额
       */
      couponAmount?: number;
      /**
       * 8,积分抵扣金额
       */
      integrationAmount?: number;
      /**
       * 优惠和抵扣之后的金额
       */
      realAmount?: number;
      /**
       * 可获得的积分
       */
      integration?: number;
      /**
       * 可获得的成长值
       */
      giftGrowth?: number;
      /**
       * 商品销售属性
       */
      productAttr?: string;
    };
    /**
     * 最新的物流信息 ,OrderExpressRecordDetailVO
     */
    latestExpressRecord?: {
      context?: string;
      /**
       * 条目时间
       */
      recordTime?: string;
      /**
       * 条目状态
       */
      status?: string;
      /**
       * 当前所在地区code
       */
      areaCode?: string;
      /**
       * 所在地区名
       */
      areaName?: string;
    };
    /**
     * 关联的发票 ,OrderReceiptVO
     */
    orderReceiptVO?: {
      /**
       * 订单编号
       */
      orderNo?: string;
      /**
       * 发票类型：0->不开发票；1->电子发票；2->纸质发票
       */
      type?: number;
      /**
       * 发票抬头
       */
      header?: string;
      /**
       * 发票内容
       */
      content?: string;
      /**
       * 收票人电话
       */
      receiverPhone?: string;
      /**
       * 收票人邮箱
       */
      receiverEmail?: string;
    };
    /**
     * 关联的地址 ,OrderAddressVO
     */
    orderAddressVO?: {
      /**
       * 类型，0为订单收货地址，1为退货地址
       */
      type?: number;
      /**
       * 订单编号
       */
      orderNo?: string;
      /**
       * 收货人姓名
       */
      receiverName?: string;
      /**
       * 收货人电话
       */
      receiverPhone?: string;
      /**
       * 收货人邮编¬
       */
      receiverPostCode?: string;
      /**
       * 省份直辖市
       */
      receiverProvince?: string;
      /**
       * 城市
       */
      receiverCity?: string;
      /**
       * 区
       */
      receiverDistrict?: string;
      /**
       * 详细地址
       */
      receiverAddress?: string;
    };
    /**
     * 订单状态明细，文字形式展示
     */
    statusDetail?: string;
    /**
     * 订单售后状态明细，文字形式展示
     */
    returnStatusDetail?: string;
    /**
     * 订单编号
     */
    uuid?: string;
    /**
     * 订单类型：0->正常订单；1->拍卖订单
     */
    orderType?: number;
    /**
     * 用户表uuid
     */
    userId?: string;
    /**
     * 优惠券表uuid
     */
    couponId?: string;
    /**
     * 商户表uuid
     */
    merchantId?: string;
    /**
     * 分销商户表uuid
     */
    distMerchantId?: string;
    /**
     * 订单总金额
     */
    totalAmount?: number;
    /**
     * 分销金额
     */
    distAmount?: number;
    /**
     * 实际支付金额
     */
    payAmount?: number;
    /**
     * 运费金额
     */
    freightAmount?: number;
    /**
     * 促销优化金额（促销价、满减、阶梯价）
     */
    promotionAmount?: number;
    /**
     * 积分抵扣金额
     */
    integrationAmount?: number;
    /**
     * 优惠券抵扣金额
     */
    couponAmount?: number;
    /**
     * 管理员后台调整订单使用的折扣金额
     */
    discountAmount?: number;
    /**
     * 支付方式：0->未支付；1->支付宝；2->微信
     */
    payType?: number;
    /**
     * 订单来源：0->h5订单；1->app订单，2->小程序订单,3->pc订单
     */
    sourceType?: number;
    /**
     * 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
     */
    status?: number;
    /**
     * 下单时使用的积分
     */
    useIntegration?: number;
    /**
     * 发票类型：0->不开发票；1->电子发票；2->纸质发票
     */
    receiptType?: number;
    /**
     * 订单备注
     */
    note?: string;
    /**
     * 售后状态：0->无售后；1->售后中;2->售后结束
     */
    returnStatus?: number;
    /**
     * 订单关闭原因
     */
    closeReason?: number;
    /**
     * 支付时间
     */
    paymentTime?: string;
    /**
     * 发货时间
     */
    deliveryTime?: string;
    /**
     * 确认收货时间
     */
    receiveTime?: string;
    /**
     * 评价时间
     */
    commentTime?: string;
    /**
     * 订单下单时间
     */
    createTime?: string;
    /**
     * 操作超时时间
     */
    operateTimeout?: string;
  };
}

export const req3092Config = (orderNo, data: IReqapi3092) => ({
  url: `/order/detail/${orderNo}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  orderNo,
  data: IReqapi3092 = {}
): Promise<IResapi3092["data"]> {
  return request(req3092Config(...arguments));
}
