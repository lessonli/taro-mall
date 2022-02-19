// @ts-nocheck
/**
 * 直播间派单功能
 * http://yapi.bwyd.com/project/21/interface/api/4556
 **/

import request from "@/service/http.ts";

/**
 * ProdLiveOrderParam :ProdLiveOrderParam
 */
export class IReqapi4556 {
  /**
   * 请求幂等键id
   */
  requestId?: string;
  /**
   * IM用户标识
   */
  identifier?: string;
  /**
   * 商品名称
   */
  prodName?: string;
  /**
   * 商品价格
   */
  prodPrice?: number;
  /**
   * 商品图片
   */
  albumPics?: string;
  /**
   * 商品数量，默认值为1
   */
  quantity?: number;
  /**
   * 业务类型，0->商品，1->补差价
   */
  bizType?: number;
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
 * Result<String> :Result
 */
export class IResapi4556 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4556Config = (data: IReqapi4556) => ({
  url: `/live/product/assignOrder`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 直播间派单功能
 **/
export default function (data: IReqapi4556 = {}): Promise<IResapi4556["data"]> {
  return request(req4556Config(...arguments));
}
