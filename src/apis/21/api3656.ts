// @ts-nocheck
/**
 * 根据订单号获取退货单
 * http://yapi.bwyd.com/project/21/interface/api/3656
 **/

import request from "@/service/http.ts";

export class IReqapi3656 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<OrderReturnVo> :Result
 */
export class IResapi3656 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderReturnVo
   */
  data?: {
    /**
     * 退货单单号
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
     * 申请状态：MERCHANT_CONFIRMING(0,"待商家确认"),,PENDING_DELIVERY(1,"待用户发货"),,MERCHANT_RECEIVING(2,"商家收货中"),,FINISH(3,"已完成"),,MERCHANT_REJECT(4,"已拒绝"),,CANCELED(5,"已撤销");
     */
    status?: number;
    /**
     * 用户提交售后的原因
     */
    reason?: string;
    /**
     * 用户提交售后的描述
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
     * 处理备注，拒绝原因
     */
    handleNote?: string;
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
    /**
     * 操作超时时间
     */
    operateTimeout?: number;
    /**
     * 店铺退货地址 ,MerchantAddressVo
     */
    merchantAddressVO?: {
      /**
       * 省份
       */
      province?: string;
      /**
       * 城市
       */
      city?: string;
      /**
       * 区域
       */
      district?: string;
      /**
       * 详细地址
       */
      detailAddress?: string;
      /**
       * 邮编
       */
      postCode?: string;
      /**
       * 手机号
       */
      mobile?: string;
      /**
       * 收件人姓名
       */
      name?: string;
      /**
       * 商户编号
       */
      merchantNo?: string;
    };
    /**
     * 类型名称
     */
    typeStr?: string;
    /**
     * 状态名
     */
    statusStr?: string;
    /**
     * 商户名称
     */
    merchantName?: string;
    /**
     * 商户头像
     */
    merchantIcon?: string;
    /**
     * 用户名称
     */
    userName?: string;
    /**
     * 用户头像
     */
    userIcon?: string;
  };
}

export const req3656Config = (data: IReqapi3656) => ({
  url: `/orderReturn/getByOrderNo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单号获取退货单
 **/
export default function (data: IReqapi3656 = {}): Promise<IResapi3656["data"]> {
  return request(req3656Config(...arguments));
}
