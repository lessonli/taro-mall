// @ts-nocheck
/**
 * 分页查询用户保证金缴纳记录
 * http://yapi.bwyd.com/project/21/interface/api/3590
 **/

import request from "@/service/http.ts";

/**
 * MarginRecordsSearch :MarginRecordsSearch
 */
export class IReqapi3590 {
  /**
   * 保证金状态,0:待支付1:已支付2:退款中3:已退款4:扣除中5:已扣除,com.bwyd.product.enums.AuctionMarginStatus ,Integer
   */
  statusList?: number[];
  /**
   * 0:普通用户缴纳保证金1:商户缴纳保证金,com.bwyd.product.enums.AuctionMarginType
   */
  marginType?: number;
  /**
   * yyyy-MM-dd
   */
  startTimeStr?: string;
  /**
   * yyyy-MM-dd
   */
  endTimeStr?: string;
  pageNo?: number;
  pageSize?: number;
  /**
   * PageOrderItem
   */
  orderItems?: {
    column?: string;
    asc?: boolean;
  }[];
}

/**
 * Result<PaginatedData<MarginRecordsVo>> :Result
 */
export class IResapi3590 {
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
       * 用户缴纳保证金额
       */
      margin?: number;
      /**
       * 0:普通用户缴纳保证金1:商户缴纳保证金,com.bwyd.product.enums.AuctionMarginType
       */
      marginType?: number;
      /**
       * 保证金缴纳状态,0:待支付 1:已支付 2:退款中 3:已退款 4:扣除中 5:已扣除
       */
      status?: number;
      /**
       * 保证金缴纳对象id
       */
      targetId?: string;
      /**
       * 保证金缴纳对象名称
       */
      targetName?: string;
      /**
       * 保证金缴纳对象icon
       */
      targetIcon?: string;
      /**
       * 创建时间
       */
      gmtCreate?: string;
    }[];
  };
}

export const req3590Config = (data: IReqapi3590) => ({
  url: `/margin/pageList`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户保证金缴纳记录
 **/
export default function (data: IReqapi3590 = {}): Promise<IResapi3590["data"]> {
  return request(req3590Config(...arguments));
}
