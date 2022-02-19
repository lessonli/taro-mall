// @ts-nocheck
/**
 * 获取开通直播间条件情况
 * http://yapi.bwyd.com/project/21/interface/api/4620
 **/

import request from "@/service/http.ts";

export class IReqapi4620 {}

/**
 * Result<LiveRoomOpenStandardVo> :Result
 */
export class IResapi4620 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomOpenStandardVo
   */
  data?: {
    /**
     * 商户等级,1,"金牌商家",,2,"钻石商家",,3,"服务商"
     */
    merchantLevel?: number;
    /**
     * 认证状态,0,未认证，1->认证中,2->已认证
     */
    authStatus?: number;
    /**
     * 保证金金额,单位分
     */
    marginAmount?: number;
    /**
     * 粉丝数
     */
    fansCount?: number;
    /**
     * 交易金额,单位分
     */
    tradeAmount?: number;
  };
}

export const req4620Config = (data: IReqapi4620) => ({
  url: `/live/room/openStandard`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取开通直播间条件情况
 **/
export default function (data: IReqapi4620 = {}): Promise<IResapi4620["data"]> {
  return request(req4620Config(...arguments));
}
