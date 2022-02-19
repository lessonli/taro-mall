// @ts-nocheck
/**
 * 商家当前邀请信息统计
 * http://yapi.bwyd.com/project/21/interface/api/3770
 **/

import request from "@/service/http.ts";

export class IReqapi3770 {}

/**
 * Result<MerchantCurrentInviteStatisticsVO> :Result
 */
export class IResapi3770 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantCurrentInviteStatisticsVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 邀请的商家数量
     */
    invitedMerchantCount?: number;
    /**
     * 邀请的专粉数量
     */
    invitedPrivateFansCount?: number;
    /**
     * 邀请的普粉数量
     */
    invitedNormalFansCount?: number;
  };
}

export const req3770Config = (data: IReqapi3770) => ({
  url: `/merchant/distribution/statistics/current/invite`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家当前邀请信息统计
 **/
export default function (data: IReqapi3770 = {}): Promise<IResapi3770["data"]> {
  return request(req3770Config(...arguments));
}
