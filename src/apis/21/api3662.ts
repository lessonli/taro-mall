// @ts-nocheck
/**
 * 根据退货单获取操作记录
 * http://yapi.bwyd.com/project/21/interface/api/3662
 **/

import request from "@/service/http.ts";

export class IReqapi3662 {
  /**
   * 退货单号(String)
   */
  orderReturnNo?: string | number;
}

/**
 * Result<List<OrderReturnOperateViewVo>> :Result
 */
export class IResapi3662 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * OrderReturnOperateViewVo
   */
  data?: {
    /**
     * 退货单id
     */
    orderReturnNo?: string;
    /**
     * 订单id
     */
    orderNo?: string;
    /**
     * 操作人类型，0:系统自动操作1：用户，2:商户，3：后台管理员
     */
    operatorType?: number;
    /**
     * 操作人
     */
    operator?: string;
    /**
     * 操作人头像
     */
    operatorIcon?: string;
    /**
     * 操作时间
     */
    operateTime?: string;
    /**
     * 备注信息
     */
    remark?: string;
    /**
     * 附加信息 ,OrderReturnViewExtVO
     */
    extList?: {
      /**
       * 类型,0:文本展示,1:图片列表
       */
      type?: number;
      /**
       * 文字头
       */
      label?: string;
      /**
       * 内容值
       */
      value?: string;
    }[];
  }[];
}

export const req3662Config = (data: IReqapi3662) => ({
  url: `/orderReturn/listOperateRecord`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据退货单获取操作记录
 **/
export default function (data: IReqapi3662 = {}): Promise<IResapi3662["data"]> {
  return request(req3662Config(...arguments));
}
