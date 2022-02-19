// @ts-nocheck
/**
 * 更新已发起的申请
 * http://yapi.bwyd.com/project/21/interface/api/4514
 **/

import request from "@/service/http.ts";

/**
 * LiveRoomApplyUpdateParam :LiveRoomApplyUpdateParam
 */
export class IReqapi4514 {
  /**
   * 直播间编号
   */
  uuid?: string;
  /**
   * 直播间分类
   */
  category?: number;
  /**
   * 商户id
   */
  merchantId?: string;
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
  /**
   * 直播间状态：0->不启用；1->启用
   */
  enableStatus?: number;
}

/**
 * Result<Void> :Result
 */
export class IResapi4514 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * Void
   */
  data?: {};
}

export const req4514Config = (data: IReqapi4514) => ({
  url: `/live/room/updateApply`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 更新已发起的申请
 **/
export default function (data: IReqapi4514 = {}): Promise<IResapi4514["data"]> {
  return request(req4514Config(...arguments));
}
