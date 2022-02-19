// @ts-nocheck
/**
 * 分页查询拍品竞拍记录
 * http://yapi.bwyd.com/project/21/interface/api/3128
 **/

import request from "@/service/http.ts";

export class IReqapi3128 {
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
 * Result<PaginatedData<ProdAucRecordsVo>> :Result
 */
export class IResapi3128 {
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
       * 竞拍价格
       */
      auctionPrice?: number;
      /**
       * 0:出局1:领先
       */
      auctionStatus?: number;
      /**
       * 竞拍时间
       */
      gmtCreate?: string;
      /**
       * 出价用户信息 ,UserBaseInfoVo
       */
      userInfo?: {
        /**
         * 用户编号
         */
        userNo?: string;
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

export const req3128Config = (data: IReqapi3128) => ({
  url: `/auction/records`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询拍品竞拍记录
 **/
export default function (data: IReqapi3128 = {}): Promise<IResapi3128["data"]> {
  return request(req3128Config(...arguments));
}
