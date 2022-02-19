// @ts-nocheck
/**
 * 修改商品信息
 * http://yapi.bwyd.com/project/21/interface/api/1852
 **/

import request from "@/service/http.ts";

/**
 * ProductUpdateVo :ProductUpdateVo
 */
export class IReqapi1852 {
  /**
   * 请求幂等键id
   */
  requestId?: string;
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
   * 视频链接
   */
  videoLinks?: string;
  /**
   * 移动端商品详情内容
   */
  mobileHtml?: string;
  /**
   * 商品竞拍配置 ,ProdAucUpdateVo
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
     * 竞拍结束时间
     */
    endTime?: string;
    /**
     * 竞拍时间，单位:秒,竞拍结束时间二选一
     */
    aucTime?: number;
    /**
     * 是否开启延时竞拍0:不开启1:开启
     */
    delayState?: number;
    /**
     * 延时竞拍时间，单位:秒
     */
    delayTime?: number;
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
}

/**
 * Result<Integer> :Result
 */
export class IResapi1852 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req1852Config = (data: IReqapi1852) => ({
  url: `/product/update`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商品信息
 **/
export default function (data: IReqapi1852 = {}): Promise<IResapi1852["data"]> {
  return request(req1852Config(...arguments));
}
