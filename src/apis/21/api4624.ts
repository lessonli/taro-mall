// @ts-nocheck
/**
 * 获取直播间通用配置
 * http://yapi.bwyd.com/project/21/interface/api/4624
 **/

import request from "@/service/http.ts";

export class IReqapi4624 {}

/**
 * Result<LiveRoomCustomConfigVo> :Result
 */
export class IResapi4624 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomCustomConfigVo
   */
  data?: {
    /**
     * 直播间声明
     */
    notice?: string;
    /**
     * 常用聊天话术 ,String
     */
    phrases?: string[];
  };
}

export const req4624Config = (data: IReqapi4624) => ({
  url: `/live/room/custom/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取直播间通用配置
 **/
export default function (data: IReqapi4624 = {}): Promise<IResapi4624["data"]> {
  return request(req4624Config(...arguments));
}
