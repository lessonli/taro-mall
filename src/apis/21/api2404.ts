// @ts-nocheck
/**
 * 判断是否需要缴纳保证金
 **/

import request from "@/service/http.ts";

export class IReqapi2404 {
  /**
   * (String)
   */
  productId?: string | number;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2404 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2404Config = (data: IReqapi2404) => ({
  url: `/auction/isNeedMargin`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2404 = {}): Promise<IResapi2404["data"]> {
  return request(req2404Config(...arguments));
}
