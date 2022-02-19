// @ts-nocheck
/**
 * 直接邀请商家列表
 * http://yapi.bwyd.com/project/21/interface/api/3764
 **/

import request from "@/service/http.ts";

export class IReqapi3764 {
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<MerDistributionDirectInviteMerchantVO>> :Result
 */
export class IResapi3764 {
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
       * 显示时间
       */
      displayTime?: string;
      /**
       * 佣金
       */
      commissionAmount?: number;
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

export const req3764Config = (data: IReqapi3764) => ({
  url: `/merchant/distribution/direct/invite/merchant/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 直接邀请商家列表
 **/
export default function (data: IReqapi3764 = {}): Promise<IResapi3764["data"]> {
  return request(req3764Config(...arguments));
}
