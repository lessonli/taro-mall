// @ts-nocheck
/**
 * 推广页面的配置
 * http://yapi.bwyd.com/project/21/interface/api/4794
 **/

import request from "@/service/http.ts";

export class IReqapi4794 {}

/**
 * Result<PromotionPageConfigVo> :Result
 */
export class IResapi4794 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PromotionPageConfigVo
   */
  data?: {
    /**
     * 推广二维码地址
     */
    promotionQrCodeUrl?: string;
  };
}

export const req4794Config = (data: IReqapi4794) => ({
  url: `/config/promotionPage`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 推广页面的配置
 **/
export default function (data: IReqapi4794 = {}): Promise<IResapi4794["data"]> {
  return request(req4794Config(...arguments));
}
