// @ts-nocheck
/**
 * 获取商品拍卖信息
 * http://yapi.bwyd.com/project/21/interface/api/2906
 **/

import request from "@/service/http.ts";

export class IReqapi2906 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ProdAucInfoVo> :Result
 */
export class IResapi2906 {
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

export const req2906Config = (data: IReqapi2906) => ({
  url: `/product/getAucInfo`,
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
export default function (data: IReqapi2906 = {}): Promise<IResapi2906["data"]> {
  return request(req2906Config(...arguments));
}
