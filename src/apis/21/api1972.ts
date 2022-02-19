// @ts-nocheck
/**
 * 创建app专用的支付的参数
 **/

import request from "@/service/http.ts";

/**
 * OrderPayUrlCreateParam :OrderPayUrlCreateParam
 */
export class IReqapi1972 {
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
 * Result<AppPayResponse> :Result
 */
export class IResapi1972 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * AppPayResponse
   */
  data?: {
    payNo?: string;
    sign?: string;
    prepayId?: string;
    partnerId?: string;
    appId?: string;
    packageValue?: string;
    timeStamp?: string;
    nonceStr?: string;
  };
}

export const req1972Config = (data: IReqapi1972) => ({
  url: `/order/appPayParam`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1972 = {}): Promise<IResapi1972["data"]> {
  return request(req1972Config(...arguments));
}
