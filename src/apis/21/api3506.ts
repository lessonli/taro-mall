// @ts-nocheck
/**
 * 修改商户信息
 * http://yapi.bwyd.com/project/21/interface/api/3506
 **/

import request from "@/service/http.ts";

export class IReqapi3506 {
  /**
   * 商户编号
   */
  merchantNo?: string | number;
  /**
   * 商户名称
   */
  shopName?: string | number;
  /**
   * 商户LOGO
   */
  shopLogo?: string | number;
  /**
   * 商户简介
   */
  shopIntro?: string | number;
  /**
   * 店铺地址：省
   */
  shopAddressProvince?: string | number;
  /**
   * 店铺地址：市
   */
  shopAddressCity?: string | number;
  /**
   * 店铺地址：区
   */
  shopAddressDistrict?: string | number;
}

/**
 * Result<Void> :Result
 */
export class IResapi3506 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3506Config = (data: IReqapi3506) => ({
  url: `/merchant/modify`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商户信息
 **/
export default function (data: IReqapi3506 = {}): Promise<IResapi3506["data"]> {
  return request(req3506Config(...arguments));
}
