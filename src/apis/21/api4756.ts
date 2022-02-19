// @ts-nocheck
/**
 * 分页查询用户的投诉举报列表
 * http://yapi.bwyd.com/project/21/interface/api/4756
 **/

import request from "@/service/http.ts";

export class IReqapi4756 {
  /**
   * 投诉对象类型
   */
  targetType?: string | number;
  /**
   * 投诉对象id
   */
  targetId?: string | number;
  /**
   * 反馈用户id
   */
  userId?: string | number;
  /**
   * 0:待处理1:已处理
   */
  status?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ComplainRecordVo>> :Result
 */
export class IResapi4756 {
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
    }[];
  };
}

export const req4756Config = (data: IReqapi4756) => ({
  url: `/complain/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询用户的投诉举报列表
 **/
export default function (data: IReqapi4756 = {}): Promise<IResapi4756["data"]> {
  return request(req4756Config(...arguments));
}
