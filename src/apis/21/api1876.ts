// @ts-nocheck
/**
 * 获取商品邮费配置
 * http://yapi.bwyd.com/project/21/interface/api/1876
 **/

import request from "@/service/http.ts";

export class IReqapi1876 {}

/**
 * Result<List<FreightPriceVo>> :Result
 */
export class IResapi1876 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * FreightPriceVo
   */
  data?: {
    /**
     * 邮费显示名称，全国6元
     */
    name?: string;
    /**
     * 邮费显示金额
     */
    value?: number;
  }[];
}

export const req1876Config = (data: IReqapi1876) => ({
  url: `/config/product/freightPrices`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商品邮费配置
 **/
export default function (data: IReqapi1876 = {}): Promise<IResapi1876["data"]> {
  return request(req1876Config(...arguments));
}
