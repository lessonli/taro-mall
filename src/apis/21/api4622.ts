// @ts-nocheck
/**
 * 开播提醒所有粉丝
 * http://yapi.bwyd.com/project/21/interface/api/4622
 **/

import request from "@/service/http.ts";

export class IReqapi4622 {}

/**
 * Result<Void> :Result
 */
export class IResapi4622 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4622Config = (data: IReqapi4622) => ({
  url: `/live/room/notifyFans`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 开播提醒所有粉丝
 **/
export default function (data: IReqapi4622 = {}): Promise<IResapi4622["data"]> {
  return request(req4622Config(...arguments));
}
