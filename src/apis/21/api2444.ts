// @ts-nocheck
/**
 * 获取商户信息
 * http://yapi.bwyd.com/project/21/interface/api/2444
 **/

import request from "@/service/http.ts";

export class IReqapi2444 {}

/**
 * Result<MerchantDetailInfoVo> :Result
 */
export class IResapi2444 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantDetailInfoVo
   */
  data?: {
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
     * 店铺简介
     */
    shopIntro?: string;
    /**
     * 店铺认证标识：1-店铺认证 ,Integer
     */
    shopAuthTags?: number[];
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
    /**
     * 认证状态：0-未认证1-认证中（待审核）2-已认证,,@seecom.bwyd.user.enums.MerchantAuthStatus
     */
    authStatus?: number;
    /**
     * 渠道编号（邀请码）
     */
    channelNo?: string;
    /**
     * 开店时间
     */
    gmtCreate?: string;
    /**
     * 商户等级：1-金牌2-钻石3-服务商
     */
    merchantLevel?: number;
    /**
     * 店铺背景图
     */
    backgroundImg?: string;
  };
}

export const req2444Config = (data: IReqapi2444) => ({
  url: `/merchant/info`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取商户信息
 **/
export default function (data: IReqapi2444 = {}): Promise<IResapi2444["data"]> {
  return request(req2444Config(...arguments));
}
