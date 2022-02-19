// @ts-nocheck
/**
 * 查询直播中的红包ID
 * http://yapi.bwyd.com/project/21/interface/api/4924
 **/

import request from "@/service/http.ts";

export class IReqapi4924 {}

/**
 * Result<RedPacketLiveVo> :Result
 */
export class IResapi4924 {
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
     * 状态:0-红包关闭1-上新红包
     */
    status?: number;
    /**
     * 领取过期时间
     */
    expireTime?: string;
  };
}

export const req4924Config = (data: IReqapi4924) => ({
  url: `/red/packet/merchant/living`,
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
export default function (data: IReqapi4924 = {}): Promise<IResapi4924["data"]> {
  return request(req4924Config(...arguments));
}
