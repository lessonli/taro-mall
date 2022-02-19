// @ts-nocheck
/**
 * 修改地址信息
 * http://yapi.bwyd.com/project/21/interface/api/2236
 **/

import request from "@/service/http.ts";

/**
 * UserAddressVO :UserAddressVO
 */
export class IReqapi2236 {
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
 * Result<Void> :Result
 */
export class IResapi2236 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2236Config = (data: IReqapi2236) => ({
  url: `/user/address/modify`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改地址信息
 **/
export default function (data: IReqapi2236 = {}): Promise<IResapi2236["data"]> {
  return request(req2236Config(...arguments));
}
