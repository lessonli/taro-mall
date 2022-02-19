// @ts-nocheck
/**
 * 根据获取本商户直播间基本信息
 * http://yapi.bwyd.com/project/21/interface/api/4614
 **/

import request from "@/service/http.ts";

export class IReqapi4614 {}

/**
 * Result<LiveRoomVo> :Result
 */
export class IResapi4614 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRoomVo
   */
  data?: {
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
     * 直播间头像
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
    /**
     * 直播间状态：0->未开播；1->直播中
     */
    status?: number;
    /**
     * 直播间状态：0->不启用；1->启用
     */
    enableStatus?: number;
    /**
     * 最近开播记录
     */
    currentRecord?: string;
    /**
     * 默认直播封面图
     */
    defaultCoverImg?: string;
    /**
     * 默认直播海报图
     */
    defaultPosterImg?: string;
    /**
     * 默认开播标题
     */
    defaultTitle?: string;
    requestId?: string;
    feature?: string;
    id?: number;
    version?: number;
    gmtCreate?: string;
    gmtModify?: string;
    isDeleted?: number;
  };
}

export const req4614Config = (data: IReqapi4614) => ({
  url: `/live/room/getRoomBasic`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据获取本商户直播间基本信息
 **/
export default function (data: IReqapi4614 = {}): Promise<IResapi4614["data"]> {
  return request(req4614Config(...arguments));
}
