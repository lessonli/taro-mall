// @ts-nocheck
/**
 * 添加用户的黑名单
 * http://yapi.bwyd.com/project/21/interface/api/4516
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomBlacklistCreateParam :LiveRoomBlacklistCreateParam
 */
export class IReqapi4516 {
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
  /**
   * 加入原因
   */
  reason?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4516 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4516Config = (data: IReqapi4516) => ({
  url: `/live/room/addBlacklist`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 添加用户的黑名单
 **/
export default function (data: IReqapi4516 = {}): Promise<IResapi4516["data"]> {
  return request(req4516Config(...arguments));
}
