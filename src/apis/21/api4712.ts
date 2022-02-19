// @ts-nocheck
/**
 * 开始推流
 * http://yapi.bwyd.com/project/21/interface/api/4712
 **/

import request from "@/service/http.ts";

/**
 * StreamCallbackParam :StreamCallbackParam
 */
export class IReqapi4712 {
  app?: string;
  appId?: number;
  appName?: string;
  channelId?: string;
  errCode?: number;
  errMsg?: string;
  eventTime?: number;
  eventType?: number;
  setId?: number;
  node?: string;
  sequence?: string;
  streamId?: string;
  streamParam?: string;
  userIp?: string;
  width?: number;
  height?: number;
  sign?: string;
  t?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4712 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4712Config = (data: IReqapi4712) => ({
  url: `/live/callback/streamStart`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 开始推流
 **/
export default function (data: IReqapi4712 = {}): Promise<IResapi4712["data"]> {
  return request(req4712Config(...arguments));
}
