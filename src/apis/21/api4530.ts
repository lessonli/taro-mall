// @ts-nocheck
/**
 * 个人统计信息
 * http://yapi.bwyd.com/project/21/interface/api/4530
 **/

import request from "@/service/http.ts";

export class IReqapi4530 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<NewerActivityUserStatVo> :Result
 */
export class IResapi4530 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * NewerActivityUserStatVo
   */
  data?: {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 可用余额（可提现）
     */
    availableAmount?: number;
    /**
     * 累计活动奖励金额
     */
    totalAmount?: number;
    /**
     * 是否允许提现（今日是否可提现）：0-禁止提现1-允许提现
     */
    enableWithdraw?: number;
  };
}

export const req4530Config = (data: IReqapi4530) => ({
  url: `/activity/newer/statistics`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 个人统计信息
 **/
export default function (data: IReqapi4530 = {}): Promise<IResapi4530["data"]> {
  return request(req4530Config(...arguments));
}
