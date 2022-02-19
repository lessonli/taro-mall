// @ts-nocheck
/**
 * 直播间播放检查
 * http://yapi.bwyd.com/project/21/interface/api/4692
 **/

import request from "@/service/http.ts";

export class IReqapi4692 {
  /**
   * (String)
   */
  roomId?: string | number;
}

/**
 * Result<LivePlayCheckVo> :Result
 */
export class IResapi4692 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LivePlayCheckVo
   */
  data?: {
    /**
     * 是否自己直播间
     */
    ownState?: number;
  };
}

export const req4692Config = (data: IReqapi4692) => ({
  url: `/live/room/playCheck`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 直播间播放检查
 **/
export default function (data: IReqapi4692 = {}): Promise<IResapi4692["data"]> {
  return request(req4692Config(...arguments));
}
