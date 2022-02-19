// @ts-nocheck
/**
 * 分页查询用户竞拍记录
 * http://yapi.bwyd.com/project/21/interface/api/2388
 **/

import request from "@/service/http.ts";

export class IReqapi2388 {
  /**
   * 商品id
   */
  productId?: string | number;
  /**
   * 出价金额（竞拍时需要）
   */
  auctionPrice?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<AuctionRecordsVo>> :Result
 */
export class IResapi2388 {
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
       * 竞拍用户id
       */
      userId?: string;
      /**
       * 竞拍价格
       */
      auctionPrice?: number;
      /**
       * 竞拍时间
       */
      gmtCreate?: string;
      /**
       * 0:出局1:领先
       */
      status?: number;
      /**
       * 中拍用户支付订单号
       */
      orderNo?: string;
      /**
       * 出价用户信息 ,UserBaseInfoVO
       */
      userInfo?: {
        /**
         * 昵称
         */
        nickName?: string;
        /**
         * 头像
         */
        headImg?: string;
      };
    }[];
  };
}

export const req2388Config = (data: IReqapi2388) => ({
  url: `/auction/records`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户竞拍记录
 **/
export default function (data: IReqapi2388 = {}): Promise<IResapi2388["data"]> {
  return request(req2388Config(...arguments));
}
