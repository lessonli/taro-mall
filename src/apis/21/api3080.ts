// @ts-nocheck
/**
 * 根据退货单号获取退货详情
 **/

import request from "@/service/http.ts";

export class IReqapi3080 {}

/**
 * Result<OrderReturnVO> :Result
 */
export class IResapi3080 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderReturnVO
   */
  data?: {
    /**
     * uuid编号
     */
    uuid?: string;
    /**
     * 会员id
     */
    userId?: string;
    /**
     * 订单编号
     */
    orderNo?: string;
    /**
     * 商户id
     */
    merchantId?: string;
    /**
     * 退货类型，0->仅退款，1->退货退款
     */
    type?: number;
    /**
     * 商品id
     */
    productId?: string;
    /**
     * 退款金额
     */
    returnAmount?: number;
    /**
     * 退货人姓名
     */
    returnName?: string;
    /**
     * 退货人电话
     */
    returnPhone?: string;
    /**
     * 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝;4->已撤销
     */
    status?: number;
    /**
     * 原因
     */
    reason?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 凭证图片，以逗号隔开
     */
    proofPics?: string;
    /**
     * 处理时间
     */
    handleTime?: string;
    /**
     * 处理备注
     */
    handleNote?: string;
    /**
     * 处理人员
     */
    handleMan?: string;
    /**
     * 收货人
     */
    receiveMan?: string;
    /**
     * 收货时间
     */
    receiveTime?: string;
    /**
     * 收货备注
     */
    receiveNote?: string;
    /**
     * 创建时间
     */
    gmtCreate?: string;
  };
}

export const req3080Config = (orderNo, data: IReqapi3080) => ({
  url: `/merchant/orderReturn/detail/${orderNo}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  orderNo,
  data: IReqapi3080 = {}
): Promise<IResapi3080["data"]> {
  return request(req3080Config(...arguments));
}
