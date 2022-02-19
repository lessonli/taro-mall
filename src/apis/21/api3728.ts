// @ts-nocheck
/**
 * 查询用户可用余额账单
 * http://yapi.bwyd.com/project/21/interface/api/3728
 **/

import request from "@/service/http.ts";

export class IReqapi3728 {
  /**
   * 用户编号
   */
  userNo?: string | number;
  /**
   * 类型：1-收入2-支出
   */
  type?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<UserAvailableBillVO>> :Result
 */
export class IResapi3728 {
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
       * 交易流水编号
       */
      tradeStreamNo?: string;
      /**
       * 用户编号
       */
      userNo?: string;
      /**
       * 标题
       */
      title?: string;
      /**
       * 用户账单类型：1-订单
       */
      userBillType?: number;
      /**
       * 交易金额（分）
       */
      tradeAmount?: number;
      /**
       * 金额符号：1-正-1-负,@seecom.bwyd.trade.enums.SignType
       */
      amountSign?: number;
      /**
       * 订单编号（不同交易类型有不同的含义）
       */
      orderNo?: string;
      /**
       * 备注
       */
      remark?: string;
      /**
       * 显示时间
       */
      gmtCreate?: string;
    }[];
  };
}

export const req3728Config = (data: IReqapi3728) => ({
  url: `/user/capital/available/bill`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询用户可用余额账单
 **/
export default function (data: IReqapi3728 = {}): Promise<IResapi3728["data"]> {
  return request(req3728Config(...arguments));
}
