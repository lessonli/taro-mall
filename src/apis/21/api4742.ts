// @ts-nocheck
/**
 * 删除商品草稿箱信息
 * http://yapi.bwyd.com/project/21/interface/api/4742
 **/

import request from "@/service/http.ts";

/**
 * ProductDeleteParam :ProductDeleteParam
 */
export class IReqapi4742 {
  /**
   * 商品uuid
   */
  uuid?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi4742 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4742Config = (data: IReqapi4742) => ({
  url: `/product/draft/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 删除商品草稿箱信息
 **/
export default function (data: IReqapi4742 = {}): Promise<IResapi4742["data"]> {
  return request(req4742Config(...arguments));
}
