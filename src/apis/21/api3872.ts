// @ts-nocheck
/**
 * 货款提现计算手续费
 * http://yapi.bwyd.com/project/21/interface/api/3872
 **/

import request from "@/service/http.ts";

/**
 * MerchantWithdrawCalcServiceFeeParam :MerchantWithdrawCalcServiceFeeParam
 */
export class IReqapi3872 {
  /**
   * 申请提现金额
   */
  withdrawAmount?: number;
}

/**
 * Result<MerchantWithdrawServiceFeeVO> :Result
 */
export class IResapi3872 {
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

export const req3872Config = (data: IReqapi3872) => ({
  url: `/merchant/withdraw/product/calc/service/fee`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 货款提现计算手续费
 **/
export default function (data: IReqapi3872 = {}): Promise<IResapi3872["data"]> {
  return request(req3872Config(...arguments));
}
