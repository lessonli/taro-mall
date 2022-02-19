// @ts-nocheck
/**
 * 商家分销团队统计详情
 * http://yapi.bwyd.com/project/21/interface/api/3860
 **/

import request from "@/service/http.ts";

export class IReqapi3860 {
  /**
   * (String)
   */
  merchantNo?: string | number;
}

/**
 * Result<MerchantDistributionTeamVO> :Result
 */
export class IResapi3860 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantDistributionTeamVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 开店时间
     */
    displayTime?: string;
    /**
     * 专粉数量（累计）
     */
    privateFansCount?: number;
    /**
     * 直接下级商家数量（累计）
     */
    directSubMerchantCount?: number;
    /**
     * 用户编号
     */
    userNo?: string;
    /**
     * 昵称
     */
    nickName?: string;
    /**
     * 头像
     */
    headImg?: string;
  };
}

export const req3860Config = (data: IReqapi3860) => ({
  url: `/merchant/distribution/statistics/team/detail`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家分销团队统计详情
 **/
export default function (data: IReqapi3860 = {}): Promise<IResapi3860["data"]> {
  return request(req3860Config(...arguments));
}
