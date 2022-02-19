// @ts-nocheck
/**
 * 关注
 * http://yapi.bwyd.com/project/21/interface/api/2884
 **/

import request from "@/service/http.ts";

/**
 * UserFollowShopParam :UserFollowShopParam
 */
export class IReqapi2884 {
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
export class IResapi2884 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2884Config = (data: IReqapi2884) => ({
  url: `/user/follow/follow`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 关注
 **/
export default function (data: IReqapi2884 = {}): Promise<IResapi2884["data"]> {
  return request(req2884Config(...arguments));
}
