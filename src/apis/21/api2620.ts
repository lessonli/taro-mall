// @ts-nocheck
/**
 * 更新订单的发票信息
 **/

import request from "@/service/http.ts";

/**
 * OrderBillVO :OrderBillVO
 */
export class IReqapi2620 {
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 发票类型：0->不开发票；1->电子发票；2->纸质发票
   */
  billType?: number;
  /**
   * 发票抬头
   */
  billHeader?: string;
  /**
   * 发票内容
   */
  billContent?: string;
  /**
   * 收票人电话
   */
  billReceiverPhone?: string;
  /**
   * 收票人邮箱
   */
  billReceiverEmail?: string;
}

/**
 * Result<Boolean> :Result
 */
export class IResapi2620 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: boolean;
}

export const req2620Config = (data: IReqapi2620) => ({
  url: `/order/updateBill`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2620 = {}): Promise<IResapi2620["data"]> {
  return request(req2620Config(...arguments));
}
