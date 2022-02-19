// @ts-nocheck
/**
 * 查询关注店铺列表
 * http://yapi.bwyd.com/project/21/interface/api/2900
 **/

import request from "@/service/http.ts";

export class IReqapi2900 {
  userNo?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<UserFollowShopVO>> :Result
 */
export class IResapi2900 {
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
       * 店铺认证标识：1-店铺认证 ,Integer
       */
      shopAuthTags?: number[];
      /**
       * 商户编号
       */
      merchantNo?: string;
      /**
       * 店铺名称
       */
      shopName?: string;
      /**
       * 店铺LOGO
       */
      shopLogo?: string;
    }[];
  };
}

export const req2900Config = (data: IReqapi2900) => ({
  url: `/user/follow/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询关注店铺列表
 **/
export default function (data: IReqapi2900 = {}): Promise<IResapi2900["data"]> {
  return request(req2900Config(...arguments));
}
