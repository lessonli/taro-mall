// @ts-nocheck
/**
 * 查询物流公司
 * http://yapi.bwyd.com/project/21/interface/api/3536
 **/

import request from "@/service/http.ts";

export class IReqapi3536 {
  /**
   * 物流公司名
   */
  companyName?: string | number;
  /**
   * 物流公司编码
   */
  companyCode?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ExpressCompanyVo>> :Result
 */
export class IResapi3536 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
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
  };
}

export const req3536Config = (data: IReqapi3536) => ({
  url: `/express/company/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询物流公司
 **/
export default function (data: IReqapi3536 = {}): Promise<IResapi3536["data"]> {
  return request(req3536Config(...arguments));
}
