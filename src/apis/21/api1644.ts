// @ts-nocheck
/**
 * 获取商品详情
 **/

import request from "@/service/http.ts";

export class IReqapi1644 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ProductInfoVo> :Result
 */
export class IResapi1644 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProductInfoVo
   */
  data?: {
    /**
     * 商品库存
     */
    stock?: number;
    /**
     * 商品相册,限制为5张，以逗号分割
     */
    albumPics?: string;
    /**
     * 移动端商品详情内容
     */
    mobileHtml?: string;
    /**
     * 商品分类
     */
    categoryId?: number;
    /**
     * 商品竞拍配置 ,ProductAuctionVo
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
       * 竞拍开始时间
       */
      startTime?: string;
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
     * 商品评论统计 ,CommentStatisticVo
     */
    comments?: {
      /**
       * 总评论数
       */
      totalNum?: number;
      /**
       * 好评率
       */
      goodRate?: number;
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
     * 商品类型0:一口价商品1:拍卖器,com.bwyd.product.enums.ProductType
     */
    productType?: number;
    /**
     * 商户id
     */
    merchantId?: string;
  };
}

export const req1644Config = (data: IReqapi1644) => ({
  url: `/product/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1644 = {}): Promise<IResapi1644["data"]> {
  return request(req1644Config(...arguments));
}
