// @ts-nocheck
/**
 * 商家审批退货单
 * http://yapi.bwyd.com/project/21/interface/api/2540
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnHandleParam :OrderReturnHandleParam
 */
export class IReqapi2540 {
  /**
   * 服务单号
   */
  uuid?: string;
  /**
   * 选择，0->同意，1->拒绝
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
export class IResapi2540 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2540Config = (data: IReqapi2540) => ({
  url: `/merchant/orderReturn/handle`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家审批退货单
 **/
export default function (data: IReqapi2540 = {}): Promise<IResapi2540["data"]> {
  return request(req2540Config(...arguments));
}
