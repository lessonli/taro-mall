// @ts-nocheck
/**
 * 创建支付的链接
 **/

import request from "@/service/http.ts";

/**
 * OrderPayUrlCreateParam :OrderPayUrlCreateParam
 */
export class IReqapi1716 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 选择支付方式,0->未支付；1->支付宝；2->微信3->余额支付
   */
  payType?: number;
  /**
   * 请求的id
   */
  requestId?: string;
  /**
   * 用户id
   */
  loginUserId?: string;
  /**
   * 商户id
   */
  loginMerchantId?: string;
  pageNo?: number;
  pageSize?: number;
  /**
   * PageOrderItem
   */
  orderItems?: {
    column?: string;
    asc?: boolean;
  }[];
}

/**
 * Result<String> :Result
 */
export class IResapi1716 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req1716Config = (data: IReqapi1716) => ({
  url: `/order/createPayUrl`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1716 = {}): Promise<IResapi1716["data"]> {
  return request(req1716Config(...arguments));
}
