// @ts-nocheck
/**
 * 修改用户信息
 * http://yapi.bwyd.com/project/21/interface/api/3002
 **/

import request from "@/service/http.ts";

/**
 * ModifyUserInfoParam :ModifyUserInfoParam
 */
export class IReqapi3002 {
  /**
   * 用户编号（前端不需要传，后端自取）
   */
  userNo?: string;
  /**
   * 生日
   */
  birthday?: string;
  /**
   * 昵称
   */
  nickName?: string;
  /**
   * 头像
   */
  headImg?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi3002 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req3002Config = (data: IReqapi3002) => ({
  url: `/user/modify`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改用户信息
 **/
export default function (data: IReqapi3002 = {}): Promise<IResapi3002["data"]> {
  return request(req3002Config(...arguments));
}
