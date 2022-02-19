// @ts-nocheck
/**
 * 货款提现申请
 * http://yapi.bwyd.com/project/21/interface/api/3878
 **/

import request from "@/service/http.ts";

/**
 * MerchantWithdrawSubmitParam :MerchantWithdrawSubmitParam
 */
export class IReqapi3878 {
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
export class IResapi3878 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3878Config = (data: IReqapi3878) => ({
  url: `/merchant/withdraw/product/submit`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 货款提现申请
 **/
export default function (data: IReqapi3878 = {}): Promise<IResapi3878["data"]> {
  return request(req3878Config(...arguments));
}
