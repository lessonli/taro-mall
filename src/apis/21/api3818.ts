// @ts-nocheck
/**
 * 商户佣金账单列表
 * http://yapi.bwyd.com/project/21/interface/api/3818
 **/

import request from "@/service/http.ts";

export class IReqapi3818 {
  /**
   * 商户编号
   */
  merchantNo?: string | number;
  /**
   * 类型：1-收入2-支出3-退款
   */
  type?: string | number;
}

/**
 * Result<PaginatedData<MerchantCommissionBillVO>> :Result
 */
export class IResapi3818 {
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
       * 流水编号
       */
      tradeStreamNo?: string;
      /**
       * 标题
       */
      title?: string;
      /**
       * 商户账单类型：1-订单货款10-提现
       */
      merchantBillType?: number;
      /**
       * 账单状态：1-待入账（提现的待入账为提现中）2-已入账3-已退款
       */
      billStatus?: number;
      /**
       * 符号：-1表示负号，1表示正号
       */
      amountSign?: number;
      /**
       * 交易金额（分）
       */
      tradeAmount?: number;
      /**
       * 交易时间
       */
      gmtCreate?: string;
    }[];
  };
}

export const req3818Config = (data: IReqapi3818) => ({
  url: `/merchant/capital/commission/bill/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商户佣金账单列表
 **/
export default function (data: IReqapi3818 = {}): Promise<IResapi3818["data"]> {
  return request(req3818Config(...arguments));
}
