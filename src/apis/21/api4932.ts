// @ts-nocheck
/**
 * 修改优惠券发放状态
 * http://yapi.bwyd.com/project/21/interface/api/4932
 **/

import request from "@/service/http.ts";

/**
 * CouponUpdateParam :CouponUpdateParam
 */
export class IReqapi4932 {
  /**
   * uuid
   */
  uuid?: string;
  /**
   * 0:停止发放1:发放中2:已结束
   */
  publishStatus?: number;
}

/**
 * Result :Result
 */
export class IResapi4932 {
  code?: number;
  message?: string;
  traceId?: string;
}

export const req4932Config = (data: IReqapi4932) => ({
  url: `/shop/coupon/update/publishStatus`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改优惠券发放状态
 **/
export default function (data: IReqapi4932 = {}): Promise<IResapi4932["data"]> {
  return request(req4932Config(...arguments));
}
