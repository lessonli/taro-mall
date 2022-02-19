// @ts-nocheck
/**
 * 无需登录获取直播间基本信息
 * http://yapi.bwyd.com/project/21/interface/api/4892
 **/

import request from "@/service/http.ts";

export class IReqapi4892 {
  /**
   * (String)
   */
  roomId?: string | number;
}

/**
 * Result<LiveRoomBaseVo> :Result
 */
export class IResapi4892 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomBaseVo
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
     * 直播间名称
     */
    roomName?: string;
    /**
     * 直播间头像
     */
    headImg?: string;
    /**
     * 直播间状态,1为预展中,2为直播中
     */
    status?: number;
  };
}

export const req4892Config = (data: IReqapi4892) => ({
  url: `/live/room/getBaseByRoomId`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 无需登录获取直播间基本信息
 **/
export default function (data: IReqapi4892 = {}): Promise<IResapi4892["data"]> {
  return request(req4892Config(...arguments));
}
