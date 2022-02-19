// @ts-nocheck
/**
 * 联系买家，获取Im用户标识
 * http://yapi.bwyd.com/project/21/interface/api/4088
 **/

import request from "@/service/http.ts";

export class IReqapi4088 {
  /**
   * (String)
   */
  userId?: string | number;
}

/**
 * Result<ImUserVo> :Result
 */
export class IResapi4088 {
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

export const req4088Config = (data: IReqapi4088) => ({
  url: `/im/buyer/contact`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 联系买家，获取Im用户标识
 **/
export default function (data: IReqapi4088 = {}): Promise<IResapi4088["data"]> {
  return request(req4088Config(...arguments));
}
