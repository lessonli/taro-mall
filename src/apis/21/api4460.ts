// @ts-nocheck
/**
 * 检查小程序审核状态
 * http://yapi.bwyd.com/project/21/interface/api/4460
 **/

import request from "@/service/http.ts";

export class IReqapi4460 {
  /**
   * (String)
   */
  version?: string | number;
}

/**
 * Result<MiniAppAuditStatusVo> :Result
 */
export class IResapi4460 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MiniAppAuditStatusVo
   */
  data?: {
    /**
     * 审核状态
     */
    auditStatus?: number;
  };
}

export const req4460Config = (data: IReqapi4460) => ({
  url: `/app/version/miniApp/auditStatus`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 检查小程序审核状态
 **/
export default function (data: IReqapi4460 = {}): Promise<IResapi4460["data"]> {
  return request(req4460Config(...arguments));
}
