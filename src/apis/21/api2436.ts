// @ts-nocheck
/**
 * 设置商家个人认证信息
 * http://yapi.bwyd.com/project/21/interface/api/2436
 **/

import request from "@/service/http.ts";

/**
 * MerchantAuthorizationSetParam :MerchantAuthorizationSetParam
 */
export class IReqapi2436 {
  /**
   * 商户编号
   */
  merchantNo?: string;
  /**
   * 店铺名称
   */
  shopName?: string;
  /**
   * 店铺LOGO
   */
  shopLogo?: string;
  /**
   * 店铺介绍
   */
  shopIntro?: string;
  /**
   * 身份证正面图片
   */
  idCardFront?: string;
  /**
   * 身份证反面图片
   */
  idCardBack?: string;
  /**
   * 手持身份证图片
   */
  idCardHand?: string;
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
export class IResapi2436 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2436Config = (data: IReqapi2436) => ({
  url: `/merchant/authorization/personal/set`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 设置商家个人认证信息
 **/
export default function (data: IReqapi2436 = {}): Promise<IResapi2436["data"]> {
  return request(req2436Config(...arguments));
}
