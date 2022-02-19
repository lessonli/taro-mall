// @ts-nocheck
/**
 * 活动信息
 * http://yapi.bwyd.com/project/21/interface/api/4528
 **/

import request from "@/service/http.ts";

export class IReqapi4528 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<NewerActivityInfoVo> :Result
 */
export class IResapi4528 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * NewerActivityInfoVo
   */
  data?: {
    /**
     * 活动ID
     */
    uuid?: string;
    /**
     * 活动名称
     */
    activityName?: string;
    /**
     * 开始时间
     */
    startTime?: string;
    /**
     * 结束时间
     */
    endTime?: string;
    /**
     * 活动LOGO
     */
    icon?: string;
    /**
     * 活动状态：1-未开始2-进行中3-已结束
     */
    activityStatus?: number;
    /**
     * 奖励金额上限
     */
    rewardAmountMax?: number;
    /**
     * 用户奖励金额上限
     */
    userRewardAmountMax?: number;
    /**
     * 商户奖励金额上限
     */
    merchantRewardAmountMax?: number;
  };
}

export const req4528Config = (data: IReqapi4528) => ({
  url: `/activity/newer/info`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 活动信息
 **/
export default function (data: IReqapi4528 = {}): Promise<IResapi4528["data"]> {
  return request(req4528Config(...arguments));
}
