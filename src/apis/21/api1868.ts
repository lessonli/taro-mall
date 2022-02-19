// @ts-nocheck
/**
 * 获取商品热词搜索配置
 * http://yapi.bwyd.com/project/21/interface/api/1868
 **/

import request from "@/service/http.ts";

export class IReqapi1868 {}

/**
 * Result<List<String>> :Result
 */
export class IResapi1868 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * String
   */
  data?: string[];
}

export const req1868Config = (data: IReqapi1868) => ({
  url: `/config/product/keywords`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品热词搜索配置
 **/
export default function (data: IReqapi1868 = {}): Promise<IResapi1868["data"]> {
  return request(req1868Config(...arguments));
}
