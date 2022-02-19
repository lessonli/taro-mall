// @ts-nocheck
/**
 * 根据直播间id获取直播间
 * http://yapi.bwyd.com/project/21/interface/api/4504
 **/

import request from "@/service/http.ts";

export class IReqapi4504 {
  /**
   * (String)
   */
  roomId?: string | number;
}

/**
 * Result<LivingRoomViewVo> :Result
 */
export class IResapi4504 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LivingRoomViewVo
   */
  data?: {
    /**
     * 直播流拉取地址
     */
    streamPullUrl?: string;
    /**
     * 直播间群组id
     */
    imGroupId?: string;
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
     * 关注状态,0:未关注,1:已关注
     */
    attentionStatus?: number;
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

export const req4504Config = (data: IReqapi4504) => ({
  url: `/live/room/get`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据直播间id获取直播间
 **/
export default function (data: IReqapi4504 = {}): Promise<IResapi4504["data"]> {
  return request(req4504Config(...arguments));
}
