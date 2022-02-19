// @ts-nocheck
/**
 * 修改商品上下架状态
 * http://yapi.bwyd.com/project/21/interface/api/4486
 **/

import request from "@/service/http.ts";

/**
 * ProdLivePublishParam :ProdLivePublishParam
 */
export class IReqapi4486 {
  /**
   * 商品id
   */
  uuid?: string;
  /**
   * 上下架0|1
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
 * Result<Integer> :Result
 */
export class IResapi4486 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4486Config = (data: IReqapi4486) => ({
  url: `/live/product/publish`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商品上下架状态
 **/
export default function (data: IReqapi4486 = {}): Promise<IResapi4486["data"]> {
  return request(req4486Config(...arguments));
}
