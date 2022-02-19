// @ts-nocheck
/**
 * 获取用户资金账户信息
 * http://yapi.bwyd.com/project/21/interface/api/2116
 **/

import request from "@/service/http.ts";

export class IReqapi2116 {}

/**
 * Result<UserCapitalVO> :Result
 */
export class IResapi2116 {
  code: number;
  message: string;
  traceId: string;
  /**
   * UserCapitalVO
   */
  data: {
    /**
     * 用户编号
     */
    userNo: string;
    /**
     * 可用余额(分)
     */
    availableAmount: number;
    /**
     * 总充值(分)
     */
    totalRechargeAmount: number;
    /**
     * 总消费(分)
     */
    totalCostAmount: number;
  };
}

export const req2116Config = (data: IReqapi2116) => ({
  url: `/user/capital/info`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取用户资金账户信息
 **/
export default function (data: IReqapi2116 = {}): Promise<IResapi2116["data"]> {
  return request(req2116Config(...arguments));
}
