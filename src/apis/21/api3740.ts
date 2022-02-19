// @ts-nocheck
/**
 * 删除店铺商品
 * http://yapi.bwyd.com/project/21/interface/api/3740
 **/

import request from "@/service/http.ts";

/**
 * ProductDeleteParam :ProductDeleteParam
 */
export class IReqapi3740 {
  /**
   * 商品uuid
   */
  uuid?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi3740 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req3740Config = (data: IReqapi3740) => ({
  url: `/product/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 删除店铺商品
 **/
export default function (data: IReqapi3740 = {}): Promise<IResapi3740["data"]> {
  return request(req3740Config(...arguments));
}
