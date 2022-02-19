// @ts-nocheck
/**
 * 保存投诉内容
 * http://yapi.bwyd.com/project/21/interface/api/4752
 **/

import request from "@/service/http.ts";

/**
 * ComplainCreateParam :ComplainCreateParam
 */
export class IReqapi4752 {
  /**
   * 投诉对象类型,0:商品
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
}

/**
 * Result :Result
 */
export class IResapi4752 {
  code?: number;
  message?: string;
  traceId?: string;
}

export const req4752Config = (data: IReqapi4752) => ({
  url: `/complain/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 保存投诉内容
 **/
export default function (data: IReqapi4752 = {}): Promise<IResapi4752["data"]> {
  return request(req4752Config(...arguments));
}
