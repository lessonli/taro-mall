// @ts-nocheck
/**
 * 主动下播
 * http://yapi.bwyd.com/project/21/interface/api/4604
 **/

import request from "@/service/http.ts";

/**
 * LiveRecordEndParam :LiveRecordEndParam
 */
export class IReqapi4604 {
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 直播记录编号
   */
  recordId?: string;
  /**
   * 操作商户id
   */
  merchantId?: string;
  /**
   * 下播类型,0:主动下播,1:自动下播,无需传入
   */
  endType?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4604 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4604Config = (data: IReqapi4604) => ({
  url: `/live/record/endLive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 主动下播
 **/
export default function (data: IReqapi4604 = {}): Promise<IResapi4604["data"]> {
  return request(req4604Config(...arguments));
}
