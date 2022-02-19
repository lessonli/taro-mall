// @ts-nocheck
/**
 * 商品搜索功能
 * http://yapi.bwyd.com/project/21/interface/api/3404
 **/

import request from "@/service/http.ts";

/**
 * ProductSearchParam :ProductSearchParam
 */
export class IReqapi3404 {
  /**
   * 搜索关键词
   */
  keywords?: string;
  /**
   * 商品分类id
   */
  categoryId?: number;
  /**
   * 商户号
   */
  merchantId?: string;
  /**
   * 商品类型一口价或竞拍品,com.bwyd.product.enums.ProductType
   */
  productType?: number;
  pageNo?: number;
  pageSize?: number;
  /**
   * PageOrderItem
   */
  orderItems?: {
    column?: string;
    asc?: boolean;
  }[];
}

/**
 * Result<ProdLiveSearchVo> :Result
 */
export class IResapi3404 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdLiveSearchVo
   */
  data?: {
    /**
     * 直播间信息，首页瀑布流使用 ,LivingRoomBaseVo
     */
    live?: {
      /**
       * 直播间id
       */
      roomId?: string;
      /**
       * 本场直播的id
       */
      recordId?: string;
      /**
       * 直播间名称
       */
      roomName?: string;
      /**
       * 直播间头像
       */
      headImg?: string;
      /**
       * 本场直播标题
       */
      title?: string;
      /**
       * 本场直播封面图
       */
      coverImg?: string;
      /**
       * 本场直播海报图
       */
      posterImg?: string;
      /**
       * 直播间状态,1为预展中,2为直播中
       */
      status?: number;
      /**
       * 直播开始时间
       */
      startTime?: string;
      /**
       * 当前观看人次
       */
      viewCount?: number;
    };
    /**
     * 商品库存
     */
    stock?: number;
    /**
     * 商品发布时间
     */
    publishTime?: string;
    /**
     * 商品上下架状态
     */
    publishStatus?: number;
    /**
     * 商品销量
     */
    totalSales?: number;
    /**
     * 分享分佣比例
     */
    sDistPercent?: number;
    /**
     * 商品拍卖信息 ,ProdAucSearchVo
     */
    auction?: {
      /**
       * 当前用户出价是否领先
       */
      ahead?: boolean;
      /**
       * 商品id
       */
      productId?: string;
      /**
       * 加价幅度
       */
      markUp?: number;
      /**
       * 保证金
       */
      margin?: number;
      /**
       * 竞拍开始时间
       */
      startTime?: string;
      /**
       * 竞拍结束时间
       */
      endTime?: string;
      /**
       * 0:竞拍中1:已截拍2:已流拍3:竞拍失败,ProductAuctionStatus
       */
      status?: number;
      /**
       * 起拍价
       */
      initPrice?: number;
      /**
       * 出价次数
       */
      auctionNum?: number;
      /**
       * 是否开启拍卖延时
       */
      delayState?: number;
      /**
       * 最新出价
       */
      lastAucPrice?: number;
      /**
       * 最新出价用户
       */
      lastAucUser?: string;
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
}

export const req3404Config = (data: IReqapi3404) => ({
  url: `/product/search`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品搜索功能
 **/
export default function (data: IReqapi3404 = {}): Promise<IResapi3404["data"]> {
  return request(req3404Config(...arguments));
}
