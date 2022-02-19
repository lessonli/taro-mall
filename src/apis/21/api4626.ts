// @ts-nocheck
/**
 * 更新预展直播
 * http://yapi.bwyd.com/project/21/interface/api/4626
 **/

import request from "@/service/http.ts";

/**
 * LiveRecordUpdateParam :LiveRecordUpdateParam
 */
export class IReqapi4626 {
  /**
   * 直播记录id
   */
  uuid?: string;
  /**
   * 商户id,前端无需传入
   */
  merchantId?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 封面图
   */
  coverImg?: string;
  /**
   * 海报图
   */
  posterImg?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 分佣比例
   */
  distPercent?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi4626 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4626Config = (data: IReqapi4626) => ({
  url: `/live/record/updatePreLive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 更新预展直播
 **/
export default function (data: IReqapi4626 = {}): Promise<IResapi4626["data"]> {
  return request(req4626Config(...arguments));
}
