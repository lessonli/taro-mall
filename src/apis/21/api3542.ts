// @ts-nocheck
/**
 * 获取退货地址
 * http://yapi.bwyd.com/project/21/interface/api/3542
 **/

import request from "@/service/http.ts";

export class IReqapi3542 {}

/**
 * Result<MerchantAddressVO> :Result
 */
export class IResapi3542 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantAddressVO
   */
  data?: {
    /**
     * 省份
     */
    province?: string;
    /**
     * 城市
     */
    city?: string;
    /**
     * 区域
     */
    district?: string;
    /**
     * 详细地址
     */
    detailAddress?: string;
    /**
     * 邮编
     */
    postCode?: string;
    /**
     * 手机号
     */
    mobile?: string;
    /**
     * 收件人姓名
     */
    name?: string;
    /**
     * 商户编号
     */
    merchantNo?: string;
  };
}

export const req3542Config = (data: IReqapi3542) => ({
  url: `/merchant/address/return/get`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取退货地址
 **/
export default function (data: IReqapi3542 = {}): Promise<IResapi3542["data"]> {
  return request(req3542Config(...arguments));
}
