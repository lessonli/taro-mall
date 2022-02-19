// @ts-nocheck
/**
 * 获取分享信息
 * http://yapi.bwyd.com/project/21/interface/api/4724
 **/

import request from "@/service/http.ts";

export class IReqapi4724 {}

/**
 * Result<RedPacketUserShareInfoVo> :Result
 */
export class IResapi4724 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * RedPacketUserShareInfoVo
   */
  data?: {
    /**
     * 获得分享红包数量
     */
    shareCount?: number;
    /**
     * 获得分享红包金额
     */
    shareAmount?: number;
    /**
     * 累计获得红包数量
     */
    totalCount?: number;
    /**
     * 累计获得红包金额
     */
    totalAmount?: number;
    /**
     * 累计红包剩余金额
     */
    totalLeftAmount?: number;
    /**
     * 当前分享次数
     */
    currentSharingCount?: number;
    /**
     * 可用红包金额
     */
    availableAmount?: number;
  };
}

export const req4724Config = (data: IReqapi4724) => ({
  url: `/red/packet/user/getShareInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取分享信息
 **/
export default function (data: IReqapi4724 = {}): Promise<IResapi4724["data"]> {
  return request(req4724Config(...arguments));
}
