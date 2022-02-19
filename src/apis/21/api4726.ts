// @ts-nocheck
/**
 * 领取记录轮播列表
 * http://yapi.bwyd.com/project/21/interface/api/4726
 **/

import request from "@/service/http.ts";

export class IReqapi4726 {}

/**
 * Result<List<RedPacketReceiveRotationVo>> :Result
 */
export class IResapi4726 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketReceiveRotationVo
   */
  data?: {
    /**
     * 昵称
     */
    nickName?: string;
    /**
     * 头像
     */
    headImg?: string;
    /**
     * 红包金额
     */
    rewardAmount?: number;
  }[];
}

export const req4726Config = (data: IReqapi4726) => ({
  url: `/red/packet/user/receiveRotationList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 领取记录轮播列表
 **/
export default function (data: IReqapi4726 = {}): Promise<IResapi4726["data"]> {
  return request(req4726Config(...arguments));
}
