// @ts-nocheck
/**
 * 下订单
 **/

import request from "@/service/http.ts";

/**
 * OrderCreate :OrderCreate
 */
export class IReqapi1708 {
  orderNo?: string;
  /**
   * 订单类型
   */
  orderType?: number;
  /**
   * 来源类型
   */
  sourceType?: number;
  /**
   * 优惠id
   */
  couponId?: string;
  /**
   * 关联的商品id
   */
  productId?: string;
  /**
   * 下单数量
   */
  productQuantity?: number;
  uuid?: string;
  requestId?: string;
  /**
   * (该参数为map)
   */
  feature?: {
    /**
     * String
     */
    mapKey?: {};
    /**
     * String
     */
    mapValue?: {
      hash?: number;
    };
  };
  id?: number;
  version?: number;
  gmtCreate?: string;
  gmtModify?: string;
  isDeleted?: number;
}

/**
 * Result<String> :Result
 */
export class IResapi1708 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req1708Config = (data: IReqapi1708) => ({
  url: `/order/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1708 = {}): Promise<IResapi1708["data"]> {
  return request(req1708Config(...arguments));
}
