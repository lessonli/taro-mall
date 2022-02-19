// @ts-nocheck
/**
 * 保存用户竞拍记录
 * http://yapi.bwyd.com/project/21/interface/api/2380
 **/

import request from "@/service/http.ts";

export class IReqapi2380 {
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
 * Result<String> :Result
 */
export class IResapi2380 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req2380Config = (data: IReqapi2380) => ({
  url: `/auction/create`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 保存用户竞拍记录
 **/
export default function (data: IReqapi2380 = {}): Promise<IResapi2380["data"]> {
  return request(req2380Config(...arguments));
}
