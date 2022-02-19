// @ts-nocheck
/**
 * 用户主动领取优惠券
 * http://yapi.bwyd.com/project/21/interface/api/4882
 **/

import request from "@/service/http.ts";

/**
 * CouponUserTakeParam :CouponUserTakeParam
 */
export class IReqapi4882 {
  /**
   * 请求幂等键
   */
  requestId?: string;
  /**
   * 领取优化券id
   */
  couponId?: string;
}

/**
 * Result<String> :Result
 */
export class IResapi4882 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4882Config = (data: IReqapi4882) => ({
  url: `/coupon/take`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户主动领取优惠券
 **/
export default function (data: IReqapi4882 = {}): Promise<IResapi4882["data"]> {
  return request(req4882Config(...arguments));
}
