// @ts-nocheck
/**
 * 取消关注
 * http://yapi.bwyd.com/project/21/interface/api/2892
 **/

import request from "@/service/http.ts";

/**
 * UserFollowShopParam :UserFollowShopParam
 */
export class IReqapi2892 {
  /**
   * 用户编号
   */
  userNo?: string;
  /**
   * 商户编号
   */
  merchantNo?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2892 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2892Config = (data: IReqapi2892) => ({
  url: `/user/follow/cancel`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 取消关注
 **/
export default function (data: IReqapi2892 = {}): Promise<IResapi2892["data"]> {
  return request(req2892Config(...arguments));
}
