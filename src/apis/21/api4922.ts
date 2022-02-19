// @ts-nocheck
/**
 * 查询直播中的红包ID
 * http://yapi.bwyd.com/project/21/interface/api/4922
 **/

import request from "@/service/http.ts";

export class IReqapi4922 {
  /**
   * 直播间ID(String)
   */
  roomId?: string | number;
}

/**
 * Result<RedPacketLiveVo> :Result
 */
export class IResapi4922 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketLiveVo
   */
  data?: {
    /**
     * 红包ID
     */
    uuid?: string;
    /**
     * 商户ID
     */
    merchantId?: string;
    /**
     * 状态:0-红包关闭1-上新红包
     */
    status?: number;
    /**
     * 领取过期时间
     */
    expireTime?: string;
    /**
     * 玩法策略：2-普通红包3-拼手气红包,,@seecom.bwyd.distribution.enums.RedPacketStrategy
     */
    amountStrategy?: number;
  };
}

export const req4922Config = (data: IReqapi4922) => ({
  url: `/red/packet/user/living`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询直播中的红包ID
 **/
export default function (data: IReqapi4922 = {}): Promise<IResapi4922["data"]> {
  return request(req4922Config(...arguments));
}
