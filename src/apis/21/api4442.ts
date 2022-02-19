// @ts-nocheck
/**
 * 获取意见反馈详情
 * http://yapi.bwyd.com/project/21/interface/api/4442
 **/

import request from "@/service/http.ts";

export class IReqapi4442 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<FeedbackRecordsVo> :Result
 */
export class IResapi4442 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * FeedbackRecordsVo
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
  };
}

export const req4442Config = (data: IReqapi4442) => ({
  url: `/feedback/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取意见反馈详情
 **/
export default function (data: IReqapi4442 = {}): Promise<IResapi4442["data"]> {
  return request(req4442Config(...arguments));
}
