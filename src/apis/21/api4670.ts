// @ts-nocheck
/**
 * 红包提现到余额
 * http://yapi.bwyd.com/project/21/interface/api/4670
 **/

import request from "@/service/http.ts";

/**
 * RedPacketWithdrawParam :RedPacketWithdrawParam
 */
export class IReqapi4670 {
  uuid?: string;
  userId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4670 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4670Config = (data: IReqapi4670) => ({
  url: `/red/packet/user/withdrawToAvailable`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 红包提现到余额
 **/
export default function (data: IReqapi4670 = {}): Promise<IResapi4670["data"]> {
  return request(req4670Config(...arguments));
}
