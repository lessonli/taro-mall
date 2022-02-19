// @ts-nocheck
/**
 * 使用余额重新支付订单
 * http://yapi.bwyd.com/project/21/interface/api/2660
 **/

import request from "@/service/http.ts";

/**
 * OrderPayParamCreateParam :OrderPayParamCreateParam
 */
export class IReqapi2660 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 选择支付方式,0->未支付；1->微信2->支付宝,3->余额,目前仅支持微信
   */
  payType?: number;
  /**
   * 余额支付的密码
   */
  payPassword?: string;
  /**
   * 来源类型
   */
  sourceType?: string;
}

/**
 * Result<OrderBalancePayVo> :Result
 */
export class IResapi2660 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderBalancePayVo
   */
  data?: {
    /**
     * 订单id
     */
    orderNo?: string;
    /**
     * 支付状态，0为待支付，1为已支付成功
     */
    payStatus?: number;
  };
}

export const req2660Config = (data: IReqapi2660) => ({
  url: `/order/rePayWithBalance`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 使用余额重新支付订单
 **/
export default function (data: IReqapi2660 = {}): Promise<IResapi2660["data"]> {
  return request(req2660Config(...arguments));
}
