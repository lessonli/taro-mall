// @ts-nocheck
/**
 * 红包领取记录
 * http://yapi.bwyd.com/project/21/interface/api/4664
 **/

import request from "@/service/http.ts";

export class IReqapi4664 {
  /**
   * 红包领取记录ID
   */
  uuid?: string | number;
  /**
   * 红包ID
   */
  redPacketId?: string | number;
  /**
   * 用户ID
   */
  userId?: string | number;
  /**
   * 领取类型：1-主动领取2-被动领取
   */
  receiveType?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<RedPacketReceiveListForMerVo>> :Result
 */
export class IResapi4664 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 昵称
       */
      nickName?: string;
      /**
       * 头像
       */
      headImg?: string;
      /**
       * 奖励金额
       */
      awardAmount?: number;
      /**
       * 领取类型：1-主动领取2-被动领取
       */
      receiveType?: number;
      /**
       * 红包领取时间
       */
      gmtCreate?: string;
      /**
       * 领取记录ID
       */
      uuid?: string;
      /**
       * 店铺名
       */
      shopName?: string;
      /**
       * 店铺LOGO
       */
      shopLogo?: string;
      /**
       * 红包ID
       */
      redPacketId?: string;
      /**
       * 奖励类型：1-绑专粉2-关注3-邀请奖励
       */
      awardType?: number;
      /**
       * 状态：1-待使用2-已全部核销已提现3-过期退回4-部分核销5-过期失效（不退回）6-提现中
       */
      status?: number;
      /**
       * 标签：1-手气最佳2-手气最差,,@seecom.bwyd.distribution.enums.RedPacketReceiveTag
       */
      tag?: number;
    }[];
    hasNext?: boolean;
  };
}

export const req4664Config = (data: IReqapi4664) => ({
  url: `/red/packet/merchant/receive/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 红包领取记录
 **/
export default function (data: IReqapi4664 = {}): Promise<IResapi4664["data"]> {
  return request(req4664Config(...arguments));
}
