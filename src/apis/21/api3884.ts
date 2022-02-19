// @ts-nocheck
/**
 * 佣金提现配置
 * http://yapi.bwyd.com/project/21/interface/api/3884
 **/

import request from "@/service/http.ts";

export class IReqapi3884 {}

/**
 * Result<MerchantWithdrawConfigVO> :Result
 */
export class IResapi3884 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantWithdrawConfigVO
   */
  data?: {
    /**
     * 提现限制最小值
     */
    withdrawLimitMin?: number;
    /**
     * 提现限制最大值
     */
    withdrawLimitMax?: number;
    /**
     * 提现说明
     */
    withdrawIntro?: string;
    /**
     * 是否允许提现：0-不允许1-允许
     */
    enableWithdraw?: number;
    /**
     * 银行卡编号
     */
    bankCardNo?: string;
  };
}

export const req3884Config = (data: IReqapi3884) => ({
  url: `/merchant/withdraw/commission/config`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 佣金提现配置
 **/
export default function (data: IReqapi3884 = {}): Promise<IResapi3884["data"]> {
  return request(req3884Config(...arguments));
}
