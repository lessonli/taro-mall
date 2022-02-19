// @ts-nocheck
/**
 * 获取商品拍卖信息
 **/

import request from "@/service/http.ts";

export class IReqapi3062 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ProdAuctionInfoVo> :Result
 */
export class IResapi3062 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdAuctionInfoVo
   */
  data?: {
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
}

export const req3062Config = (prodId, data: IReqapi3062) => ({
  url: `/auction/detail/${prodId}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  prodId,
  data: IReqapi3062 = {}
): Promise<IResapi3062["data"]> {
  return request(req3062Config(...arguments));
}
