// @ts-nocheck
/**
 * 联系客服，获取IM用户标识
 * http://yapi.bwyd.com/project/21/interface/api/4424
 **/

import request from "@/service/http.ts";

export class IReqapi4424 {}

/**
 * Result<ImUserVo> :Result
 */
export class IResapi4424 {
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

export const req4424Config = (data: IReqapi4424) => ({
  url: `/im/service/contact`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 联系客服，获取IM用户标识
 **/
export default function (data: IReqapi4424 = {}): Promise<IResapi4424["data"]> {
  return request(req4424Config(...arguments));
}
