// @ts-nocheck
/**
 * 获取商品拍卖信息
 * http://yapi.bwyd.com/project/21/interface/api/4580
 **/

import request from "@/service/http.ts";

export class IReqapi4580 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ProdAucInfoVo> :Result
 */
export class IResapi4580 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdAucInfoVo
   */
  data?: {
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
}

export const req4580Config = (data: IReqapi4580) => ({
  url: `/live/product/getAucInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品拍卖信息
 **/
export default function (data: IReqapi4580 = {}): Promise<IResapi4580["data"]> {
  return request(req4580Config(...arguments));
}
