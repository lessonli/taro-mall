// @ts-nocheck
/**
 * 查询退货单列表
 * http://yapi.bwyd.com/project/21/interface/api/3650
 **/

import request from "@/service/http.ts";

export class IReqapi3650 {
  /**
   * 订单号
   */
  orderNo?: string | number;
  /**
   * 退货类型，0->仅退款，1->退货退款
   */
  type?: string | number;
  /**
   * 用户id
   */
  userId?: string | number;
  /**
   * 商户id
   */
  merchantId?: string | number;
  /**
   * 多状态过滤
   */
  statusIn?: string | number;
  /**
   * 自动操作时间开始，前端忽略
   */
  operateTimeoutStart?: string | number;
  /**
   * 自动操作时间结束，前端忽略
   */
  operateTimeoutEnd?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<OrderReturnListVo>> :Result
 */
export class IResapi3650 {
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
       * 退货单id
       */
      uuid?: string;
      /**
       * 售后类型，0为仅退款,1为退货退款
       */
      type?: number;
      /**
       * 订单id
       */
      orderNo?: string;
      /**
       * 用户信息 ,UserVo
       */
      user?: {
        /**
         * 用户id
         */
        id?: string;
        /**
         * 用户名称
         */
        name?: string;
        /**
         * 用户头像
         */
        icon?: string;
      };
      /**
       * 商户信息 ,MerchantVo
       */
      merchant?: {
        /**
         * 商户id
         */
        id?: string;
        /**
         * 商户名称
         */
        name?: string;
        /**
         * 商户头像
         */
        icon?: string;
      };
      /**
       * 商品信息 ,ProductVo
       */
      product?: {
        /**
         * 商品id
         */
        id?: string;
        /**
         * 商品名称
         */
        name?: string;
        /**
         * 商品封面
         */
        icon?: string;
        /**
         * 商品价格
         */
        price?: number;
        /**
         * 商品数量
         */
        quantity?: number;
      };
      /**
       * 商品图片,待清理
       */
      productIcon?: string;
      /**
       * 商品名称,待清理
       */
      productName?: string;
      /**
       * 退款金额
       */
      returnAmount?: number;
      /**
       * 金额展示标签
       */
      amountTypeLabel?: string;
      /**
       * 创建时间
       */
      gmtCreate?: string;
      /**
       * 售后状态：MERCHANT_CONFIRMING(0,"待商家确认"),,PENDING_DELIVERY(1,"待用户发货"),,MERCHANT_RECEIVING(2,"商家收货中"),,FINISH(3,"已完成"),,MERCHANT_REJECT(4,"已拒绝"),,CANCELED(5,"已撤销");
       */
      status?: number;
      /**
       * 售后状态文字描述
       */
      statusStr?: string;
    }[];
  };
}

export const req3650Config = (data: IReqapi3650) => ({
  url: `/orderReturn/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询退货单列表
 **/
export default function (data: IReqapi3650 = {}): Promise<IResapi3650["data"]> {
  return request(req3650Config(...arguments));
}
