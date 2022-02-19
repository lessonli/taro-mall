// @ts-nocheck
/**
 * 获取本商户的今日直播统计
 * http://yapi.bwyd.com/project/21/interface/api/4616
 **/

import request from "@/service/http.ts";

export class IReqapi4616 {}

/**
 * Result<LiveRoomTodayStatisticsVo> :Result
 */
export class IResapi4616 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomTodayStatisticsVo
   */
  data?: {
    /**
     * 直播间编号
     */
    roomId?: string;
    /**
     * 直播总时长,秒数
     */
    duration?: number;
    /**
     * 下单总数
     */
    orderCount?: number;
    /**
     * 交易金额
     */
    tradeAmount?: number;
  };
}

export const req4616Config = (data: IReqapi4616) => ({
  url: `/live/room/todayStatistics`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取本商户的今日直播统计
 **/
export default function (data: IReqapi4616 = {}): Promise<IResapi4616["data"]> {
  return request(req4616Config(...arguments));
}
