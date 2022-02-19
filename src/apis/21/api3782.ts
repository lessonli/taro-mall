// @ts-nocheck
/**
 * 商家升级条件统计
 * http://yapi.bwyd.com/project/21/interface/api/3782
 **/

import request from "@/service/http.ts";

export class IReqapi3782 {}

/**
 * Result<MerchantLevelUpConditionStatisticsVO> :Result
 */
export class IResapi3782 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantLevelUpConditionStatisticsVO
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 下个等级：1-金牌2-钻石3-服务商
     */
    nextLevel?: number;
    /**
     * 直接招商佣金
     */
    inviteNewMerchantCommission?: number;
    /**
     * 间接招商佣金
     */
    inviteNewMerchantTeamCommission?: number;
    /**
     * 商品团队佣金率，万分位（例：10%，值为1000）
     */
    productTeamCommissionRate?: number;
    /**
     * 升级条件：直接邀请商家数量
     */
    directMerchantNum?: number;
    /**
     * 直接邀请商家数量（当前进度）
     */
    currentDirectMerchantNum?: number;
    /**
     * 升级条件：团队间接商家数量
     */
    teamMerchantNum?: number;
    /**
     * 团队间接商家数量（当前进度）
     */
    currentTeamMerchantNum?: number;
    /**
     * 升级条件：累计销售额
     */
    gmv?: number;
    /**
     * 累计销售额（当前进度）
     */
    currentGmv?: number;
    /**
     * 升级条件：直接专粉数量
     */
    directPrivateFansNum?: number;
    /**
     * 直接专粉数量（当前进度）
     */
    currentDirectPrivateFansNum?: number;
    /**
     * 升级条件：团队专粉数量
     */
    teamPrivateFansNum?: number;
    /**
     * 团队专粉数量（当前进度）
     */
    currentTeamPrivateFansNum?: number;
    /**
     * 升级条件：培养钻石商家数量
     */
    transLevel2Num?: number;
    /**
     * 培养钻石商家数量（当前进度）
     */
    currentTransLevel2Num?: number;
  };
}

export const req3782Config = (data: IReqapi3782) => ({
  url: `/merchant/distribution/levelup/condition`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商家升级条件统计
 **/
export default function (data: IReqapi3782 = {}): Promise<IResapi3782["data"]> {
  return request(req3782Config(...arguments));
}
