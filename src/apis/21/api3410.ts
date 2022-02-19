// @ts-nocheck
/**
 * 根据广告位id查询绑定商品
 * http://yapi.bwyd.com/project/21/interface/api/3410
 **/

import request from "@/service/http.ts";

export class IReqapi3410 {
  /**
   * 广告位id
   */
  advertiseId?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ProductSearchVo>> :Result
 */
export class IResapi3410 {
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
       * 是否店铺推荐状态
       */
      shopRecStatus?: number;
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
       * 商品原价
       */
      originalPrice?: number;
      /**
       * 分佣比例
       */
      distPercent?: number;
      /**
       * 运费
       */
      freightPrice?: number;
      /**
       * 以逗号分割的产品服务
       */
      serviceIds?: string;
      /**
       * 商品类型0:一口价商品1:拍卖品,com.bwyd.product.enums.ProductType
       */
      productType?: number;
      /**
       * 上架状态：0->下架；1->上架
       */
      publishStatus?: number;
      /**
       * 商户id
       */
      merchantId?: string;
    }[];
  };
}

export const req3410Config = (data: IReqapi3410) => ({
  url: `/banner/products`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据广告位id查询绑定商品
 **/
export default function (data: IReqapi3410 = {}): Promise<IResapi3410["data"]> {
  return request(req3410Config(...arguments));
}
