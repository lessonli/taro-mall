// @ts-nocheck
/**
 * 佣金提现申请
 * http://yapi.bwyd.com/project/21/interface/api/3896
 **/

import request from "@/service/http.ts";

/**
 * MerchantWithdrawSubmitParam :MerchantWithdrawSubmitParam
 */
export class IReqapi3896 {
  /**
   * 申请提现金额
   */
  withdrawAmount?: number;
  /**
   * 支付密码
   */
  payPassword?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi3896 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3896Config = (data: IReqapi3896) => ({
  url: `/merchant/withdraw/commission/submit`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 佣金提现申请
 **/
export default function (data: IReqapi3896 = {}): Promise<IResapi3896["data"]> {
  return request(req3896Config(...arguments));
}
