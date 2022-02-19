// @ts-nocheck
/**
 * 获取当前置顶商品
 * http://yapi.bwyd.com/project/21/interface/api/4610
 **/

import request from "@/service/http.ts";

export class IReqapi4610 {
  /**
   * 直播间id
   */
  roomId?: string | number;
  /**
   * 直播记录id
   */
  recordId?: string | number;
}

/**
 * Result<ProdInfoLiveVo> :Result
 */
export class IResapi4610 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdInfoLiveVo
   */
  data?: {
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
     * 商品库存
     */
    stock?: number;
    /**
     * 商品类型0:一口价商品1:拍卖品,com.bwyd.product.enums.ProductType
     */
    productType?: number;
    /**
     * 上下架状态
     */
    publishStatus?: number;
    /**
     * 拍品信息 ,ProdLiveAucVo
     */
    aucInfo?: {
      /**
       * 加价幅度
       */
      markUp?: number;
      /**
       * 竞拍结束时间
       */
      endTime?: string;
      /**
       * 最新出价
       */
      lastAucPrice?: number;
      /**
       * 是否开启延时竞拍0:不开启1:开启
       */
      delayState?: number;
      /**
       * 出价次数
       */
      auctionNum?: number;
    };
  };
}

export const req4610Config = (data: IReqapi4610) => ({
  url: `/live/product/getTopInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取当前置顶商品
 **/
export default function (data: IReqapi4610 = {}): Promise<IResapi4610["data"]> {
  return request(req4610Config(...arguments));
}
