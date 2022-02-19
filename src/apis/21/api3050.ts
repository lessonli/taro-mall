// @ts-nocheck
/**
 * 获取商品详情
 **/

import request from "@/service/http.ts";

export class IReqapi3050 {}

/**
 * Result<ProductInfoVo> :Result
 */
export class IResapi3050 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProductInfoVo
   */
  data?: {
    /**
     * 商品分类Id
     */
    categoryId?: number;
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
     * 视频链接
     */
    videoLinks?: string;
    /**
     * 是否归属自己商品
     */
    ownState?: number;
    /**
     * 是否店铺推荐0:否1:是
     */
    shopRecStatus?: number;
    /**
     * 商品收藏状态0:未收藏1:已收藏
     */
    collectState?: number;
    /**
     * 商品竞拍配置 ,ProdAuctionInfoVo
     */
    auction?: {
      /**
       * 竞拍开始时间
       */
      startTime?: string;
      /**
       * 是否开启延时竞拍0:不开启1:开启
       */
      delayState?: number;
      /**
       * 最新出价用户
       */
      lastAucUser?: string;
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
  };
}

export const req3050Config = (uuid, data: IReqapi3050) => ({
  url: `/product/detail/${uuid}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  uuid,
  data: IReqapi3050 = {}
): Promise<IResapi3050["data"]> {
  return request(req3050Config(...arguments));
}
