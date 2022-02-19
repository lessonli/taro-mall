// @ts-nocheck
/**
 * 获取商品草稿箱文本内容
 * http://yapi.bwyd.com/project/21/interface/api/4750
 **/

import request from "@/service/http.ts";

export class IReqapi4750 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<String> :Result
 */
export class IResapi4750 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4750Config = (data: IReqapi4750) => ({
  url: `/product/draft/getMobileHtml`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品草稿箱文本内容
 **/
export default function (data: IReqapi4750 = {}): Promise<IResapi4750["data"]> {
  return request(req4750Config(...arguments));
}
