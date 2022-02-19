// @ts-nocheck
/**
 * 获取红包配置
 * http://yapi.bwyd.com/project/21/interface/api/4686
 **/

import request from "@/service/http.ts";

export class IReqapi4686 {
  /**
   * 红包类型：1-分享红包 2-直播间红包(Integer)
   */
  type?: string | number;
}

/**
 * Result<RedPacketConfigVo> :Result
 */
export class IResapi4686 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketConfigVo
   */
  data?: {
    /**
     * 平均单个用户开红包金额范围
     */
    averageSingleRedPacketAmountMin?: number;
    averageSingleRedPacketAmountMax?: number;
    /**
     * 单个红包总金额下限
     */
    singleRedPacketTotalAmountMin?: number;
    /**
     * 红包个数下限
     */
    redPacketTotalCountMin?: number;
    /**
     * 红包个数上限
     */
    redPacketTotalCountMax?: number;
  };
}

export const req4686Config = (data: IReqapi4686) => ({
  url: `/red/packet/merchant/config`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取红包配置
 **/
export default function (data: IReqapi4686 = {}): Promise<IResapi4686["data"]> {
  return request(req4686Config(...arguments));
}
