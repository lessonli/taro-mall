// @ts-nocheck
/**
 * 获取投诉举报详情
 * http://yapi.bwyd.com/project/21/interface/api/4754
 **/

import request from "@/service/http.ts";

export class IReqapi4754 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ComplainRecordVo> :Result
 */
export class IResapi4754 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ComplainRecordVo
   */
  data?: {
    /**
     * 投诉对象类型，0:商品
     */
    targetType?: number;
    /**
     * 投诉对象id
     */
    targetId?: string;
    /**
     * 举报人id
     */
    userId?: string;
    /**
     * 举报原因
     */
    reason?: string;
    /**
     * 描述
     */
    content?: string;
    /**
     * 举报证明图，最多6张，逗号分割
     */
    proofPics?: string;
    /**
     * 状态,0:待处理，1:已通过,2:已驳回
     */
    status?: number;
    /**
     * 处罚结果，多条使用逗号分割
     */
    dealResult?: string;
    /**
     * 意见反馈时间
     */
    gmtCreate?: string;
  };
}

export const req4754Config = (data: IReqapi4754) => ({
  url: `/complain/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取投诉举报详情
 **/
export default function (data: IReqapi4754 = {}): Promise<IResapi4754["data"]> {
  return request(req4754Config(...arguments));
}
