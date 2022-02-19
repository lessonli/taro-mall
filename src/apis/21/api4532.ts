// @ts-nocheck
/**
 * 申请提现
 * http://yapi.bwyd.com/project/21/interface/api/4532
 **/

import request from "@/service/http.ts";

/**
 * NewerActivitySubmitWithdrawParam :NewerActivitySubmitWithdrawParam
 */
export class IReqapi4532 {
  /**
   * 活动ID
   */
  activityId?: string;
  /**
   * 用户ID，前端无需传
   */
  userId?: string;
  /**
   * 提现金额
   */
  withdrawAmount?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4532 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4532Config = (data: IReqapi4532) => ({
  url: `/activity/newer/withdraw/submit`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 申请提现
 **/
export default function (data: IReqapi4532 = {}): Promise<IResapi4532["data"]> {
  return request(req4532Config(...arguments));
}
