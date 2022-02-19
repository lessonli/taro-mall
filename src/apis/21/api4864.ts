// @ts-nocheck
/**
 * 根据专题活动id查询绑定直播间信息
 * http://yapi.bwyd.com/project/21/interface/api/4864
 **/

import request from "@/service/http.ts";

export class IReqapi4864 {
  /**
   * 活动id
   */
  activityId?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ActivityLiveRoomVo>> :Result
 */
export class IResapi4864 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 关注粉丝数量
       */
      fansNum?: number;
      /**
       * 直播间id
       */
      roomId?: string;
      /**
       * 商户id
       */
      merchantId?: string;
      /**
       * 本场直播的id
       */
      recordId?: string;
      /**
       * 直播间名称
       */
      roomName?: string;
      /**
       * 直播间头像
       */
      headImg?: string;
      /**
       * 本场直播标题
       */
      title?: string;
      /**
       * 本场直播封面图
       */
      coverImg?: string;
      /**
       * 本场直播海报图
       */
      posterImg?: string;
      /**
       * 直播间状态,1为预展中,2为直播中
       */
      status?: number;
      /**
       * 直播开始时间
       */
      startTime?: string;
      /**
       * 当前观看人次
       */
      viewCount?: number;
      /**
       * 当前点赞次数
       */
      likeCount?: number;
    }[];
    hasNext?: boolean;
  };
}

export const req4864Config = (data: IReqapi4864) => ({
  url: `/activity/rooms`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据专题活动id查询绑定直播间信息
 **/
export default function (data: IReqapi4864 = {}): Promise<IResapi4864["data"]> {
  return request(req4864Config(...arguments));
}
