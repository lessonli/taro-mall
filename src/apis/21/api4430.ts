// @ts-nocheck
/**
 * 根据退货单号获取基本物流信息
 * http://yapi.bwyd.com/project/21/interface/api/4430
 **/

import request from "@/service/http.ts";

export class IReqapi4430 {
  /**
   * 退货单号(String)
   */
  orderReturnNo?: string | number;
}

/**
 * Result<BaseExpressRecordVo> :Result
 */
export class IResapi4430 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * BaseExpressRecordVo
   */
  data?: {
    /**
     * 快递公司
     */
    company?: string;
    /**
     * 快递单号
     */
    number?: string;
  };
}

export const req4430Config = (data: IReqapi4430) => ({
  url: `/orderReturn/getExpressInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据退货单号获取基本物流信息
 **/
export default function (data: IReqapi4430 = {}): Promise<IResapi4430["data"]> {
  return request(req4430Config(...arguments));
}
