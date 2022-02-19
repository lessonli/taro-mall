// @ts-nocheck
/**
 * 红包领取配置
 * http://yapi.bwyd.com/project/21/interface/api/4838
 **/

import request from "@/service/http.ts";

export class IReqapi4838 {}

/**
 * Result<UserRedPacketConfigVo> :Result
 */
export class IResapi4838 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserRedPacketConfigVo
   */
  data?: {
    /**
     * 领取规则
     */
    receiveRule?: string;
    /**
     * 使用规则
     */
    useRule?: string;
  };
}

export const req4838Config = (data: IReqapi4838) => ({
  url: `/red/packet/user/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 红包领取配置
 **/
export default function (data: IReqapi4838 = {}): Promise<IResapi4838["data"]> {
  return request(req4838Config(...arguments));
}
