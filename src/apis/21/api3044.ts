// @ts-nocheck
/**
 * 商品竞拍前置查询
 **/

import request from "@/service/http.ts";

export class IReqapi3044 {}

/**
 * Result<ProdPreAuctionVo> :Result
 */
export class IResapi3044 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdPreAuctionVo
   */
  data?: {
    /**
     * 当前用户出价是否领先
     */
    isAhead?: boolean;
    /**
     * 是否需要缴纳保证金
     */
    isNeedMargin?: boolean;
  };
}

export const req3044Config = (prodId, data: IReqapi3044) => ({
  url: `/auction/preAuc/${prodId}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  prodId,
  data: IReqapi3044 = {}
): Promise<IResapi3044["data"]> {
  return request(req3044Config(...arguments));
}
