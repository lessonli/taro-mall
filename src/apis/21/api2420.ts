// @ts-nocheck
/**
 * 设置用户认证信息
 * http://yapi.bwyd.com/project/21/interface/api/2420
 **/

import request from "@/service/http.ts";

/**
 * UserAuthorizationSetParam :UserAuthorizationSetParam
 */
export class IReqapi2420 {
  /**
   * 用户编号
   */
  userNo?: string;
  /**
   * 真实姓名
   */
  realName?: string;
  /**
   * 身份证号
   */
  idCardNo?: string;
  /**
   * 银行卡号
   */
  bankCardNo?: string;
  /**
   * 银行名称
   */
  bankCompanyName?: string;
  /**
   * 银行预留手机号
   */
  mobile?: string;
  /**
   * 短信验证码
   */
  mtCode?: string;
  /**
   * 银行开户行
   */
  bankAddress?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2420 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2420Config = (data: IReqapi2420) => ({
  url: `/user/authorization/set`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 设置用户认证信息
 **/
export default function (data: IReqapi2420 = {}): Promise<IResapi2420["data"]> {
  return request(req2420Config(...arguments));
}
