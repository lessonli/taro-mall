// @ts-nocheck
/**
 * 获取商品保证金配置项
 * http://yapi.bwyd.com/project/21/interface/api/2996
 **/

import request from "@/service/http.ts";

export class IReqapi2996 {}

/**
 * Result<List<Integer>> :Result
 */
export class IResapi2996 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Integer
   */
  data?: number[];
}

export const req2996Config = (data: IReqapi2996) => ({
  url: `/config/product/margins`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品保证金配置项
 **/
export default function (data: IReqapi2996 = {}): Promise<IResapi2996["data"]> {
  return request(req2996Config(...arguments));
}
