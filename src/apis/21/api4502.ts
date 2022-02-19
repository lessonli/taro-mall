// @ts-nocheck
/**
 * 获取直播间列表
 * http://yapi.bwyd.com/project/21/interface/api/4502
 **/

import request from "@/service/http.ts";

export class IReqapi4502 {
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<LiveRoomVo>> :Result
 */
export class IResapi4502 {
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
      uuid?: string;
      /**
       * 直播间分类
       */
      category?: number;
      /**
       * 商户id
       */
      merchantId?: string;
      /**
       * 直播间头像
       */
      headImg?: string;
      /**
       * 直播间名称
       */
      roomName?: string;
      /**
       * 直播间简介
       */
      introduction?: string;
      /**
       * 直播间公告
       */
      announcement?: string;
      /**
       * 最近开播记录
       */
      currentRecord?: string;
      /**
       * 直播间状态：0->未开播；1->直播中
       */
      status?: number;
      /**
       * 直播间状态：0->不启用；1->启用
       */
      enableStatus?: number;
      requestId?: string;
      /**
       * (该参数为map)
       */
      feature?: {
        /**
         * String
         */
        mapKey?: {};
        /**
         * String
         */
        mapValue?: {
          hash?: number;
        };
      };
      id?: number;
      version?: number;
      gmtCreate?: string;
      gmtModify?: string;
      isDeleted?: number;
    }[];
  };
}

export const req4502Config = (data: IReqapi4502) => ({
  url: `/live/room/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取直播间列表
 **/
export default function (data: IReqapi4502 = {}): Promise<IResapi4502["data"]> {
  return request(req4502Config(...arguments));
}
