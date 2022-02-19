// @ts-nocheck
/**
 * 添加直播间点赞数量
 * http://yapi.bwyd.com/project/21/interface/api/4744
 **/

import request from "@/service/http.ts";

/**
 * LiveLikeParams :LiveLikeParams
 */
export class IReqapi4744 {
  /**
   * 新增点赞数
   */
  likeNum?: number;
  /**
   * 直播间id
   */
  roomId?: string;
  /**
   * 直播记录id
   */
  recordId?: string;
}

/**
 * Result<Long> :Result
 */
export class IResapi4744 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req4744Config = (data: IReqapi4744) => ({
  url: `/live/record/likeNum`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 添加直播间点赞数量
 **/
export default function (data: IReqapi4744 = {}): Promise<IResapi4744["data"]> {
  return request(req4744Config(...arguments));
}
