// @ts-nocheck
/**
 * 删除地址信息
 * http://yapi.bwyd.com/project/21/interface/api/2252
 **/

import request from "@/service/http.ts";

/**
 * UserAddressDeleteParam :UserAddressDeleteParam
 */
export class IReqapi2252 {
  /**
   * 地址编号
   */
  addressNo?: string;
}

/**
 * Result<Void> :Result
 */
export class IResapi2252 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req2252Config = (data: IReqapi2252) => ({
  url: `/user/address/delete`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 删除地址信息
 **/
export default function (data: IReqapi2252 = {}): Promise<IResapi2252["data"]> {
  return request(req2252Config(...arguments));
}
