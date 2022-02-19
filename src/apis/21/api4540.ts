// @ts-nocheck
/**
 * 获取直播中的直播间列表
 * http://yapi.bwyd.com/project/21/interface/api/4540
 **/

import request from "@/service/http.ts";

export class IReqapi4540 {
  keyword?: string | number;
  roomId?: string | number;
  roomIdIn?: string | number;
  merchantIdIn?: string | number;
  category?: string | number;
  recStatus?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<LivingRoomBaseVo>> :Result
 */
export class IResapi4540 {
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

export const req4540Config = (data: IReqapi4540) => ({
  url: `/live/room/listLiving`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取直播中的直播间列表
 **/
export default function (data: IReqapi4540 = {}): Promise<IResapi4540["data"]> {
  return request(req4540Config(...arguments));
}
