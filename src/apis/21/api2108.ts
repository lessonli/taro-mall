// @ts-nocheck
/**
 * 用户状态
 * http://yapi.bwyd.com/project/21/interface/api/2108
 **/

import request from "@/service/http.ts";

export class IReqapi2108 {}

/**
 * Result<UserStatusVo> :Result
 */
export class IResapi2108 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserStatusVo
   */
  data?: {
    /**
     * 认证状态：0-未认证1-认证中2-已认证
     */
    authStatus?: number;
    /**
     * 支付密码状态：0-未设置1-已设置
     */
    payPasswordStatus?: number;
    /**
     * 手机号状态：0-未设置1-已设置
     */
    mobileStatus?: number;
    /**
     * 微信授权状态：0-未授权1-已授权
     */
    wxAuthStatus?: number;
    /**
     * 启用状态：0-禁用1-启用
     */
    enable?: number;
    /**
     * 下单状态：0-未下过单1-下过单
     */
    buyOrderStatus?: number;
    /**
     * 是否需要刷新用户信息：0-不需要1-需要
     */
    needRefreshUserInfo?: number;
  };
}

export const req2108Config = (data: IReqapi2108) => ({
  url: `/user/status`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户状态
 **/
export default function (data: IReqapi2108 = {}): Promise<IResapi2108["data"]> {
  return request(req2108Config(...arguments));
}
