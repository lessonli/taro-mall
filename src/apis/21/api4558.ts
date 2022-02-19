// @ts-nocheck
/**
 * 商品置顶|取消置顶
 * http://yapi.bwyd.com/project/21/interface/api/4558
 **/

import request from "@/service/http.ts";

/**
 * ProdLiveTopFlagParam :ProdLiveTopFlagParam
 */
export class IReqapi4558 {
  /**
   * 商品id
   */
  uuid?: string;
  /**
   * 置顶状态0|1
   */
  status?: number;
  /**
   * 直播间id
   */
  roomId?: string;
  /**
   * 直播记录id
   */
  recordId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi4558 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4558Config = (data: IReqapi4558) => ({
  url: `/live/product/topFlag`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品置顶|取消置顶
 **/
export default function (data: IReqapi4558 = {}): Promise<IResapi4558["data"]> {
  return request(req4558Config(...arguments));
}
