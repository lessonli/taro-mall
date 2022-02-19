// @ts-nocheck
/**
 * 设置该地址信息为默认地址
 * http://yapi.bwyd.com/project/21/interface/api/2244
 **/

import request from "@/service/http.ts";

/**
 * UserAddressSetDefaultParam :UserAddressSetDefaultParam
 */
export class IReqapi2244 {
  /**
   * 地址编号
   */
  addressNo?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2244 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2244Config = (data: IReqapi2244) => ({
  url: `/user/address/setDefault`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 设置该地址信息为默认地址
 **/
export default function (data: IReqapi2244 = {}): Promise<IResapi2244["data"]> {
  return request(req2244Config(...arguments));
}
