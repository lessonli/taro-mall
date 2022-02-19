// @ts-nocheck
/**
 * 系统全局配置
 * http://yapi.bwyd.com/project/21/interface/api/2912
 **/

import request from "@/service/http.ts";

export class IReqapi2912 {}

/**
 * Result<GlobalConfigVo> :Result
 */
export class IResapi2912 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * GlobalConfigVo
   */
  data?: {
    /**
     * 当前时间(毫秒数)
     */
    curlTime?: number;
    /**
     * 域名访问地址
     */
    ossDomain?: string;
    /**
     * 销户发送邮箱地址
     */
    closeAccountEmail?: string;
    /**
     * 系统LOGO
     */
    systemLogoUrl?: string;
    /**
     * 开店LOGO
     */
    openShopLogoUrl?: string;
    /**
     * 开店充值金额
     */
    openShopRechargeAmount?: number;
    /**
     * 系统客服微信号
     */
    systemServiceWxNo?: string;
    /**
     * 系统客服微信二维码图片
     */
    systemServiceWxQrCode?: string;
    /**
     * 订单退货原因列表 ,String
     */
    orderReturnReasons?: string[];
  };
}

export const req2912Config = (data: IReqapi2912) => ({
  url: `/config/globalConfig`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 系统全局配置
 **/
export default function (data: IReqapi2912 = {}): Promise<IResapi2912["data"]> {
  return request(req2912Config(...arguments));
}
