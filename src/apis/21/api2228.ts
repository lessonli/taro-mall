// @ts-nocheck
/**
 * 创建新地址信息
 * http://yapi.bwyd.com/project/21/interface/api/2228
 **/

import request from "@/service/http.ts";

/**
 * UserAddressVO :UserAddressVO
 */
export class IReqapi2228 {
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
}

/**
 * Result<String> :Result
 */
export class IResapi2228 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req2228Config = (data: IReqapi2228) => ({
  url: `/user/address/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 创建新地址信息
 **/
export default function (data: IReqapi2228 = {}): Promise<IResapi2228["data"]> {
  return request(req2228Config(...arguments));
}
