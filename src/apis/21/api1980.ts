// @ts-nocheck
/**
 * 创建小程序专用的支付的参数
 **/

import request from "@/service/http.ts";

/**
 * OrderPayUrlCreateParam :OrderPayUrlCreateParam
 */
export class IReqapi1980 {
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
 * Result<MPPayResponse> :Result
 */
export class IResapi1980 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MPPayResponse
   */
  data?: {
    payNo?: string;
    appId?: string;
    timeStamp?: string;
    nonceStr?: string;
    packageValue?: string;
    signType?: string;
    paySign?: string;
  };
}

export const req1980Config = (data: IReqapi1980) => ({
  url: `/order/mpPayParam`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1980 = {}): Promise<IResapi1980["data"]> {
  return request(req1980Config(...arguments));
}
