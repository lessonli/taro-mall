// @ts-nocheck
/**
 * 关注或取消关注直播间
 * http://yapi.bwyd.com/project/21/interface/api/4890
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomAttentionParam :LiveRoomAttentionParam
 */
export class IReqapi4890 {
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 关注状态，0：未关注,1:已关注
   */
  status?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4890 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4890Config = (data: IReqapi4890) => ({
  url: `/live/room/attention`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 关注或取消关注直播间
 **/
export default function (data: IReqapi4890 = {}): Promise<IResapi4890["data"]> {
  return request(req4890Config(...arguments));
}
