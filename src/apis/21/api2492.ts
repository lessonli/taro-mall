// @ts-nocheck
/**
 * 首页广告轮播
 **/

import request from "@/service/http.ts";

export class IReqapi2492 {}

/**
 * Result<List<AdvertiseVo>> :Result
 */
export class IResapi2492 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * AdvertiseVo
   */
  data?: {
    /**
     * 广告位图片
     */
    pic?: string;
    /**
     * 链接地址
     */
    url?: string;
  }[];
}

export const req2492Config = (data: IReqapi2492) => ({
  url: `/advertise/index`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2492 = {}): Promise<IResapi2492["data"]> {
  return request(req2492Config(...arguments));
}
