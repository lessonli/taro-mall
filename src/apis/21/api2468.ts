// @ts-nocheck
/**
 * 获取退货地址
 * http://yapi.bwyd.com/project/21/interface/api/2468
 **/

import request from "@/service/http.ts";

export class IReqapi2468 {}

/**
 * Result<MerchantAddressVO> :Result
 */
export class IResapi2468 {
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

export const req2468Config = (data: IReqapi2468) => ({
  url: `/merchant/address/return/get`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取退货地址
 **/
export default function (data: IReqapi2468 = {}): Promise<IResapi2468["data"]> {
  return request(req2468Config(...arguments));
}
