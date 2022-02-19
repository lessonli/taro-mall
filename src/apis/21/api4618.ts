// @ts-nocheck
/**
 * 根据商户id获取直播中的直播间
 * http://yapi.bwyd.com/project/21/interface/api/4618
 **/

import request from "@/service/http.ts";

export class IReqapi4618 {
  /**
   * (String)
   */
  merchantId?: string | number;
}

/**
 * Result<LivingRoomBaseVo> :Result
 */
export class IResapi4618 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LivingRoomBaseVo
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
  };
}

export const req4618Config = (data: IReqapi4618) => ({
  url: `/live/room/getLivingByMerchantId`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据商户id获取直播中的直播间
 **/
export default function (data: IReqapi4618 = {}): Promise<IResapi4618["data"]> {
  return request(req4618Config(...arguments));
}
