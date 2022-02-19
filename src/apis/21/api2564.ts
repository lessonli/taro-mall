// @ts-nocheck
/**
 * 根据订单号创建售后
 * http://yapi.bwyd.com/project/21/interface/api/2564
 **/

import request from "@/service/http.ts";

/**
 * OrderReturnApplyParam :OrderReturnApplyParam
 */
export class IReqapi2564 {
  uuid?: string;
  /**
   * 申请人
   */
  userId?: string;
  /**
   * 类型，0仅退款,1退货退款
   */
  type?: number;
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 商户id
   */
  merchantId?: string;
  /**
   * 商品id
   */
  productId?: string;
  /**
   * 退款金额
   */
  returnAmount?: number;
  /**
   * 退款联系人
   */
  returnName?: string;
  /**
   * 联系电话
   */
  returnPhone?: string;
  /**
   * 原因
   */
  reason?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 图片
   */
  proofPics?: string;
  sourceType?: number;
}

/**
 * Result<String> :Result
 */
export class IResapi2564 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req2564Config = (data: IReqapi2564) => ({
  url: `/orderReturn/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号创建售后
 **/
export default function (data: IReqapi2564 = {}): Promise<IResapi2564["data"]> {
  return request(req2564Config(...arguments));
}
