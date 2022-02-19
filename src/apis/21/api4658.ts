// @ts-nocheck
/**
 * 微信支付支付创建红包
 * http://yapi.bwyd.com/project/21/interface/api/4658
 **/

import request from "@/service/http.ts";

/**
 * RedPacketCreateParam :RedPacketCreateParam
 */
export class IReqapi4658 {
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
 * Result<RedPacketCreateWxPayCreateVo> :Result
 */
export class IResapi4658 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketCreateWxPayCreateVo
   */
  data?: {
    uuid?: string;
    /**
     * 支付编号
     */
    payNo?: string;
    /**
     * h5支付使用的参数 ,H5PayVo
     */
    h5Pay?: {
      /**
       * 付款单编号
       */
      payNo?: string;
      /**
       * 支付链接
       */
      h5Url?: string;
    };
    /**
     * app支付使用的参数 ,AppPayVo
     */
    appPay?: {
      payNo?: string;
      sign?: string;
      prepayId?: string;
      partnerId?: string;
      appId?: string;
      packageValue?: string;
      timeStamp?: string;
      nonceStr?: string;
    };
    /**
     * 小程序支付使用的参数 ,MPPayVo
     */
    mpPay?: {
      payNo?: string;
      appId?: string;
      timeStamp?: string;
      nonceStr?: string;
      packageValue?: string;
      signType?: string;
      paySign?: string;
    };
    /**
     * pc页面支付使用的参数 ,NativePayVo
     */
    pcPay?: {
      payNo?: string;
      codeUrl?: string;
    };
  };
}

export const req4658Config = (data: IReqapi4658) => ({
  url: `/red/packet/merchant/createWithWxPay`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 微信支付支付创建红包
 **/
export default function (data: IReqapi4658 = {}): Promise<IResapi4658["data"]> {
  return request(req4658Config(...arguments));
}
