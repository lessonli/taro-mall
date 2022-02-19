// @ts-nocheck
/**
 * 根据运单号查询匹配快递公司
 * http://yapi.bwyd.com/project/21/interface/api/3530
 **/

import request from "@/service/http.ts";

export class IReqapi3530 {
  /**
   * (String)
   */
  expressCode?: string | number;
}

/**
 * Result<List<ExpressCompanyVo>> :Result
 */
export class IResapi3530 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ExpressCompanyVo
   */
  data?: {
    /**
     * 公司名
     */
    companyName?: string;
    /**
     * 快递公司代码
     */
    companyCode?: string;
  }[];
}

export const req3530Config = (data: IReqapi3530) => ({
  url: `/express/queryCompany`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据运单号查询匹配快递公司
 **/
export default function (data: IReqapi3530 = {}): Promise<IResapi3530["data"]> {
  return request(req3530Config(...arguments));
}
