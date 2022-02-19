// @ts-nocheck
/**
 * 分页查询用户收藏商品
 * http://yapi.bwyd.com/project/21/interface/api/2332
 **/

import request from "@/service/http.ts";

export class IReqapi2332 {
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ProductSearchVo>> :Result
 */
export class IResapi2332 {
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
       * 商品销量
       */
      totalSales?: number;
      /**
       * 商品分类配置分佣比例
       */
      catDistPercent?: number;
      /**
       * 分享分佣比例
       */
      sDistPercent?: number;
      /**
       * 当前用户竞拍信息 ,AuctionUserProdVo
       */
      aucUser?: {
        /**
         * 商品表uuid
         */
        productId?: string;
        /**
         * 拍卖商品状态,0:出局1:领先2:待支付3:已支付
         */
        auctionStatus?: number;
      };
      /**
       * 商品拍卖信息 ,ProdAuctionSearchVo
       */
      auction?: {
        /**
         * 起拍价
         */
        initPrice?: number;
        /**
         * 加价幅度
         */
        markUp?: number;
        /**
         * 保证金
         */
        margin?: number;
        /**
         * 0:竞拍中1:已截拍2:已流拍3:竞拍失败,com.bwyd.product.enums.ProductAuctionStatus
         */
        status?: number;
        /**
         * 竞拍结束时间
         */
        endTime?: string;
        /**
         * 出价次数
         */
        auctionNum?: number;
        /**
         * 最新出价
         */
        lastAucPrice?: number;
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
       * 商户id
       */
      merchantId?: string;
    }[];
  };
}

export const req2332Config = (data: IReqapi2332) => ({
  url: `/collect/products`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户收藏商品
 **/
export default function (data: IReqapi2332 = {}): Promise<IResapi2332["data"]> {
  return request(req2332Config(...arguments));
}
