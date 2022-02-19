// @ts-nocheck
/**
 * 竞拍出价
 * http://yapi.bwyd.com/project/21/interface/api/4578
 **/

import request from "@/service/http.ts";

export class IReqapi4578 {
  /**
   * 商品id
   */
  productId?: string | number;
  /**
   * 出价金额（竞拍时需要）
   */
  auctionPrice?: string | number;
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
 * Result<ProdAucResultVo> :Result
 */
export class IResapi4578 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdAucResultVo
   */
  data?: {
    /**
     * 出价记录id
     */
    recordId?: string;
    /**
     * 最新出价
     */
    lastAucPrice?: number;
    /**
     * 竞拍结束时间
     */
    endTime?: string;
  };
}

export const req4578Config = (data: IReqapi4578) => ({
  url: `/live/auction/create`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 竞拍出价
 **/
export default function (data: IReqapi4578 = {}): Promise<IResapi4578["data"]> {
  return request(req4578Config(...arguments));
}
