// @ts-nocheck
/**
 * 分页查询意义反馈列表
 * http://yapi.bwyd.com/project/21/interface/api/4418
 **/

import request from "@/service/http.ts";

export class IReqapi4418 {
  /**
   * 0:待处理1:已处理
   */
  status?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<FeedbackRecordsVo>> :Result
 */
export class IResapi4418 {
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
       * uuid主键值
       */
      uuid?: string;
      /**
       * 0:软件问题1:退货退款2:投诉建议
       */
      type?: number;
      /**
       * 反馈内容
       */
      content?: string;
      /**
       * 上传图片，逗号分隔
       */
      images?: string;
      /**
       * 0:待处理1:已处理
       */
      status?: number;
      /**
       * 处理结果
       */
      resultStr?: string;
      /**
       * 意见反馈时间
       */
      gmtCreate?: string;
    }[];
  };
}

export const req4418Config = (data: IReqapi4418) => ({
  url: `/feedback/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询意义反馈列表
 **/
export default function (data: IReqapi4418 = {}): Promise<IResapi4418["data"]> {
  return request(req4418Config(...arguments));
}
