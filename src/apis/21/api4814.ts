// @ts-nocheck
/**
 * 用户优惠券中心
 * http://yapi.bwyd.com/project/21/interface/api/4814
 **/

import request from "@/service/http.ts";

/**
 * UserCouponParam :UserCouponParam
 */
export class IReqapi4814 {
  /**
   * 优惠券Id
   */
  couponId?: string;
  /**
   * 领取用户id,无需传入
   */
  userId?: string;
  /**
   * 使用状态,NOT_USE(0,"未使用"),,USED(1,"已使用"),,EXPIRED(2,"已过期");,com.bwyd.marketing.enums.CouponUseStatus
   */
  useStatus?: number;
  searchCount?: boolean;
  pageNo?: number;
  pageSize?: number;
  lastId?: number;
  /**
   * PageOrderItem
   */
  orderItems?: {
    column?: string;
    asc?: boolean;
  }[];
}

/**
 * Result<PaginatedData<UserCouponPageRecordVo>> :Result
 */
export class IResapi4814 {
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
       * 超过两个也只展示前两个,适用对象 ,CouponTargetVo
       */
      targets?: {
        /**
         * 目标id
         */
        targetId?: string;
        /**
         * 目标名称
         */
        targetName?: string;
      }[];
      /**
       * 去使用的链接
       */
      h5Url?: string;
      /**
       * 优惠券领取记录id
       */
      uuid?: string;
      /**
       * 优惠券id
       */
      couponId?: string;
      /**
       * 优惠券名称
       */
      couponName?: string;
      /**
       * 设备终端，多个值以逗号分隔
       */
      terminal?: string;
      /**
       * 发放来源：1:平台补贴2:商家补贴,com.bwyd.marketing.enums.CouponGrantFrom
       */
      grantFrom?: number;
      /**
       * 发放类型1：金额优惠2：折扣优惠,com.bwyd.marketing.enums.CouponGrantType
       */
      grantType?: number;
      /**
       * 使用类型：0->全场通用；1->指定商品2->指定店铺3->指定活动4->指定分类,com.bwyd.marketing.enums.CouponUseType
       */
      useType?: number;
      /**
       * 优惠券面额|优惠折扣
       */
      price?: number;
      /**
       * 使用门槛；满xxx可使用
       */
      minPoint?: number;
      /**
       * 过期时间
       */
      expireTime?: string;
      /**
       * 使用状态：0->未使用；1->已使用；2->已过期,com.bwyd.marketing.enums.CouponUseStatus
       */
      useStatus?: number;
      /**
       * 使用说明
       */
      instruction?: string;
      /**
       * 优惠券使用目标id列表 ,String
       */
      targetIds?: string[];
    }[];
    hasNext?: boolean;
  };
}

export const req4814Config = (data: IReqapi4814) => ({
  url: `/coupon/userList`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户优惠券中心
 **/
export default function (data: IReqapi4814 = {}): Promise<IResapi4814["data"]> {
  return request(req4814Config(...arguments));
}
