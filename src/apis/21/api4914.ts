// @ts-nocheck
/**
 * 修改店铺优惠券
 * http://yapi.bwyd.com/project/21/interface/api/4914
 **/

import request from "@/service/http.ts";

/**
 * CouponUpdateParam :CouponUpdateParam
 */
export class IReqapi4914 {
  /**
   * uuid
   */
  uuid?: string;
  /**
   * 每人限领张数
   */
  perLimit?: number;
  /**
   * 开始领取时间
   */
  startTime?: string;
  /**
   * 结束领取时间
   */
  endTime?: string;
  /**
   * 领取后失效时长，单位:分钟，默认和有优惠券有效期保持一致
   */
  duration?: number;
  /**
   * 发行数量
   */
  publishCount?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4914 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4914Config = (data: IReqapi4914) => ({
  url: `/shop/coupon/update`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改店铺优惠券
 **/
export default function (data: IReqapi4914 = {}): Promise<IResapi4914["data"]> {
  return request(req4914Config(...arguments));
}
