// @ts-nocheck
/**
 * 订单预览
 * http://yapi.bwyd.com/project/21/interface/api/2140
 **/

import request from "@/service/http.ts";

/**
 * OrderPreviewParam :OrderPreviewParam
 */
export class IReqapi2140 {
  /**
   * 活动id
   */
  activityId?: string;
  /**
   * 优惠券id
   */
  couponId?: string;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 关联的商品id
   */
  productId?: string;
  /**
   * 使用红包金额
   */
  redPacketAmount?: number;
  /**
   * 下单数量
   */
  productQuantity?: number;
  /**
   * 终端类型,前端不需要传
   */
  terminalType?: string;
}

/**
 * Result<OrderPreviewVo> :Result
 */
export class IResapi2140 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderPreviewVo
   */
  data?: {
    /**
     * 用户默认地址 ,UserAddressVo
     */
    address?: {
      /**
       * 省份
       */
      province?: string;
      /**
       * 城市
       */
      city?: string;
      /**
       * 区域
       */
      district?: string;
      /**
       * 详细地址
       */
      detailAddress?: string;
      /**
       * 邮编
       */
      postCode?: string;
      /**
       * 手机号
       */
      mobile?: string;
      /**
       * 收件人姓名
       */
      name?: string;
      /**
       * 是否默认地址
       */
      isDefault?: boolean;
      /**
       * 地址编码
       */
      addressNo?: string;
    };
    /**
     * 商品信息 ,ProductInfoVo
     */
    productInfo?: {
      /**
       * 商品库存
       */
      stock?: number;
      /**
       * 商品分类Id
       */
      categoryId?: number;
      /**
       * 商品销量
       */
      totalSales?: number;
      /**
       * 商品相册,限制为5张，以逗号分割
       */
      albumPics?: string;
      /**
       * 移动端商品详情内容
       */
      mobileHtml?: string;
      /**
       * 视频链接
       */
      videoLinks?: string;
      /**
       * 是否归属自己商品
       */
      ownState?: number;
      /**
       * 商品收藏状态0:未收藏1:已收藏
       */
      collectState?: number;
      /**
       * 上下架状态
       */
      publishStatus?: number;
      /**
       * 分享分佣比例
       */
      sDistPercent?: number;
      /**
       * 商品活动信息 ,ProdActivityVo
       */
      actInfo?: {
        /**
         * 单次限购数量,0或空不限购
         */
        perLimit?: number;
        /**
         * 活动价格
         */
        actPrice?: number;
      };
      /**
       * 商品主键id
       */
      uuid?: string;
      /**
       * 商品名称
       */
      name?: string;
      /**
       * 商品封面
       */
      icon?: string;
      /**
       * 商品价格
       */
      price?: number;
      /**
       * 运费
       */
      freightPrice?: number;
      /**
       * 以逗号分割的产品服务
       */
      serviceIds?: string;
      /**
       * 商品原价
       */
      originalPrice?: number;
      /**
       * 分佣比例
       */
      distPercent?: number;
      /**
       * 商品类型0:一口价商品1:拍卖品,com.bwyd.product.enums.ProductType
       */
      productType?: number;
      /**
       * 是否店铺推荐0:否1:是
       */
      shopRecStatus?: number;
      /**
       * 业务来源0:普通1:直播
       */
      bizSource?: number;
      /**
       * 商户id
       */
      merchantId?: string;
    };
    /**
     * 商铺名称
     */
    merchantName?: string;
    /**
     * 下单数量
     */
    productQuantity?: number;
    /**
     * 用户余额
     */
    userAmount?: number;
    /**
     * 用户红包余额
     */
    userRedPacketAmount?: number;
    /**
     * 最多可用红包
     */
    maxRedPacketAmount?: number;
    /**
     * 使用的优惠券的id
     */
    couponId?: string;
    /**
     * 商品总价
     */
    productAmount?: number;
    /**
     * 运费金额
     */
    freightAmount?: number;
    /**
     * 总价
     */
    totalAmount?: number;
    /**
     * 折扣列表 ,OrderDiscountVo
     */
    discountList?: {
      /**
       * 折扣对象类型,0:人工折扣，1:活动折扣,2:优惠券折扣,3:红包抵扣
       */
      objType?: number;
      /**
       * 折扣对象id
       */
      objId?: string;
      /**
       * 折扣对象名称
       */
      objName?: string;
      /**
       * 折扣金额
       */
      discountAmount?: number;
    }[];
    /**
     * 需要支付的金额
     */
    payAmount?: number;
  };
}

export const req2140Config = (data: IReqapi2140) => ({
  url: `/order/preview`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 订单预览
 **/
export default function (data: IReqapi2140 = {}): Promise<IResapi2140["data"]> {
  return request(req2140Config(...arguments));
}
