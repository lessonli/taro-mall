// @ts-nocheck
/**
 * 校验商户是否可开直播
 * http://yapi.bwyd.com/project/21/interface/api/4508
 **/

import request from "@/service/http.ts";

export class IReqapi4508 {}

/**
 * Result<Integer> :Result
 */
export class IResapi4508 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4508Config = (data: IReqapi4508) => ({
  url: `/live/room/checkCanLive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 校验商户是否可开直播
 **/
export default function (data: IReqapi4508 = {}): Promise<IResapi4508["data"]> {
  return request(req4508Config(...arguments));
}
