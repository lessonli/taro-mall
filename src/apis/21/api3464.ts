// @ts-nocheck
/**
 * 根据运单号查询物流轨迹信息
 * http://yapi.bwyd.com/project/21/interface/api/3464
 **/

import request from "@/service/http.ts";

export class IReqapi3464 {
  /**
   * (String)
   */
  orderNo?: string | number;
}

/**
 * Result<ExpressTrackVo> :Result
 */
export class IResapi3464 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ExpressTrackVo
   */
  data?: {
    /**
     * 快递单当前状态，包括0在途，1揽收....等36个状态
     */
    state?: number;
    /**
     * 是否签收完成
     */
    signed?: boolean;
    /**
     * 物流详情信息 ,ExpressRowsDTO
     */
    rows?: {
      time?: string;
      context?: string;
    }[];
  };
}

export const req3464Config = (data: IReqapi3464) => ({
  url: `/express/tracks`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据运单号查询物流轨迹信息
 **/
export default function (data: IReqapi3464 = {}): Promise<IResapi3464["data"]> {
  return request(req3464Config(...arguments));
}
