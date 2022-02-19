// @ts-nocheck
/**
 * 商家当前分销团队列表，不分页，可排序（排序可选值：privateFansCount 专属粉丝，directSubMerchantCount 邀请商家）
 * http://yapi.bwyd.com/project/21/interface/api/3794
 **/

import request from "@/service/http.ts";

export class IReqapi3794 {
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<List<MerchantDistributionTeamVO>> :Result
 */
export class IResapi3794 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantDistributionTeamVO
   */
  data?: {
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
     * 昵称
     */
    nickName?: string;
    /**
     * 头像
     */
    headImg?: string;
  }[];
}

export const req3794Config = (data: IReqapi3794) => ({
  url: `/merchant/distribution/current/team/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家当前分销团队列表，不分页，可排序（排序可选值：privateFansCount 专属粉丝，directSubMerchantCount 邀请商家）
 **/
export default function (data: IReqapi3794 = {}): Promise<IResapi3794["data"]> {
  return request(req3794Config(...arguments));
}
