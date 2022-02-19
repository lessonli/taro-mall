// @ts-nocheck
/**
 * 分页查询店铺优惠券信息(优惠券管理)
 * http://yapi.bwyd.com/project/21/interface/api/4930
 **/

import request from "@/service/http.ts";

/**
 * CouponShopPageParam :CouponShopPageParam
 */
export class IReqapi4930 {
  /**
   * 使用类型：0->全场通用；1->指定商品2->指定店铺3->指定活动4->指定分类,com.bwyd.marketing.enums.CouponUseType
   */
  useType?: number;
  /**
   * 优惠券发布状态列表 ,Integer
   */
  publishStatuses?: number[];
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
 * Result<PaginatedData<CouponInfoVo>> :Result
 */
export class IResapi4930 {
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
       * 优惠券领取记录id,传递数据用
       */
      recordId?: string;
      /**
       * 优惠券名称
       */
      name?: string;
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
       * 每人限领张数
       */
      perLimit?: number;
      /**
       * 优惠券面额|优惠折扣
       */
      price?: number;
      /**
       * 最高抵扣金额
       */
      maxPrice?: number;
      /**
       * 使用门槛；满xxx可使用
       */
      minPoint?: number;
      /**
       * 优惠券有效期
       */
      startTime?: string;
      /**
       * 优惠券有效期
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
       * 领取数量
       */
      receiveCount?: number;
      /**
       * 已使用数量
       */
      usedCount?: number;
      /**
       * 使用说明
       */
      instruction?: string;
      /**
       * h5链接地址
       */
      h5Url?: string;
    }[];
    hasNext?: boolean;
  };
}

export const req4930Config = (data: IReqapi4930) => ({
  url: `/shop/coupon/pageList`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询店铺优惠券信息(优惠券管理)
 **/
export default function (data: IReqapi4930 = {}): Promise<IResapi4930["data"]> {
  return request(req4930Config(...arguments));
}
