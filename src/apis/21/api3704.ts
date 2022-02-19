// @ts-nocheck
/**
 * 商户个人主页查询接口
 * http://yapi.bwyd.com/project/21/interface/api/3704
 **/

import request from "@/service/http.ts";

export class IReqapi3704 {}

/**
 * Result<MerchantProfileVo> :Result
 */
export class IResapi3704 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantProfileVo
   */
  data?: {
    /**
     * 分销销售额
     */
    distributionGmv?: number;
    /**
     * 累计佣金收入（待入账+已入账）
     */
    commissionTotalAmount?: number;
    /**
     * 我的钱包：累计佣金收入+累计货款收入+可用余额
     */
    totalAvailableAmount?: number;
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

export const req3704Config = (data: IReqapi3704) => ({
  url: `/merchant/profile`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商户个人主页查询接口
 **/
export default function (data: IReqapi3704 = {}): Promise<IResapi3704["data"]> {
  return request(req3704Config(...arguments));
}
