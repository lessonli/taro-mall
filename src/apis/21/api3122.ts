// @ts-nocheck
/**
 * 商品竞拍前置查询
 * http://yapi.bwyd.com/project/21/interface/api/3122
 **/

import request from "@/service/http.ts";

export class IReqapi3122 {
  /**
   * (String)
   */
  productId?: string | number;
}

/**
 * Result<ProdPreAucInfoVo> :Result
 */
export class IResapi3122 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdPreAucInfoVo
   */
  data?: {
    /**
     * 当前用户出价是否领先
     */
    ahead?: boolean;
    /**
     * 是否需要缴纳保证金
     */
    needMargin?: boolean;
    /**
     * 当前最新出价
     */
    lastAucPrice?: number;
  };
}

export const req3122Config = (data: IReqapi3122) => ({
  url: `/auction/preAucInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品竞拍前置查询
 **/
export default function (data: IReqapi3122 = {}): Promise<IResapi3122["data"]> {
  return request(req3122Config(...arguments));
}
