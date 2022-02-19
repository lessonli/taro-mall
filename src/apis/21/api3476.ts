// @ts-nocheck
/**
 * 查询所有专题活动列表
 * http://yapi.bwyd.com/project/21/interface/api/3476
 **/

import request from "@/service/http.ts";

export class IReqapi3476 {}

/**
 * Result<List<ActivityInfoVo>> :Result
 */
export class IResapi3476 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ActivityInfoVo
   */
  data?: {
    /**
     * 活动uuid
     */
    uuid?: string;
    /**
     * 活动封面
     */
    icon?: string;
    /**
     * 链接地址
     */
    h5Url?: string;
    /**
     * 小程序链接地址
     */
    maUrl?: string;
    /**
     * 活动开始时间
     */
    startTime?: string;
    /**
     * 活动结束时间
     */
    endTime?: string;
  }[];
}

export const req3476Config = (data: IReqapi3476) => ({
  url: `/activity/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询所有专题活动列表
 **/
export default function (data: IReqapi3476 = {}): Promise<IResapi3476["data"]> {
  return request(req3476Config(...arguments));
}
