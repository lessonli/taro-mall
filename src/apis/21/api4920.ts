// @ts-nocheck
/**
 * 创建红包
 * http://yapi.bwyd.com/project/21/interface/api/4920
 **/

import request from "@/service/http.ts";

/**
 * RedPacketCreateParam :RedPacketCreateParam
 */
export class IReqapi4920 {
  /**
   * 用户编号
   */
  userNo?: string;
  /**
   * 商户ID
   */
  merchantId?: string;
  /**
   * 红包金额
   */
  redPacketAmount?: number;
  /**
   * 红包数量
   */
  redPacketCount?: number;
  /**
   * 红包领取有效期（秒）
   */
  expireSeconds?: number;
  /**
   * 红包使用有效（秒）
   */
  receiveExpireSeconds?: number;
  /**
   * 开红包金额策略（红包玩法）：1-新人红包2-普通红包3-拼手气红包,,@seecom.bwyd.distribution.enums.RedPacketStrategy
   */
  amountStrategy?: number;
  /**
   * 使用范围：1-全平台可用2-仅店铺可用,,@seecom.bwyd.distribution.enums.RedPacketUseRange
   */
  useRange?: number;
  /**
   * 红包类型1-分享红包2-直播间红包,,@seecom.bwyd.distribution.enums.RedPacketType
   */
  type?: number;
}

/**
 * Result<RedPacketCreateVo> :Result
 */
export class IResapi4920 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketCreateVo
   */
  data?: {
    /**
     * 红包ID
     */
    uuid?: string;
  };
}

export const req4920Config = (data: IReqapi4920) => ({
  url: `/red/packet/merchant/create`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 创建红包
 **/
export default function (data: IReqapi4920 = {}): Promise<IResapi4920["data"]> {
  return request(req4920Config(...arguments));
}
