// @ts-nocheck
/**
 * 商品取消收藏
 * http://yapi.bwyd.com/project/21/interface/api/2324
 **/

import request from "@/service/http.ts";

/**
 * ProductCollectReq :ProductCollectReq
 */
export class IReqapi2324 {
  /**
   * 商品id
   */
  productId?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2324 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2324Config = (data: IReqapi2324) => ({
  url: `/collect/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品取消收藏
 **/
export default function (data: IReqapi2324 = {}): Promise<IResapi2324["data"]> {
  return request(req2324Config(...arguments));
}
