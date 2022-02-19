// @ts-nocheck
/**
 * 货款提现配置
 * http://yapi.bwyd.com/project/21/interface/api/3866
 **/

import request from "@/service/http.ts";

export class IReqapi3866 {}

/**
 * Result<MerchantWithdrawConfigVO> :Result
 */
export class IResapi3866 {
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

export const req3866Config = (data: IReqapi3866) => ({
  url: `/merchant/withdraw/product/config`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 货款提现配置
 **/
export default function (data: IReqapi3866 = {}): Promise<IResapi3866["data"]> {
  return request(req3866Config(...arguments));
}
