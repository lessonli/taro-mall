// 商品 description, 调用JSON.stringify
export interface IProductMsgDesc {
  /**
   * 消息发送人身份
   */
  _sender: 'buyer' | 'merchant';
  // 消息类型
  _type: 'productCard' | 'orderCard';
  porductName: string; // 商品名
  productIcon: string; // 商品logo
  productId?: number; // 商品uuid
  price?: number; // 商品价格
}

// 订单 description, 调用JSON.stringify
export interface IOrderMsgDesc extends IProductMsgDesc {
  // 消息类型
  _type: 'orderCard';
  orderNo: string; // 订单编号
  orderSatus: string; // 订单状态
  orderSatusStr: string; // 订单状态文字
  /**
   * 待支付：亲，请及时支付
   * 待发货：亲，请尽快发货
   * 待评价：亲，麻烦给个好评哦
   */
  orderTitle?: string;
}

export type ICustomerMessage = {
  to: number; // 发送对象
  conversationType: any; //
  payload: {
    description: string
  }
}