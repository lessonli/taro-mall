// @ts-nocheck
/**
 * 根据订单获取操作记录
 * http://yapi.bwyd.com/project/21/interface/api/3674
 **/

import request from "@/service/http.ts";

export class IReqapi3674 {
  /**
   * 订单号(String)
   */
  orderNo?: string | number;
}

/**
 * Result<List<OrderOperateRecordVo>> :Result
 */
export class IResapi3674 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderOperateRecordVo
   */
  data?: {
    /**
     * 订单id
     */
    orderNo?: string;
    /**
     * 操作类型,,CREATE(0,"创建订单"),,PAY(1,"支付订单"),,DELIVERY(2,"订单发货"),,RECEIVE(3,"订单收货"),,COMMENT(4,"评价订单"),,CLOSE(5,"关闭订单"),,DELETE(6,"删除订单"),,RETURN(7,"发起售后"),,UPDATE(8,"更新订单"),,UPDATE_RECEIPT(9,"更新发票"),,UPDATE_ADDRESS(10,"更新地址"),,UPDATE_MONEY(11,"更新金额"),,FINISH_RETURN(12,"结束售后")
     */
    operateType?: number;
    /**
     * 操作人类型，0:系统自动操作1：用户，2:商户，3：后台管理员
     */
    operatorType?: number;
    /**
     * 操作人
     */
    operator?: string;
    /**
     * 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
     */
    orderStatus?: number;
    /**
     * 备注
     */
    note?: string;
  }[];
}

export const req3674Config = (data: IReqapi3674) => ({
  url: `/merchant/order/listOperateRecord`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据订单获取操作记录
 **/
export default function (data: IReqapi3674 = {}): Promise<IResapi3674["data"]> {
  return request(req3674Config(...arguments));
}
