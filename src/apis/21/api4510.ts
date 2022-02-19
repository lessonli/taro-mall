// @ts-nocheck
/**
 * 校验自己是否在该直播间的黑名单中
 * http://yapi.bwyd.com/project/21/interface/api/4510
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomBlacklistCommonParam :LiveRoomBlacklistCommonParam
 */
export class IReqapi4510 {
  /**
   * 直播间编号
   */
  merchantId?: string;
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 直播间名称
   */
  userId?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi4510 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req4510Config = (data: IReqapi4510) => ({
  url: `/live/room/checkInBlacklist`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 校验自己是否在该直播间的黑名单中
 **/
export default function (data: IReqapi4510 = {}): Promise<IResapi4510["data"]> {
  return request(req4510Config(...arguments));
}
