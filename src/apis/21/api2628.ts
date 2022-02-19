// @ts-nocheck
/**
 * 更新订单的地址信息
 * http://yapi.bwyd.com/project/21/interface/api/2628
 **/

import request from "@/service/http.ts";

/**
 * OrderAddressUpdate :OrderAddressUpdate
 */
export class IReqapi2628 {
  /**
   * 订单id
   */
  orderNo?: string;
  /**
   * 地址id
   */
  addressNo?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2628 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2628Config = (data: IReqapi2628) => ({
  url: `/order/updateAddress`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 更新订单的地址信息
 **/
export default function (data: IReqapi2628 = {}): Promise<IResapi2628["data"]> {
  return request(req2628Config(...arguments));
}
