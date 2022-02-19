// @ts-nocheck
/**
 * 提现成功列表
 * http://yapi.bwyd.com/project/21/interface/api/4538
 **/

import request from "@/service/http.ts";

export class IReqapi4538 {}

/**
 * Result<List<NewerActivityWithdrawnVo>> :Result
 */
export class IResapi4538 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * NewerActivityWithdrawnVo
   */
  data?: {
    /**
     * 提现金额
     */
    withdrawAmount?: number;
    /**
     * 用户编号
     */
    userNo?: string;
    /**
     * 昵称
     */
    nickName?: string;
    /**
     * 头像
     */
    headImg?: string;
  }[];
}

export const req4538Config = (data: IReqapi4538) => ({
  url: `/activity/newer/withdraw/success/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 提现成功列表
 **/
export default function (data: IReqapi4538 = {}): Promise<IResapi4538["data"]> {
  return request(req4538Config(...arguments));
}
