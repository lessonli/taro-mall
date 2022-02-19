// @ts-nocheck
/**
 * 商家当前分销团队统计
 * http://yapi.bwyd.com/project/21/interface/api/3788
 **/

import request from "@/service/http.ts";

export class IReqapi3788 {}

/**
 * Result<MerchantCurrentDistributionTeamStatisticsVO> :Result
 */
export class IResapi3788 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantCurrentDistributionTeamStatisticsVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 团队数量
     */
    teamCont?: number;
    /**
     * 培养团队数量
     */
    transTeamCount?: number;
  };
}

export const req3788Config = (data: IReqapi3788) => ({
  url: `/merchant/distribution/statistics/current/team`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家当前分销团队统计
 **/
export default function (data: IReqapi3788 = {}): Promise<IResapi3788["data"]> {
  return request(req3788Config(...arguments));
}
