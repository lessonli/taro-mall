// @ts-nocheck
/**
 * 发起创建直播间或更新直播间的申请
 * http://yapi.bwyd.com/project/21/interface/api/4512
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomApplyCreateParam :LiveRoomApplyCreateParam
 */
export class IReqapi4512 {
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 直播间分类
   */
  category?: number;
  /**
   * 商户id
   */
  merchantId?: string;
  /**
   * 头像
   */
  headImg?: string;
  /**
   * 直播间名称
   */
  roomName?: string;
  /**
   * 直播间简介
   */
  introduction?: string;
  /**
   * 直播间公告
   */
  announcement?: string;
}

/**
 * Result<String> :Result
 */
export class IResapi4512 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4512Config = (data: IReqapi4512) => ({
  url: `/live/room/apply`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 发起创建直播间或更新直播间的申请
 **/
export default function (data: IReqapi4512 = {}): Promise<IResapi4512["data"]> {
  return request(req4512Config(...arguments));
}
