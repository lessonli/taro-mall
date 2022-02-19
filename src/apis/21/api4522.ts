// @ts-nocheck
/**
 * 查询直播间各商品数量
 * http://yapi.bwyd.com/project/21/interface/api/4522
 **/

import request from "@/service/http.ts";

export class IReqapi4522 {
  /**
   * 直播间id
   */
  roomId?: string | number;
  /**
   * 直播记录id
   */
  recordId?: string | number;
}

/**
 * Result<ProdLiveNumVo> :Result
 */
export class IResapi4522 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdLiveNumVo
   */
  data?: {
    /**
     * 拍卖商品数量
     */
    aucNum?: number;
    /**
     * 秒杀商品数量
     */
    secKill?: number;
    /**
     * 下架商品数量
     */
    soldOutNum?: number;
  };
}

export const req4522Config = (data: IReqapi4522) => ({
  url: `/live/product/prodNum`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询直播间各商品数量
 **/
export default function (data: IReqapi4522 = {}): Promise<IResapi4522["data"]> {
  return request(req4522Config(...arguments));
}
