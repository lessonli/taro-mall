// @ts-nocheck
/**
 * 商户货款账单列表
 * http://yapi.bwyd.com/project/21/interface/api/3812
 **/

import request from "@/service/http.ts";

export class IReqapi3812 {
  /**
   * 商户编号
   */
  merchantNo?: string | number;
  /**
   * 类型：1-收入2-支出3-退款
   */
  type?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<MerchantProductBillVO>> :Result
 */
export class IResapi3812 {
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
      /**
       * 订单编号
       */
      orderNo?: string;
      /**
       * 用户支付金额
       */
      userPayAmount?: number;
      /**
       * 佣金金额
       */
      commissionAmount?: number;
      /**
       * 佣金率，万分位（例：10%，值为1000）
       */
      commissionRate?: number;
      /**
       * 服务费
       */
      serviceFee?: number;
      /**
       * 服务费率
       */
      serviceFeeRate?: number;
      /**
       * 到账金额
       */
      actualAmount?: number;
    }[];
  };
}

export const req3812Config = (data: IReqapi3812) => ({
  url: `/merchant/capital/product/bill/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商户货款账单列表
 **/
export default function (data: IReqapi3812 = {}): Promise<IResapi3812["data"]> {
  return request(req3812Config(...arguments));
}
