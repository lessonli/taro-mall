// @ts-nocheck
/**
 * 修改商品是否推荐
 * http://yapi.bwyd.com/project/21/interface/api/2068
 **/

import request from "@/service/http.ts";

/**
 * ProductStatusParam :ProductStatusParam
 */
export class IReqapi2068 {
  /**
   * 商品uuid
   */
  uuid?: string;
  /**
   * 上下架|推荐|取消推荐0:1
   */
  status?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2068 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2068Config = (data: IReqapi2068) => ({
  url: `/product/recommend`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商品是否推荐
 **/
export default function (data: IReqapi2068 = {}): Promise<IResapi2068["data"]> {
  return request(req2068Config(...arguments));
}
