// @ts-nocheck
/**
 * 创建预展直播
 * http://yapi.bwyd.com/project/21/interface/api/4496
 **/

import request from "@/service/http.ts";

/**
 * LiveRecordCreateParam :LiveRecordCreateParam
 */
export class IReqapi4496 {
  /**
   * 直播间编号
   */
  roomId?: string;
  /**
   * 商户id,前端无需传入
   */
  merchantId?: string;
  /**
   * 操作人id
   */
  userId?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 封面图
   */
  coverImg?: string;
  /**
   * 海报图
   */
  posterImg?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 分佣比例
   */
  distPercent?: number;
}

/**
 * Result<LiveRecordVo> :Result
 */
export class IResapi4496 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveRecordVo
   */
  data?: {
    uuid?: string;
    /**
     * 直播间编号
     */
    roomId?: string;
    /**
     * 开播标题
     */
    title?: string;
    /**
     * 封面图
     */
    coverImg?: string;
    /**
     * 海报图
     */
    posterImg?: string;
    /**
     * 推流地址
     */
    streamPushUrl?: string;
    /**
     * 拉流地址
     */
    streamPullUrl?: string;
    /**
     * 直播群组ID
     */
    imGroupId?: string;
    /**
     * 上播时间
     */
    startTime?: string;
    /**
     * 下播时间
     */
    endTime?: string;
    /**
     * 开播状态：0->初始化，1->直播中；2->暂时离开;3->已下播
     */
    status?: number;
    /**
     * 直播间状态：0->地址已创建；1->推流中;2->已断流;3->禁推流
     */
    streamStatus?: number;
    /**
     * 下播类型：0->主动下播；1->自动下播
     */
    endType?: number;
    /**
     * 分佣比例
     */
    distPercent?: number;
    requestId?: string;
    /**
     * (该参数为map)
     */
    feature?: {
      /**
       * String
       */
      mapKey?: {};
      /**
       * String
       */
      mapValue?: {
        hash?: number;
      };
    };
    id?: number;
    version?: number;
    gmtCreate?: string;
    gmtModify?: string;
    isDeleted?: number;
  };
}

export const req4496Config = (data: IReqapi4496) => ({
  url: `/live/record/createPreLive`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 创建预展直播
 **/
export default function (data: IReqapi4496 = {}): Promise<IResapi4496["data"]> {
  return request(req4496Config(...arguments));
}
