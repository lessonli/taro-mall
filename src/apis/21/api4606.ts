// @ts-nocheck
/**
 * 校验用户是否在该直播间的黑名单中,商户专用
 * http://yapi.bwyd.com/project/21/interface/api/4606
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomBlacklistIdentifyParam :LiveRoomBlacklistIdentifyParam
 */
export class IReqapi4606 {
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 用户im的标识
   */
  userIdentify?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi4606 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req4606Config = (data: IReqapi4606) => ({
  url: `/live/room/checkUserInBlacklist`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 校验用户是否在该直播间的黑名单中,商户专用
 **/
export default function (data: IReqapi4606 = {}): Promise<IResapi4606["data"]> {
  return request(req4606Config(...arguments));
}
