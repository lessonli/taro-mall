// @ts-nocheck
/**
 * 创建店铺优惠券
 * http://yapi.bwyd.com/project/21/interface/api/4912
 **/

import request from "@/service/http.ts";

/**
 * CouponCreateParam :CouponCreateParam
 */
export class IReqapi4912 {
  /**
   * uuid
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
   * 优惠券面额
   */
  price?: number;
  /**
   * 最高抵扣金额,值为空时不限制
   */
  maxPrice?: number;
  /**
   * 每人限领张数
   */
  perLimit?: number;
  /**
   * 使用门槛；满xxx可使用
   */
  minPoint?: number;
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
   * 0:停止发放1:发放中2:已结束
   */
  publishStatus?: number;
  /**
   * 发行数量
   */
  publishCount?: number;
  /**
   * 商户id
   */
  merchantId?: string;
  /**
   * 优惠券使用说明
   */
  instruction?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4912 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4912Config = (data: IReqapi4912) => ({
  url: `/shop/coupon/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 创建店铺优惠券
 **/
export default function (data: IReqapi4912 = {}): Promise<IResapi4912["data"]> {
  return request(req4912Config(...arguments));
}
