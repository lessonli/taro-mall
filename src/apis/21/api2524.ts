// @ts-nocheck
/**
 * 获取商品详情
 * http://yapi.bwyd.com/project/21/interface/api/2524
 **/

import request from "@/service/http.ts";

export class IReqapi2524 {
  /**
   * 商品id
   */
  uuid?: string | number;
  /**
   * 用户id(接口传参无效)
   */
  userId?: string | number;
  /**
   * 活动id
   */
  activityId?: string | number;
}

/**
 * Result<ProductInfoVo> :Result
 */
export class IResapi2524 {
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
}

export const req2524Config = (data: IReqapi2524) => ({
  url: `/product/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品详情
 **/
export default function (data: IReqapi2524 = {}): Promise<IResapi2524["data"]> {
  return request(req2524Config(...arguments));
}
