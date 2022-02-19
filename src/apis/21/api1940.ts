// @ts-nocheck
/**
 * 查询退货单列表
 * http://yapi.bwyd.com/project/21/interface/api/1940
 **/

import request from "@/service/http.ts";

export class IReqapi1940 {
  /**
   * 售后状态,0->待处理,1->处理中，2->已处理
   */
  status?: string | number;
}

/**
 * Result<PaginatedData<OrderReturnListVO>> :Result
 */
export class IResapi1940 {
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
       * 用户信息 ,UserVO
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
       * 商户信息 ,MerchantVO
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
       * 商品信息 ,ProductVO
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

export const req1940Config = (data: IReqapi1940) => ({
  url: `/merchant/orderReturn/list`,
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
export default function (data: IReqapi1940 = {}): Promise<IResapi1940["data"]> {
  return request(req1940Config(...arguments));
}
