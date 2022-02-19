// @ts-nocheck
/**
 * 是否开放优惠券模块
 * http://yapi.bwyd.com/project/21/interface/api/4816
 **/

import request from "@/service/http.ts";

export class IReqapi4816 {}

/**
 * Result<Integer> :Result
 */
export class IResapi4816 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4816Config = (data: IReqapi4816) => ({
  url: `/coupon/isSupport`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 是否开放优惠券模块
 **/
export default function (data: IReqapi4816 = {}): Promise<IResapi4816["data"]> {
  return request(req4816Config(...arguments));
}
