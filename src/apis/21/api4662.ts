// @ts-nocheck
/**
 * 查询单个红包信息
 * http://yapi.bwyd.com/project/21/interface/api/4662
 **/

import request from "@/service/http.ts";

export class IReqapi4662 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<RedPacketVo> :Result
 */
export class IResapi4662 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketVo
   */
  data?: {
    /**
     * 红包ID
     */
    uuid?: string;
    /**
     * 商户ID
     */
    merchantId?: string;
    /**
     * 总数
     */
    totalCount?: number;
    /**
     * 剩余个数
     */
    leftCount?: number;
    /**
     * 总金额
     */
    totalAmount?: number;
    /**
     * 剩余金额
     */
    leftAmount?: number;
    /**
     * 退回金额
     */
    refundAmount?: number;
    /**
     * 红包状态：0-待支付1-待领取2-已领完3-已过期
     */
    status?: number;
    /**
     * 支付时间
     */
    payTime?: string;
    /**
     * 专粉数量
     */
    privateFansCount?: number;
    /**
     * 关注数量
     */
    followCount?: number;
    /**
     * 领取有效期（秒）
     */
    expireSeconds?: number;
    /**
     * 领取截止时间
     */
    expireTime?: string;
    /**
     * 分享数量
     */
    shareCount?: number;
    /**
     * 使用有效期(秒)
     */
    receiveExpireSeconds?: number;
    /**
     * 使用的过期时间
     */
    receiveExpireTime?: string;
    /**
     * 领取完的红包退回金额
     */
    receiveRefundAmount?: number;
    /**
     * 领取完的红包退还状态：0-未退还1-已退还
     */
    receiveRefundStatus?: number;
    /**
     * 红包类型,,@seecom.bwyd.distribution.enums.RedPacketType
     */
    type?: number;
    /**
     * 开红包策略,,@seecom.bwyd.distribution.enums.RedPacketStrategy
     */
    amountStrategy?: number;
    /**
     * 使用范围,,@seecom.bwyd.distribution.enums.RedPacketUseRange
     */
    useRange?: number;
  };
}

export const req4662Config = (data: IReqapi4662) => ({
  url: `/red/packet/merchant/get`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询单个红包信息
 **/
export default function (data: IReqapi4662 = {}): Promise<IResapi4662["data"]> {
  return request(req4662Config(...arguments));
}
