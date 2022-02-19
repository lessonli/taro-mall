// @ts-nocheck
/**
 * 商家分销团队日统计
 * http://yapi.bwyd.com/project/21/interface/api/3806
 **/

import request from "@/service/http.ts";

export class IReqapi3806 {
  merchantNo?: string | number;
  /**
   * 类型：2-专粉3-商家（不支持普粉）,@seecom.bwyd.user.enums.UserLevelType
   */
  type?: string | number;
}

/**
 * Result<List<MerchantTeamDistributionStatisticsDayVO>> :Result
 */
export class IResapi3806 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantTeamDistributionStatisticsDayVO
   */
  data?: {
    /**
     * 统计日期
     */
    statisticsDate?: string;
    /**
     * 数量
     */
    count?: number;
  }[];
}

export const req3806Config = (data: IReqapi3806) => ({
  url: `/merchant/distribution/statistics/team/day/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家分销团队日统计
 **/
export default function (data: IReqapi3806 = {}): Promise<IResapi3806["data"]> {
  return request(req3806Config(...arguments));
}
