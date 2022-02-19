// @ts-nocheck
/**
 * 申请售后
 * http://yapi.bwyd.com/project/21/interface/api/1740
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnApplyParam :OrderReturnApplyParam
 */
export class IReqapi1740 {
  uuid?: string;
  userId?: string;
  orderNo?: string;
  productId?: string;
  returnAmount?: number;
  returnName?: string;
  returnPhone?: string;
  status?: number;
  reason?: string;
  description?: string;
  proofPics?: string;
  handleTime?: string;
  handleNote?: string;
  handleMan?: string;
  receiveMan?: string;
  receiveTime?: string;
  receiveNote?: string;
}

/**
 * Result<String> :Result
 */
export class IResapi1740 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req1740Config = (data: IReqapi1740) => ({
  url: `/order/returnApply`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 申请售后
 **/
export default function (data: IReqapi1740 = {}): Promise<IResapi1740["data"]> {
  return request(req1740Config(...arguments));
}
