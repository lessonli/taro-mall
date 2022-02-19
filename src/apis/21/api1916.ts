// @ts-nocheck
/**
 * 查询订单列表
 * http://yapi.bwyd.com/project/21/interface/api/1916
 **/

import request from "@/service/http.ts";

export class IReqapi1916 {
  /**
   * 订单号
   */
  orderNo?: string | number;
  /**
   * 订单类型：0->正常订单；1->拍卖订单
   */
  orderType?: string | number;
  /**
   * 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
   */
  status?: string | number;
  /**
   * 订单售后状态,0无售后,1售后中,2已售后结束
   */
  returnStatusIn?: string | number;
  /**
   * 商户id,前端不需要传
   */
  merchantId?: string | number;
  /**
   * 用户id,前端不需要传
   */
  userId?: string | number;
  /**
   * 自动操作时间开始,前端不需要传
   */
  operateTimeoutStart?: string | number;
  /**
   * 自动操作时间结束,前端不需要传
   */
  operateTimeoutEnd?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<OrderMerchantPageListVo>> :Result
 */
export class IResapi1916 {
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
       * 订单id
       */
      uuid?: string;
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
       * 用户名称
       */
      userName?: string;
      /**
       * 用户头像
       */
      userIcon?: string;
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
       * 订单状态文字描述
       */
      statusStr?: string;
      /**
       * 售后状态：0->无售后；1->售后中;2->售后结束
       */
      returnStatus?: number;
      /**
       * 售后类型，0为仅退款,1为退货退款
       */
      returnType?: number;
    }[];
    hasNext?: boolean;
  };
}

export const req1916Config = (data: IReqapi1916) => ({
  url: `/merchant/order/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询订单列表
 **/
export default function (data: IReqapi1916 = {}): Promise<IResapi1916["data"]> {
  return request(req1916Config(...arguments));
}
