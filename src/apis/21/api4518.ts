// @ts-nocheck
/**
 * 移除用户的黑名单
 * http://yapi.bwyd.com/project/21/interface/api/4518
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomBlacklistRemoveParam :LiveRoomBlacklistRemoveParam
 */
export class IReqapi4518 {
  /**
   * 商户id
   */
  merchantId?: string;
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 用户id
   */
  userId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4518 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4518Config = (data: IReqapi4518) => ({
  url: `/live/room/removeBlacklist`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 移除用户的黑名单
 **/
export default function (data: IReqapi4518 = {}): Promise<IResapi4518["data"]> {
  return request(req4518Config(...arguments));
}
