// @ts-nocheck
/**
 * 联系卖家，获取IM用户标识
 * http://yapi.bwyd.com/project/21/interface/api/4094
 **/

import request from "@/service/http.ts";

export class IReqapi4094 {
  /**
   * (String)
   */
  merchantId?: string | number;
}

/**
 * Result<ImUserVo> :Result
 */
export class IResapi4094 {
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

export const req4094Config = (data: IReqapi4094) => ({
  url: `/im/merchant/contact`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 联系卖家，获取IM用户标识
 **/
export default function (data: IReqapi4094 = {}): Promise<IResapi4094["data"]> {
  return request(req4094Config(...arguments));
}
