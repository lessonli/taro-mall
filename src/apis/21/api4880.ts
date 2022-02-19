// @ts-nocheck
/**
 * 根据专题活动id查询优惠券信息
 * http://yapi.bwyd.com/project/21/interface/api/4880
 **/

import request from "@/service/http.ts";

export class IReqapi4880 {
  /**
   * 活动id
   */
  activityId?: string | number;
}

/**
 * Result<List<ActivityCouponVo>> :Result
 */
export class IResapi4880 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ActivityCouponVo
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
     * 发放类型1：金额优惠 2：折扣优惠,com.bwyd.marketing.enums.CouponGrantType
     */
    grantType?: number;
    /**
     * 优惠券面额|优惠折扣
     */
    price?: number;
    /**
     * 使用门槛；满xxx可使用
     */
    minPoint?: number;
    /**
     * 使用说明
     */
    instruction?: string;
    /**
     * 领取状态0:未领取1:已领取 2:已领完
     */
    takeState?: number;
  }[];
}

export const req4880Config = (data: IReqapi4880) => ({
  url: `/activity/coupons`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据专题活动id查询优惠券信息
 **/
export default function (data: IReqapi4880 = {}): Promise<IResapi4880["data"]> {
  return request(req4880Config(...arguments));
}
