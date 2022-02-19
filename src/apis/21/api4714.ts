// @ts-nocheck
/**
 * 中断推流
 * http://yapi.bwyd.com/project/21/interface/api/4714
 **/

import request from "@/service/http.ts";

/**
 * StreamCallbackParam :StreamCallbackParam
 */
export class IReqapi4714 {
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
export class IResapi4714 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4714Config = (data: IReqapi4714) => ({
  url: `/live/callback/streamInterrupt`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 中断推流
 **/
export default function (data: IReqapi4714 = {}): Promise<IResapi4714["data"]> {
  return request(req4714Config(...arguments));
}
