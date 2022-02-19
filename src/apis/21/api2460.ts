// @ts-nocheck
/**
 * 商户配置信息
 * http://yapi.bwyd.com/project/21/interface/api/2460
 **/

import request from "@/service/http.ts";

export class IReqapi2460 {}

/**
 * Result<MerchantConfigVo> :Result
 */
export class IResapi2460 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantConfigVo
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 保证金首次缴纳最低金额
     */
    shopMarginFirstMinAmount?: number;
    /**
     * 保证金缴纳最高金额
     */
    shopMarginMaxAmount?: number;
  };
}

export const req2460Config = (data: IReqapi2460) => ({
  url: `/merchant/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商户配置信息
 **/
export default function (data: IReqapi2460 = {}): Promise<IResapi2460["data"]> {
  return request(req2460Config(...arguments));
}
