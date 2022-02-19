// @ts-nocheck
/**
 * 余额支付创建红包
 * http://yapi.bwyd.com/project/21/interface/api/4656
 **/

import request from "@/service/http.ts";

/**
 * BalancePayRedPacketCreateParam :BalancePayRedPacketCreateParam
 */
export class IReqapi4656 {
  /**
   * 支付密码
   */
  payPassword?: string;
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
export class IResapi4656 {
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

export const req4656Config = (data: IReqapi4656) => ({
  url: `/red/packet/merchant/createWithBalance`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 余额支付创建红包
 **/
export default function (data: IReqapi4656 = {}): Promise<IResapi4656["data"]> {
  return request(req4656Config(...arguments));
}
