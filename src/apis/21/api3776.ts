// @ts-nocheck
/**
 * 商家当前邀请用户列表
 * http://yapi.bwyd.com/project/21/interface/api/3776
 **/

import request from "@/service/http.ts";

export class IReqapi3776 {
  /**
   * 商户编号
   */
  merchantNo?: string | number;
  /**
   * 用户类型：1-普粉2-专粉3-商家,@seecom.bwyd.user.enums.UserLevelType
   */
  type?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<MerchantCurrentInviteUserVO>> :Result
 */
export class IResapi3776 {
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
       * 最近登录时间
       */
      lastLoginTime?: string;
      /**
       * 直接分销订单数量
       */
      directDistributionOrderCount?: number;
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

export const req3776Config = (data: IReqapi3776) => ({
  url: `/merchant/distribution/current/invite/user/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家当前邀请用户列表
 **/
export default function (data: IReqapi3776 = {}): Promise<IResapi3776["data"]> {
  return request(req3776Config(...arguments));
}
