// @ts-nocheck
/**
 * 直接邀请商家信息统计
 * http://yapi.bwyd.com/project/21/interface/api/3758
 **/

import request from "@/service/http.ts";

export class IReqapi3758 {}

/**
 * Result<MerchantDistributionDirectInviteStatVO> :Result
 */
export class IResapi3758 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantDistributionDirectInviteStatVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 直接邀请佣金
     */
    commissionAmount?: number;
    /**
     * 直接下级商户数量
     */
    directSubMerchantCount?: number;
  };
}

export const req3758Config = (data: IReqapi3758) => ({
  url: `/merchant/distribution/statistics/direct/invite`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 直接邀请商家信息统计
 **/
export default function (data: IReqapi3758 = {}): Promise<IResapi3758["data"]> {
  return request(req3758Config(...arguments));
}
