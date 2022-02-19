// @ts-nocheck
/**
 * 商家当前分销团队列表，可排序（排序可选值：privateFansCount 专属粉丝，directSubMerchantCount 邀请商家）
 * http://yapi.bwyd.com/project/21/interface/api/3824
 **/

import request from "@/service/http.ts";

/**
 * MerchantTeamListParam :MerchantTeamListParam
 */
export class IReqapi3824 {
  /**
   * 商户编号
   */
  merchantNo?: string;
  pageNo?: number;
  pageSize?: number;
  /**
   * PageOrderItem
   */
  orderItems?: {
    column?: string;
    asc?: boolean;
  }[];
}

/**
 * Result<PaginatedData<MerchantDistributionTeamVO>> :Result
 */
export class IResapi3824 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
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
    }[];
  };
}

export const req3824Config = (data: IReqapi3824) => ({
  url: `/merchant/distribution/current/team/list`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家当前分销团队列表，可排序（排序可选值：privateFansCount 专属粉丝，directSubMerchantCount 邀请商家）
 **/
export default function (data: IReqapi3824 = {}): Promise<IResapi3824["data"]> {
  return request(req3824Config(...arguments));
}
