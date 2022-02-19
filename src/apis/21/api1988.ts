// @ts-nocheck
/**
 * 创建小程序专用的支付的参数
 **/

import request from "@/service/http.ts";

/**
 * OrderPayUrlCreateParam :OrderPayUrlCreateParam
 */
export class IReqapi1988 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 选择支付方式,0->未支付；1->微信2->支付宝
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
 * Result<NativePayResponse> :Result
 */
export class IResapi1988 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * NativePayResponse
   */
  data?: {
    payNo?: string;
    codeUrl?: string;
  };
}

export const req1988Config = (data: IReqapi1988) => ({
  url: `/order/nativePayParam`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1988 = {}): Promise<IResapi1988["data"]> {
  return request(req1988Config(...arguments));
}
