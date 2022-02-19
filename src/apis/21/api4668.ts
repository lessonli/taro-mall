// @ts-nocheck
/**
 * 红包领取记录
 * http://yapi.bwyd.com/project/21/interface/api/4668
 **/

import request from "@/service/http.ts";

export class IReqapi4668 {
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
  /**
   * 是否是机器人：0-不是机器人1-是机器人
   */
  isRobot?: string | number;
  /**
   * 商户编号不等于xxx
   */
  neMerchantId?: string | number;
  /**
   * 状态：1-待使用2-已核销3-过期退回4-部分核销,,@seecom.bwyd.distribution.enums.RedPacketRecordStatus
   */
  status?: string | number;
  /**
   * 状态列表,,@seecom.bwyd.distribution.enums.RedPacketRecordStatus
   */
  statusList?: string | number;
  /**
   * 商户编号
   */
  merchantId?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<RedPacketReceiveListForUserVo>> :Result
 */
export class IResapi4668 {
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
       * 领取记录ID
       */
      uuid?: string;
      /**
       * 店铺ID
       */
      merchantId?: string;
      /**
       * 店铺名
       */
      shopName?: string;
      /**
       * 店铺LOGO
       */
      shopLogo?: string;
      /**
       * 领取时间
       */
      gmtCreate?: string;
      /**
       * 红包ID
       */
      redPacketId?: string;
      /**
       * 红包金额
       */
      awardAmount?: number;
      /**
       * 领取类型：1-主动领取2-被动领取
       */
      receiveType?: number;
      /**
       * 提现状态：0-待提现1-提现中2-已到账
       */
      withdrawStatus?: number;
      /**
       * 预期提现账户：1-现金红包2-余额红包
       */
      accountType?: number;
      /**
       * 实际提现账户：1-微信钱包2-余额
       */
      withdrawAccount?: number;
      /**
       * 状态：1-待使用2-已全部核销已提现3-过期退回4-部分核销5-过期失效（不退回）6-提现中
       */
      status?: number;
      /**
       * 过期时间
       */
      expireTime?: string;
      /**
       * 使用范围：1-全平台可用2-仅店铺可用,,@seecom.bwyd.distribution.enums.RedPacketUseRange
       */
      useRange?: number;
    }[];
    hasNext?: boolean;
  };
}

export const req4668Config = (data: IReqapi4668) => ({
  url: `/red/packet/user/receive/list`,
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
export default function (data: IReqapi4668 = {}): Promise<IResapi4668["data"]> {
  return request(req4668Config(...arguments));
}
