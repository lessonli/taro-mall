// @ts-nocheck
/**
 * 获取商品详情(卖家编辑)
 * http://yapi.bwyd.com/project/21/interface/api/3572
 **/

import request from "@/service/http.ts";

export class IReqapi3572 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<MerProdInfoVo> :Result
 */
export class IResapi3572 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerProdInfoVo
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
     * 商品销量
     */
    totalSales?: number;
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

export const req3572Config = (data: IReqapi3572) => ({
  url: `/product/getMerInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品详情(卖家编辑)
 **/
export default function (data: IReqapi3572 = {}): Promise<IResapi3572["data"]> {
  return request(req3572Config(...arguments));
}
