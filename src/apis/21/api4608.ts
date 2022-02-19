// @ts-nocheck
/**
 * 主动下播前的直播统计
 * http://yapi.bwyd.com/project/21/interface/api/4608
 **/

import request from "@/service/http.ts";

export class IReqapi4608 {}

/**
 * Result<LiveRecordEndStatisticsVo> :Result
 */
export class IResapi4608 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRecordEndStatisticsVo
   */
  data?: {
    /**
     * 直播间编号
     */
    roomId?: string;
    /**
     * 直播记录id
     */
    recordId?: string;
    /**
     * 直播总时长,秒数
     */
    duration?: number;
    /**
     * 下单总数
     */
    orderCount?: number;
    /**
     * 观看次数
     */
    viewCount?: number;
    /**
     * 观看人数
     */
    userCount?: number;
    /**
     * 新增关注数
     */
    newFansCount?: number;
    /**
     * 新增关注数
     */
    followCount?: number;
  };
}

export const req4608Config = (data: IReqapi4608) => ({
  url: `/live/record/endStatistics`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 主动下播前的直播统计
 **/
export default function (data: IReqapi4608 = {}): Promise<IResapi4608["data"]> {
  return request(req4608Config(...arguments));
}
