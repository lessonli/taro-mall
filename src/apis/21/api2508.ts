// @ts-nocheck
/**
 * 随机推荐商品
 * http://yapi.bwyd.com/project/21/interface/api/2508
 **/

import request from "@/service/http.ts";

export class IReqapi2508 {
  /**
   * 商户号
   */
  merchantId?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ProductSearchVo>> :Result
 */
export class IResapi2508 {
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

export const req2508Config = (data: IReqapi2508) => ({
  url: `/product/randomRec`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 随机推荐商品
 **/
export default function (data: IReqapi2508 = {}): Promise<IResapi2508["data"]> {
  return request(req2508Config(...arguments));
}
