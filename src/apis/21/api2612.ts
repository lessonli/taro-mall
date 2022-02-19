// @ts-nocheck
/**
 * 根据商户id获取店铺详情
 * http://yapi.bwyd.com/project/21/interface/api/2612
 **/

import request from "@/service/http.ts";

export class IReqapi2612 {
  /**
   * (String)
   */
  merchantId?: string | number;
}

/**
 * Result<MerchantShopVo> :Result
 */
export class IResapi2612 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantShopVo
   */
  data?: {
    /**
     * 上架商品数量
     */
    productNum?: number;
    /**
     * 关注粉丝数量
     */
    fansNum?: number;
    /**
     * 店铺保证金金额
     */
    marginShopAmount?: number;
    /**
     * 商品评论统计 ,CommentStatisticVo
     */
    comments?: {
      /**
       * 总评论次数
       */
      totalNum?: number;
      /**
       * 差评次数
       */
      badNum?: number;
      /**
       * 中评次数
       */
      middleNum?: number;
      /**
       * 好评次数
       */
      goodNum?: number;
      /**
       * 好评率
       */
      goodRate?: number;
      /**
       * 平均评分
       */
      avgScore?: number;
    };
    /**
     * 关注状态：0-未关注1-已关注
     */
    followStatus?: number;
    /**
     * 认证状态：0-未认证1-认证中（待审核）2-已认证,,@seecom.bwyd.user.enums.MerchantAuthStatus
     */
    authStatus?: number;
    /**
     * 该店铺是否是自己的店：0-不是1-是
     */
    isOwnShop?: number;
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

export const req2612Config = (data: IReqapi2612) => ({
  url: `/merchant/shopInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据商户id获取店铺详情
 **/
export default function (data: IReqapi2612 = {}): Promise<IResapi2612["data"]> {
  return request(req2612Config(...arguments));
}
