// @ts-nocheck
/**
 * 获取红包账户信息
 * http://yapi.bwyd.com/project/21/interface/api/4926
 **/

import request from "@/service/http.ts";

export class IReqapi4926 {}

/**
 * Result<RedPacketAccountVo> :Result
 */
export class IResapi4926 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketAccountVo
   */
  data?: {
    /**
     * 总红包金额
     */
    totalAmount?: number;
    /**
     * 可用红包金额
     */
    availableAmount?: number;
  };
}

export const req4926Config = (data: IReqapi4926) => ({
  url: `/red/packet/user/getAccount`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取红包账户信息
 **/
export default function (data: IReqapi4926 = {}): Promise<IResapi4926["data"]> {
  return request(req4926Config(...arguments));
}
