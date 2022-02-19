// @ts-nocheck
/**
 * 分页查询用户保证金缴纳记录
 * http://yapi.bwyd.com/project/21/interface/api/2990
 **/

import request from "@/service/http.ts";

export class IReqapi290 {
  /**
   * 保证金状态,0:待支付1:已支付2:退款中3:已退款4:扣除中5:已扣除,com.bwyd.product.enums.AuctionMarginStatus
   */
  statusList?: string | number;
  /**
   * 0:普通用户缴纳保证金1:商户缴纳保证金,com.bwyd.product.enums.AuctionMarginType
   */
  marginType?: string | number;
  startTimeStr?: string | number;
  endTimeStr?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<MarginRecordsVo>> :Result
 */
export class IResapi2990 {
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
       * 保证金缴纳状态,,@seecom.bwyd.product.enums.AuctionMarginStatus
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

export const req2990Config = (data: IReqapi2990) => ({
  url: `/margin/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户保证金缴纳记录
 **/
export default function (data: IReqapi2990 = {}): Promise<IResapi2990["data"]> {
  return request(req2990Config(...arguments));
}
