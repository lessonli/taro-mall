// @ts-nocheck
/**
 * 更新订单的备注
 * http://yapi.bwyd.com/project/21/interface/api/3734
 **/

import request from "@/service/http.ts";

/**
 * OrderNoteUpdateParam :OrderNoteUpdateParam
 */
export class IReqapi3734 {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 备注
   */
  note?: string;
}

/**
 * Result<Integer> :Result
 */
export class IResapi3734 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req3734Config = (data: IReqapi3734) => ({
  url: `/order/updateNote`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 更新订单的备注
 **/
export default function (data: IReqapi3734 = {}): Promise<IResapi3734["data"]> {
  return request(req3734Config(...arguments));
}
