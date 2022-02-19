// @ts-nocheck
/**
 * 获取切换开关控制配置
 * http://yapi.bwyd.com/project/21/interface/api/4602
 **/

import request from "@/service/http.ts";

export class IReqapi4602 {}

/**
 * Result<SwitchControlVo> :Result
 */
export class IResapi4602 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * SwitchControlVo
   */
  data?: {
    /**
     * 是否允许充值：0-不允许1-允许
     */
    enableRecharge?: number;
    /**
     * 是否允许余额支付订单：0-不允许1-允许
     */
    enableBalancePayOrder?: number;
  };
}

export const req4602Config = (data: IReqapi4602) => ({
  url: `/config/switch`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取切换开关控制配置
 **/
export default function (data: IReqapi4602 = {}): Promise<IResapi4602["data"]> {
  return request(req4602Config(...arguments));
}
