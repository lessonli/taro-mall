// @ts-nocheck
/**
 * 取消预展直播
 * http://yapi.bwyd.com/project/21/interface/api/4500
 **/

import request from "@/service/http.ts";

/**
 * LiveRecordCancelParam :LiveRecordCancelParam
 */
export class IReqapi4500 {
  /**
   * 商户id
   */
  merchantId?: string;
  /**
   * 直播记录编号
   */
  recordId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4500 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4500Config = (data: IReqapi4500) => ({
  url: `/live/record/cancelPreLive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 取消预展直播
 **/
export default function (data: IReqapi4500 = {}): Promise<IResapi4500["data"]> {
  return request(req4500Config(...arguments));
}
