// @ts-nocheck
/**
 * 查询个人地址列表
 * http://yapi.bwyd.com/project/21/interface/api/2260
 **/

import request from "@/service/http.ts";

export class IReqapi2260 {}

/**
 * Result<List<UserAddressVO>> :Result
 */
export class IResapi2260 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UserAddressVO
   */
  data?: {
    /**
     * 省份
     */
    province?: string;
    /**
     * id
     */
    id?: number;
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
     * 用户编号
     */
    userNo?: string;
    /**
     * 是否默认地址
     */
    isDefault?: boolean;
    /**
     * 地址编码
     */
    addressNo?: string;
  }[];
}

export const req2260Config = (data: IReqapi2260) => ({
  url: `/user/address/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询个人地址列表
 **/
export default function (data: IReqapi2260 = {}): Promise<IResapi2260["data"]> {
  return request(req2260Config(...arguments));
}
