// @ts-nocheck
/**
 * 直播间信息检查
 * http://yapi.bwyd.com/project/21/interface/api/4690
 **/

import request from "@/service/http.ts";

export class IReqapi4690 {
  /**
   * (String)
   */
  roomId?: string | number;
}

/**
 * Result<LiveRoomCheckVo> :Result
 */
export class IResapi4690 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomCheckVo
   */
  data?: {
    /**
     * 是否自己直播间
     */
    ownState?: number;
  };
}

export const req4690Config = (data: IReqapi4690) => ({
  url: `/live/room/check`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 直播间信息检查
 **/
export default function (data: IReqapi4690 = {}): Promise<IResapi4690["data"]> {
  return request(req4690Config(...arguments));
}
