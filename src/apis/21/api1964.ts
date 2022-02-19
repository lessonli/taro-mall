// @ts-nocheck
/**
 * 创建h5专用的支付的参数
 **/

import request from "@/service/http.ts";

/**
 * OrderPayUrlCreateParam :OrderPayUrlCreateParam
 */
export class IReqapi1964 {
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
 * Result<H5PayResponse> :Result
 */
export class IResapi1964 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * H5PayResponse
   */
  data?: {
    /**
     * 付款单编号
     */
    payNo?: string;
    /**
     * 支付链接
     */
    mwebUrl?: string;
  };
}

export const req1964Config = (data: IReqapi1964) => ({
  url: `/order/h5PayParam`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1964 = {}): Promise<IResapi1964["data"]> {
  return request(req1964Config(...arguments));
}
