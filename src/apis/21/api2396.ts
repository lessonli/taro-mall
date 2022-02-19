// @ts-nocheck
/**
 * 分页查询用户竞拍商品
 * http://yapi.bwyd.com/project/21/interface/api/2396
 **/

import request from "@/service/http.ts";

export class IReqapi2396 {
  /**
   * 查询类型0：全部1:竟拍中2:已中拍
   */
  queryType?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<UserAuctionProdVo>> :Result
 */
export class IResapi2396 {
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
       * 当前用户竞拍信息 ,UserAuctionInfoVo
       */
      aucUser?: {
        /**
         * 当前用户最新出价
         */
        auctionPrice?: number;
        /**
         * 拍卖商品状态,用户竞拍状态，0:出局1:领先2:待支付3:已支付4:支付失败
         */
        auctionStatus?: number;
        /**
         * 中拍用户支付订单号
         */
        orderNo?: string;
      };
      /**
       * 当前用户中拍订单信息 ,UserAuctionOrderVo
       */
      aucOrder?: {
        /**
         * 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
         */
        status?: number;
        /**
         * 售后状态：0->无售后；1->售后中;2->售后结束
         */
        returnStatus?: number;
        /**
         * 支付超时截止时间
         */
        operateTimeout?: number;
        /**
         * 中拍订单号
         */
        orderNo?: string;
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
    }[];
  };
}

export const req2396Config = (data: IReqapi2396) => ({
  url: `/auction/products`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户竞拍商品
 **/
export default function (data: IReqapi2396 = {}): Promise<IResapi2396["data"]> {
  return request(req2396Config(...arguments));
}
