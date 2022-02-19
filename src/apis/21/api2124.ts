// @ts-nocheck
/**
 * 商家商品管理列表
 * http://yapi.bwyd.com/project/21/interface/api/2124
 **/

import request from "@/service/http.ts";

export class IReqapi2124 {
  /**
   * 最后一条记录id,后台pageNo始终为1
   */
  lastId?: string | number;
  /**
   * 业务来源，非前端参数
   */
  bizSource?: string | number;
  /**
   * 商品上、下架状态
   */
  publishStatus?: string | number;
  /**
   * 商品竞拍状态,com.bwyd.product.enums.ProductAuctionStatus
   */
  auctionStatus?: string | number;
  /**
   * 商品类型一口价或竞拍品,com.bwyd.product.enums.ProductType
   */
  productType?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
  /**
   * 搜索关键词
   */
  keywords?: string | number;
}

/**
 * Result<PaginatedData<MerProdPageVo>> :Result
 */
export class IResapi2124 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
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
    }[];
  };
}

export const req2124Config = (data: IReqapi2124) => ({
  url: `/product/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家商品管理列表
 **/
export default function (data: IReqapi2124 = {}): Promise<IResapi2124["data"]> {
  return request(req2124Config(...arguments));
}
