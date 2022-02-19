// @ts-nocheck
/**
 * 用户个人主页查询接口
 * http://yapi.bwyd.com/project/21/interface/api/2876
 **/

import request from "@/service/http.ts";

export class IReqapi2876 {}

/**
 * Result<UserProfileVO> :Result
 */
export class IResapi2876 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserProfileVO
   */
  data?: {
    /**
     * 关注数
     */
    followCount?: number;
    /**
     * 可用余额（分）
     */
    availableAmount?: number;
    /**
     * 参与竞拍商品数量
     */
    aucProdNum?: number;
    /**
     * 收藏商品数量
     */
    collectProdNum?: number;
    /**
     * 用户id,推送专用
     */
    userId?: string;
    /**
     * 用户编号
     */
    userNo?: string;
    /**
     * 昵称
     */
    nickName?: string;
    /**
     * 手机号
     */
    mobile?: string;
    /**
     * 头像
     */
    headImg?: string;
    /**
     * 省
     */
    province?: string;
    /**
     * 市
     */
    city?: string;
    /**
     * 性别：0-未知1-男2-女
     */
    sex?: number;
    /**
     * 创建时间
     */
    gmtCreate?: string;
    /**
     * 用户等级
     */
    userLevel?: number;
    /**
     * 最近一次登录时间
     */
    lastLoginTime?: string;
  };
}

export const req2876Config = (data: IReqapi2876) => ({
  url: `/user/profile`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户个人主页查询接口
 **/
export default function (data: IReqapi2876 = {}): Promise<IResapi2876["data"]> {
  return request(req2876Config(...arguments));
}
