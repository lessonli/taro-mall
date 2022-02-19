// @ts-nocheck
/**
 * 更新订单的发票信息
 * http://yapi.bwyd.com/project/21/interface/api/2668
 **/

import request from "@/service/http.ts";

/**
 * OrderReceiptVo :OrderReceiptVo
 */
export class IReqapi2668 {
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 发票类型：0->不开发票；1->电子发票；2->纸质发票
   */
  type?: number;
  /**
   * 发票抬头
   */
  header?: string;
  /**
   * 发票内容
   */
  content?: string;
  /**
   * 收票人电话
   */
  receiverPhone?: string;
  /**
   * 收票人邮箱
   */
  receiverEmail?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2668 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2668Config = (data: IReqapi2668) => ({
  url: `/order/updateReceipt`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 更新订单的发票信息
 **/
export default function (data: IReqapi2668 = {}): Promise<IResapi2668["data"]> {
  return request(req2668Config(...arguments));
}
