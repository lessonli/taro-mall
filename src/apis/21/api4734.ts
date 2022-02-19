// @ts-nocheck
/**
 * 保存用户竞拍记录(V2)
 * http://yapi.bwyd.com/project/21/interface/api/4734
 **/

import request from "@/service/http.ts";

export class IReqapi4734 {
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
 * Result<ProdAucResultVo> :Result
 */
export class IResapi4734 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdAucResultVo
   */
  data?: {
    /**
     * 出价记录id
     */
    recordId?: string;
    /**
     * 最新出价
     */
    lastAucPrice?: number;
    /**
     * 竞拍结束时间
     */
    endTime?: string;
  };
}

export const req4734Config = (data: IReqapi4734) => ({
  url: `/auction/create/v2`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 保存用户竞拍记录(V2)
 **/
export default function (data: IReqapi4734 = {}): Promise<IResapi4734["data"]> {
  return request(req4734Config(...arguments));
}
