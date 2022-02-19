// @ts-nocheck
/**
 * 设置退货地址
 * http://yapi.bwyd.com/project/21/interface/api/2428
 **/

import request from "@/service/http.ts";

/**
 * MerchantAddressVO :MerchantAddressVO
 */
export class IReqapi2428 {
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
}

/**
 * Result<Void> :Result
 */
export class IResapi2428 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2428Config = (data: IReqapi2428) => ({
  url: `/merchant/address/return/set`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 设置退货地址
 **/
export default function (data: IReqapi2428 = {}): Promise<IResapi2428["data"]> {
  return request(req2428Config(...arguments));
}
