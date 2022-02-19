// @ts-nocheck
/**
 * 获取商品服务配置
 * http://yapi.bwyd.com/project/21/interface/api/1892
 **/

import request from "@/service/http.ts";

export class IReqapi1892 {}

/**
 * Result<List<ProductServiceVo>> :Result
 */
export class IResapi1892 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProductServiceVo
   */
  data?: {
    /**
     * 服务值
     */
    id?: number;
    /**
     * 服务名称
     */
    name?: string;
    /**
     * 服务描述
     */
    desc?: string;
  }[];
}

export const req1892Config = (data: IReqapi1892) => ({
  url: `/config/product/services`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品服务配置
 **/
export default function (data: IReqapi1892 = {}): Promise<IResapi1892["data"]> {
  return request(req1892Config(...arguments));
}
