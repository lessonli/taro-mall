// @ts-nocheck
/**
 * 提现记录
 * http://yapi.bwyd.com/project/21/interface/api/4536
 **/

import request from "@/service/http.ts";

export class IReqapi4536 {
  /**
   * 活动ID
   */
  uuid?: string | number;
  /**
   * 用户ID，前端无需传
   */
  userId?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<NewerActivityWithdrawVo>> :Result
 */
export class IResapi4536 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 提现记录ID
       */
      uuid?: string;
      /**
       * 提现账户：1-余额2-佣金
       */
      withdrawAccount?: number;
      /**
       * 提现金额
       */
      withdrawAmount?: number;
      /**
       * 申请提现时间
       */
      gmtCreate?: string;
      /**
       * 提现审核状态：1-待审核2-审核通过3-审核拒绝
       */
      auditStatus?: number;
    }[];
  };
}

export const req4536Config = (data: IReqapi4536) => ({
  url: `/activity/newer/withdraw/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 提现记录
 **/
export default function (data: IReqapi4536 = {}): Promise<IResapi4536["data"]> {
  return request(req4536Config(...arguments));
}
