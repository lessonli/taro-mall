// @ts-nocheck
/**
 * 删除直播商品
 * http://yapi.bwyd.com/project/21/interface/api/4572
 **/

import request from "@/service/http.ts";

/**
 * ProductDeleteParam :ProductDeleteParam
 */
export class IReqapi4572 {
  /**
   * 商品uuid
   */
  uuid?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi4572 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4572Config = (data: IReqapi4572) => ({
  url: `/live/product/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 删除直播商品
 **/
export default function (data: IReqapi4572 = {}): Promise<IResapi4572["data"]> {
  return request(req4572Config(...arguments));
}
