// @ts-nocheck
/**
 * 微信小程序绑定手机号
 * http://yapi.bwyd.com/project/21/interface/api/2924
 **/

import request from "@/service/http.ts";

/**
 * WxMiniAppBindMobileParam :WxMiniAppBindMobileParam
 */
export class IReqapi2924 {
  /**
   * 微信号ID
   */
  appId?: string;
  /**
   * 授权码
   */
  code?: string;
  /**
   * 加密的手机号信息
   */
  encryptedData?: string;
  /**
   * iv
   */
  iv?: string;
  token?: string;
  channelNo?: string;
  /**
   * 活动ID
   */
  activityId?: string;
  /**
   * 邀请用户ID
   */
  inviteUserId?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2924 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2924Config = (data: IReqapi2924) => ({
  url: `/auth/wx/ma/bind/mobile`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 微信小程序绑定手机号
 **/
export default function (data: IReqapi2924 = {}): Promise<IResapi2924["data"]> {
  return request(req2924Config(...arguments));
}
