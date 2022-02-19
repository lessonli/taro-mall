// @ts-nocheck
/**
 * 获取投诉参数配置
 * http://yapi.bwyd.com/project/21/interface/api/4764
 **/

import request from "@/service/http.ts";

export class IReqapi4764 {}

/**
 * Result<ComplainConfigVo> :Result
 */
export class IResapi4764 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ComplainConfigVo
   */
  data?: {
    /**
     * 针对商品的投诉原因 ,String
     */
    productReasons?: string[];
  };
}

export const req4764Config = (data: IReqapi4764) => ({
  url: `/complain/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取投诉参数配置
 **/
export default function (data: IReqapi4764 = {}): Promise<IResapi4764["data"]> {
  return request(req4764Config(...arguments));
}
