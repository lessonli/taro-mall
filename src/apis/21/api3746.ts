// @ts-nocheck
/**
 * 查询分销GMV日统计
 * http://yapi.bwyd.com/project/21/interface/api/3746
 **/

import request from "@/service/http.ts";

export class IReqapi3746 {}

/**
 * Result<List<MerchantDistributionStatisticsGmvDayVO>> :Result
 */
export class IResapi3746 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantDistributionStatisticsGmvDayVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 统计日期
     */
    statisticsDate?: string;
    /**
     * 销售额
     */
    gmv?: number;
    /**
     * 订单数量
     */
    orderCount?: number;
  }[];
}

export const req3746Config = (data: IReqapi3746) => ({
  url: `/merchant/distribution/statistics/gmv/day/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询分销GMV日统计
 **/
export default function (data: IReqapi3746 = {}): Promise<IResapi3746["data"]> {
  return request(req3746Config(...arguments));
}
