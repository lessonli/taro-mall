// @ts-nocheck
/**
 * 查询商家店铺功能配置项
 * http://yapi.bwyd.com/project/21/interface/api/4840
 **/

import request from "@/service/http.ts";

export class IReqapi4840 {}

/**
 * Result<MerFunctionConfVo> :Result
 */
export class IResapi4840 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerFunctionConfVo
   */
  data?: {
    /**
     * 运营活动配置 ,JSONArray
     */
    activity?: {};
  };
}

export const req4840Config = (data: IReqapi4840) => ({
  url: `/config/function/merchant`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询商家店铺功能配置项
 **/
export default function (data: IReqapi4840 = {}): Promise<IResapi4840["data"]> {
  return request(req4840Config(...arguments));
}
