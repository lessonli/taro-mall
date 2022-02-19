// @ts-nocheck
/**
 * 商品评论
 **/

import request from "@/service/http.ts";

/**
 * ProdCommentReq :ProdCommentReq
 */
export class IReqapi2340 {
  /**
   * 用户评分
   */
  score?: number;
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 评论上传图片
   */
  albumPics?: string;
  /**
   * 评论内容
   */
  content?: string;
}

/**
 * Result<Long> :Result
 */
export class IResapi2340 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2340Config = (data: IReqapi2340) => ({
  url: `/comment/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (data: IReqapi2340 = {}): Promise<IResapi2340["data"]> {
  return request(req2340Config(...arguments));
}
