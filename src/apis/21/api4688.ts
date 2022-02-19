// @ts-nocheck
/**
 * 判断当前是否是自己的直播间
 * http://yapi.bwyd.com/project/21/interface/api/4688
 **/

import request from "@/service/http.ts";

export class IReqapi4688 {
  /**
   * 直播间id(String)
   */
  roomId?: string | number;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi4688 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req4688Config = (data: IReqapi4688) => ({
  url: `/live/room/isMyRoom`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 判断当前是否是自己的直播间
 **/
export default function (data: IReqapi4688 = {}): Promise<IResapi4688["data"]> {
  return request(req4688Config(...arguments));
}
