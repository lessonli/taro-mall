// @ts-nocheck
/**
 * 商品竞拍前置查询
 * http://yapi.bwyd.com/project/21/interface/api/2500
 **/

import request from "@/service/http.ts";

export class IReqapi2500 {
  /**
   * (String)
   */
  productId?: string | number;
}

/**
 * Result<ProductPreAucVo> :Result
 */
export class IResapi2500 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProductPreAucVo
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

export const req2500Config = (data: IReqapi2500) => ({
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
export default function (data: IReqapi2500 = {}): Promise<IResapi2500["data"]> {
  return request(req2500Config(...arguments));
}
