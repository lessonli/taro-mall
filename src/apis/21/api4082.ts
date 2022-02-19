// @ts-nocheck
/**
 * IM登录标识、个推登录标识
 * http://yapi.bwyd.com/project/21/interface/api/4082
 **/

import request from "@/service/http.ts";

export class IReqapi4082 {}

/**
 * Result<ImUserVo> :Result
 */
export class IResapi4082 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ImUserVo
   */
  data?: {
    /**
     * 用户标识，IM登录、推送
     */
    identifier?: string;
    /**
     * IM即时通讯sign值
     */
    imSign?: string;
  };
}

export const req4082Config = (data: IReqapi4082) => ({
  url: `/im/identify`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * IM登录标识、个推登录标识
 **/
export default function (data: IReqapi4082 = {}): Promise<IResapi4082["data"]> {
  return request(req4082Config(...arguments));
}
