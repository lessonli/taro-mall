// @ts-nocheck
/**
 * 撤销售后
 * http://yapi.bwyd.com/project/21/interface/api/2580
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnCancelParam :OrderReturnCancelParam
 */
export class IReqapi2580 {
  /**
   * 退货单id
   */
  uuid?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2580 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2580Config = (data: IReqapi2580) => ({
  url: `/orderReturn/cancel`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 撤销售后
 **/
export default function (data: IReqapi2580 = {}): Promise<IResapi2580["data"]> {
  return request(req2580Config(...arguments));
}
