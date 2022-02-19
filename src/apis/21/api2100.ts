// @ts-nocheck
/**
 * 获取用户信息
 * http://yapi.bwyd.com/project/21/interface/api/2100
 **/

import request from "@/service/http.ts";

export class IReqapi2100 {}

/**
 * Result<UserInfo> :Result
 */
export class IResapi2100 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserInfo
   */
  data?: {
    /**
     * encode后的用户ID
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
     * 头像
     */
    headImg?: string;
    /**
     * 性别：0-未知1-男2-女
     */
    sex?: number;
    /**
     * 手机号
     */
    mobile?: string;
    /**
     * 出生日期
     */
    birthday?: string;
    /**
     * 用户等级：1-普粉2-专粉3-商户
     */
    userLevel?: number;
  };
}

export const req2100Config = (data: IReqapi2100) => ({
  url: `/user/info`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取用户信息
 **/
export default function (data: IReqapi2100 = {}): Promise<IResapi2100["data"]> {
  return request(req2100Config(...arguments));
}
