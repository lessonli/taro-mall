// @ts-nocheck
/**
 * 提醒发货
 * http://yapi.bwyd.com/project/21/interface/api/1732
 **/

import request from "@/service/http.ts";

/**
 * OrderNoticeDeliveryParam :OrderNoticeDeliveryParam
 */
export class IReqapi1732 {
  /**
   * 订单号
   */
  orderNo?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi1732 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req1732Config = (data: IReqapi1732) => ({
  url: `/order/noticeDelivery`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 提醒发货
 **/
export default function (data: IReqapi1732 = {}): Promise<IResapi1732["data"]> {
  return request(req1732Config(...arguments));
}
