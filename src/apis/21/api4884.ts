// @ts-nocheck
/**
 * 用户优惠券统计
 * http://yapi.bwyd.com/project/21/interface/api/4884
 **/

import request from "@/service/http.ts";

export class IReqapi4884 {
  /**
   * 优惠券Id
   */
  couponId?: string | number;
  /**
   * 领取用户id,无需传入
   */
  userId?: string | number;
  /**
   * 使用状态,NOT_USE(0,"未使用"),,USED(1,"已使用"),,EXPIRED(2,"已过期");,com.bwyd.marketing.enums.CouponUseStatus
   */
  useStatus?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<UserCouponCountVo> :Result
 */
export class IResapi4884 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserCouponCountVo
   */
  data?: {
    /**
     * 未使用数量
     */
    notUseCount?: number;
    /**
     * 已使用数量
     */
    usedCount?: number;
    /**
     * 已过期数量
     */
    expiredCount?: number;
    /**
     * 用户优惠券总数
     */
    totalCount?: number;
  };
}

export const req4884Config = (data: IReqapi4884) => ({
  url: `/coupon/userCount`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户优惠券统计
 **/
export default function (data: IReqapi4884 = {}): Promise<IResapi4884["data"]> {
  return request(req4884Config(...arguments));
}
