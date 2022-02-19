// @ts-nocheck
/**
 * 查询分销订单列表（只展示直接分成订单）
 * http://yapi.bwyd.com/project/21/interface/api/3752
 **/

import request from "@/service/http.ts";

export class IReqapi3752 {
  merchantNo?: string | number;
  /**
   * 类型：不传-查全部1-待收货2-已完成3-已退款
   */
  type?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<DistributionOrderPageListVO>> :Result
 */
export class IResapi3752 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 佣金金额
       */
      commissionAmount?: number;
      /**
       * 订单id
       */
      uuid?: string;
      /**
       * 用户id
       */
      userId?: string;
      /**
       * 用户名称
       */
      userName?: string;
      /**
       * 用户头像
       */
      userIcon?: string;
      /**
       * 商品id
       */
      productId?: string;
      /**
       * 商品图片
       */
      productIcon?: string;
      /**
       * 商品名称
       */
      productName?: string;
      /**
       * 商品单价
       */
      productPrice?: number;
      /**
       * 分佣比例
       */
      distPercent?: number;
      /**
       * 购买数量
       */
      productQuantity?: number;
      /**
       * 支付时间
       */
      paymentTime?: string;
      /**
       * 支付金额
       */
      payAmount?: number;
      /**
       * 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
       */
      status?: number;
      /**
       * 售后状态：0->无售后；1->售后中;2->售后结束
       */
      returnStatus?: number;
      /**
       * 售后类型，0为仅退款,1为退货退款
       */
      returnType?: number;
    }[];
  };
}

export const req3752Config = (data: IReqapi3752) => ({
  url: `/merchant/distribution/order/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询分销订单列表（只展示直接分成订单）
 **/
export default function (data: IReqapi3752 = {}): Promise<IResapi3752["data"]> {
  return request(req3752Config(...arguments));
}
