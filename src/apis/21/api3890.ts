// @ts-nocheck
/**
 * 佣金提现计算手续费
 * http://yapi.bwyd.com/project/21/interface/api/3890
 **/

import request from "@/service/http.ts";

/**
 * MerchantWithdrawCalcServiceFeeParam :MerchantWithdrawCalcServiceFeeParam
 */
export class IReqapi3890 {
  /**
   * 申请提现金额
   */
  withdrawAmount?: number;
}

/**
 * Result<MerchantWithdrawServiceFeeVO> :Result
 */
export class IResapi3890 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantWithdrawServiceFeeVO
   */
  data?: {
    /**
     * 提现金额
     */
    withdrawAmount?: number;
    /**
     * 服务费
     */
    serviceFee?: number;
  };
}

export const req3890Config = (data: IReqapi3890) => ({
  url: `/merchant/withdraw/commission/calc/service/fee`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 佣金提现计算手续费
 **/
export default function (data: IReqapi3890 = {}): Promise<IResapi3890["data"]> {
  return request(req3890Config(...arguments));
}
