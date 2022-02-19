// @ts-nocheck
/**
 * 评价订单
 * http://yapi.bwyd.com/project/21/interface/api/1756
 **/

import request from "@/service/http.ts";

/**
 * OrderReviewParam :OrderReviewParam
 */
export class IReqapi1756 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 评价内容
   */
  content?: string;
  /**
   * 图片列表
   */
  albumPics?: string;
  /**
   * 商品质量评分
   */
  productScore?: number;
  /**
   * 服务态度评分
   */
  serviceScore?: number;
  /**
   * 物流服务评分
   */
  postageScore?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi1756 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req1756Config = (data: IReqapi1756) => ({
  url: `/order/review`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 评价订单
 **/
export default function (data: IReqapi1756 = {}): Promise<IResapi1756["data"]> {
  return request(req1756Config(...arguments));
}
