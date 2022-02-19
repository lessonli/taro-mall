// @ts-nocheck
/**
 * 取直播间直播信息
 * http://yapi.bwyd.com/project/21/interface/api/4494
 **/

import request from "@/service/http.ts";

export class IReqapi4494 {
  /**
   * 直播间id(String)
   */
  roomId?: string | number;
}

/**
 * Result<LiveInfoVo> :Result
 */
export class IResapi4494 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * LiveInfoVo
   */
  data?: {
    /**
     * 直播间信息 ,LiveRoomVo
     */
    roomVo?: {
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
       * 最近开播记录
       */
      currentRecord?: string;
      /**
       * 直播间状态：0->未开播；1->直播中
       */
      status?: number;
      /**
       * 直播间状态：0->不启用；1->启用
       */
      enableStatus?: number;
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
    /**
     * 当前直播记录信息 ,LiveRecordVo
     */
    recordVo?: {
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
    /**
     * 本场直播的统计数据 ,LiveRecordStatisticsVo
     */
    statisticsVo?: {
      /**
       * 开播编号
       */
      recordId?: string;
      /**
       * 直播总时长,秒数
       */
      duration?: number;
      /**
       * 新增粉丝总数
       */
      newFansCount?: number;
      /**
       * 点赞总数
       */
      likeCount?: number;
      /**
       * 观看总数
       */
      viewCount?: number;
      /**
       * 观看人次
       */
      userCount?: number;
      /**
       * 商品总数
       */
      productCount?: number;
      /**
       * 下单总数
       */
      orderCount?: number;
      /**
       * 总金额,单位分
       */
      tradeAmount?: number;
      uuid?: string;
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
    /**
     * 当前粉丝数
     */
    fansCount?: number;
  };
}

export const req4494Config = (data: IReqapi4494) => ({
  url: `/live/record/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 取直播间直播信息
 **/
export default function (data: IReqapi4494 = {}): Promise<IResapi4494["data"]> {
  return request(req4494Config(...arguments));
}
