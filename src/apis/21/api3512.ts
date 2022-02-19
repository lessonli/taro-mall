// @ts-nocheck
/**
 * 修改商户信息
 * http://yapi.bwyd.com/project/21/interface/api/3512
 **/

import request from "@/service/http.ts";

/**
 * MerchantModifyParam :MerchantModifyParam
 */
export class IReqapi3512 {
  /**
   * 商户编号
   */
  merchantNo?: string;
  /**
   * 商户名称
   */
  shopName?: string;
  /**
   * 商户LOGO
   */
  shopLogo?: string;
  /**
   * 商户简介
   */
  shopIntro?: string;
  /**
   * 店铺地址：省
   */
  province?: string;
  /**
   * 店铺地址：市
   */
  city?: string;
  /**
   * 店铺地址：区
   */
  district?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi3512 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3512Config = (data: IReqapi3512) => ({
  url: `/merchant/modify`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商户信息
 **/
export default function (data: IReqapi3512 = {}): Promise<IResapi3512["data"]> {
  return request(req3512Config(...arguments));
}
