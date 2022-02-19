// @ts-nocheck
/**
 * 保存意见反馈信息
 * http://yapi.bwyd.com/project/21/interface/api/4412
 **/

import request from "@/service/http.ts";

/**
 * FeedbackCreateVo :FeedbackCreateVo
 */
export class IReqapi4412 {
  /**
   * 联系人姓名
   */
  contactUser?: string;
  /**
   * 联系方式
   */
  contactMobile?: string;
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
}

/**
 * Result :Result
 */
export class IResapi4412 {
  code?: number;
  message?: string;
  traceId?: string;
}

export const req4412Config = (data: IReqapi4412) => ({
  url: `/feedback/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 保存意见反馈信息
 **/
export default function (data: IReqapi4412 = {}): Promise<IResapi4412["data"]> {
  return request(req4412Config(...arguments));
}
