// @ts-nocheck
/**
 * 物流轨迹信息订阅回调
 * http://yapi.bwyd.com/project/21/interface/api/3470
 **/

import request from "@/service/http.ts";

export class IReqapi3470 {}

/**
 * ExpressRespVo :ExpressRespVo
 */
export class IResapi3470 {
  /**
   * true|false;
   */
  result?: string;
  /**
   * 200|500
   */
  returnCode?: string;
}

export const req3470Config = (data: IReqapi3470) => ({
  url: `/express/callback`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 物流轨迹信息订阅回调
 **/
export default function (data: IReqapi3470 = {}): Promise<IResapi3470["data"]> {
  return request(req3470Config(...arguments));
}
