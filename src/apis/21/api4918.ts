// @ts-nocheck
/**
 * 分页查询可领取优惠券
 * http://yapi.bwyd.com/project/21/interface/api/4918
 **/

import request from "@/service/http.ts";

export class IReqapi4918 {
  /**
   * 商品id
   */
  productId?: string | number;
  /**
   * 店铺id
   */
  merchantId?: string | number;
  /**
   * 活动id
   */
  activityId?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<CouponTakeInfoVo>> :Result
 */
export class IResapi4918 {
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
       * 优惠券id
       */
      uuid?: string;
      /**
       * 优惠券名称
       */
      name?: string;
      /**
       * 发放类型1：金额优惠2：折扣优惠,com.bwyd.marketing.enums.CouponGrantType
       */
      grantType?: number;
      /**
       * 每人限领张数
       */
      perLimit?: number;
      /**
       * 优惠券面额|优惠折扣
       */
      price?: number;
      /**
       * 使用门槛；满xxx可使用
       */
      minPoint?: number;
      /**
       * 领取后失效时长，单位:分钟，默认和有优惠券有效期保持一致
       */
      duration?: number;
      /**
       * 优惠券有效期
       */
      startTime?: string;
      /**
       * 优惠券有效期
       */
      endTime?: string;
      /**
       * 使用说明
       */
      instruction?: string;
      /**
       * 领取状态0:未领取1:已领取2:已领完
       */
      takeState?: number;
    }[];
    hasNext?: boolean;
  };
}

export const req4918Config = (data: IReqapi4918) => ({
  url: `/shop/coupon/coupons`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询可领取优惠券
 **/
export default function (data: IReqapi4918 = {}): Promise<IResapi4918["data"]> {
  return request(req4918Config(...arguments));
}
