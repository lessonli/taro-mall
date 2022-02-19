// @ts-nocheck
/**
 * 商品收藏
 * http://yapi.bwyd.com/project/21/interface/api/2316
 **/

import request from "@/service/http.ts";

/**
 * ProductCollectReq :ProductCollectReq
 */
export class IReqapi2316 {
  /**
   * 商品id
   */
  productId?: string;
}

/**
 * Result<Long> :Result
 */
export class IResapi2316 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2316Config = (data: IReqapi2316) => ({
  url: `/collect/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品收藏
 **/
export default function (data: IReqapi2316 = {}): Promise<IResapi2316["data"]> {
  return request(req2316Config(...arguments));
}
