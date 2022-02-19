// @ts-nocheck
/**
 * /merchant/orderReturn/return/handle
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnHandleParam :OrderReturnHandleParam
 */
export class IReqapi1956 {
  /**
   * 服务单号
   */
  uuid?: string;
  /**
   * 选择，1->同意，2->拒绝
   */
  handleResult?: number;
  /**
   * 处理备注
   */
  handleNote?: string;
  /**
   * 处理人
   */
  handleMan?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi1956 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req1956Config = (data: IReqapi1956) => ({
  url: `/merchant/orderReturn/return/handle`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi1956 = {}): Promise<IResapi1956["data"]> {
  return request(req1956Config(...arguments));
}
