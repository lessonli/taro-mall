// @ts-nocheck
/**
 * 获取商户资金账户信息
 * http://yapi.bwyd.com/project/21/interface/api/2476
 **/

import request from "@/service/http.ts";

export class IReqapi2476 {}

/**
 * Result<MerchantCapitalVO> :Result
 */
export class IResapi2476 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantCapitalVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 货款累计金额（累计已入账+待入账）
     */
    productTotalAmount?: number;
    /**
     * 货款可用余额（可提现）
     */
    productAvailableAmount?: number;
    /**
     * 货款冻结金额（待入账）
     */
    productFrozenAmount?: number;
    /**
     * 货款提现中金额
     */
    productWithdrawingAmount?: number;
    /**
     * 佣金累计金额（累计已入账+待入账）
     */
    commissionTotalAmount?: number;
    /**
     * 佣金可用余额（可提现）
     */
    commissionAvailableAmount?: number;
    /**
     * 佣金冻结金额（待入账）
     */
    commissionFrozenAmount?: number;
    /**
     * 佣金提现中金额
     */
    commissionWithdrawingAmount?: number;
    /**
     * 店铺保证金金额
     */
    marginShopAmount?: number;
    /**
     * 可用余额(分)
     */
    availableAmount?: number;
    /**
     * 总充值(分)
     */
    totalRechargeAmount?: number;
    /**
     * 总消费(分)
     */
    totalCostAmount?: number;
  };
}

export const req2476Config = (data: IReqapi2476) => ({
  url: `/merchant/capital/info`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商户资金账户信息
 **/
export default function (data: IReqapi2476 = {}): Promise<IResapi2476["data"]> {
  return request(req2476Config(...arguments));
}
