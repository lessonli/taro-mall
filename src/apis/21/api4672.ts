// @ts-nocheck
/**
 * 红包提现到微信零钱
 * http://yapi.bwyd.com/project/21/interface/api/4672
 **/

import request from "@/service/http.ts";

/**
 * RedPacketWithdrawParam :RedPacketWithdrawParam
 */
export class IReqapi4672 {
  uuid?: string;
  userId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4672 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4672Config = (data: IReqapi4672) => ({
  url: `/red/packet/user/withdrawToWxBalance`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 红包提现到微信零钱
 **/
export default function (data: IReqapi4672 = {}): Promise<IResapi4672["data"]> {
  return request(req4672Config(...arguments));
}
