// @ts-nocheck
/**
 * 根据红包领取记录ID查询领取信息
 * http://yapi.bwyd.com/project/21/interface/api/4682
 **/

import request from "@/service/http.ts";

export class IReqapi4682 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<RedPacketReceiveUserVo> :Result
 */
export class IResapi4682 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketReceiveUserVo
   */
  data?: {
    /**
     * 红包ID
     */
    redPacketId?: string;
    /**
     * 状态：0-红包已领完1-可领取2-已领取过
     */
    status?: number;
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
     * 领取时间
     */
    gmtCreate?: string;
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
     * 是否是新用户：0-老用户1-新用户
     */
    isNewerUser?: number;
    /**
     * 红包领取记录状态:1-待使用2-已全部核销已提现3-过期退回4-部分核销5-过期失效（不退回）6-提现中
     */
    redPacketReceiveStatus?: number;
    /**
     * 过期时间
     */
    expireTime?: string;
    /**
     * 领取有效天数
     */
    receiveExpireDays?: number;
    /**
     * 领取有效秒数
     */
    receiveExpireSeconds?: number;
    /**
     * 使用范围：1-全平台2-仅店铺可用,,@seecom.bwyd.distribution.enums.RedPacketUseRange
     */
    useRange?: number;
    /**
     * 商户ID
     */
    merchantId?: string;
  };
}

export const req4682Config = (data: IReqapi4682) => ({
  url: `/red/packet/user/getByUuid`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据红包领取记录ID查询领取信息
 **/
export default function (data: IReqapi4682 = {}): Promise<IResapi4682["data"]> {
  return request(req4682Config(...arguments));
}
