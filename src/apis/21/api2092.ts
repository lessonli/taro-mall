// @ts-nocheck
/**
 * 获取商品分佣比例配置
 * http://yapi.bwyd.com/project/21/interface/api/2092
 **/

import request from "@/service/http.ts";

export class IReqapi2092 {}

/**
 * Result<List<Integer>> :Result
 */
export class IResapi2092 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Integer
   */
  data?: number[];
}

export const req2092Config = (data: IReqapi2092) => ({
  url: `/config/product/distPercents`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品分佣比例配置
 **/
export default function (data: IReqapi2092 = {}): Promise<IResapi2092["data"]> {
  return request(req2092Config(...arguments));
}
