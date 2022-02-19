// @ts-nocheck
/**
 * 根据订单ID查询订单奖励
 * http://yapi.bwyd.com/project/21/interface/api/4718
 **/

import request from "@/service/http.ts";

export class IReqapi4718 {
  /**
   * 订单ID(String)
   */
  orderId?: string | number;
}

/**
 * Result<OrderRewardShowVo> :Result
 */
export class IResapi4718 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderRewardShowVo
   */
  data?: {
    /**
     * 奖励金额
     */
    rewardAmount?: string;
  };
}

export const req4718Config = (data: IReqapi4718) => ({
  url: `/dis/reward/order/reward`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单ID查询订单奖励
 **/
export default function (data: IReqapi4718 = {}): Promise<IResapi4718["data"]> {
  return request(req4718Config(...arguments));
}
