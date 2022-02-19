// @ts-nocheck
/**
 * 获取本商户的直播中的直播间
 * http://yapi.bwyd.com/project/21/interface/api/4542
 **/

import request from "@/service/http.ts";

export class IReqapi4542 {}

/**
 * Result<LivingRoomPushVo> :Result
 */
export class IResapi4542 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LivingRoomPushVo
   */
  data?: {
    /**
     * 直播间名称
     */
    streamPushUrl?: string;
    /**
     * 直播间群组id
     */
    imGroupId?: string;
    /**
     * 分销比例
     */
    distPercent?: number;
    /**
     * 商户信息 ,MerchantViewVo
     */
    merchant?: {
      merchantId?: string;
      /**
       * 关注状态：0-未关注1-已关注
       */
      followStatus?: number;
      /**
       * 粉丝数
       */
      fansCount?: number;
    };
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

export const req4542Config = (data: IReqapi4542) => ({
  url: `/live/room/myLiving`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取本商户的直播中的直播间
 **/
export default function (data: IReqapi4542 = {}): Promise<IResapi4542["data"]> {
  return request(req4542Config(...arguments));
}
