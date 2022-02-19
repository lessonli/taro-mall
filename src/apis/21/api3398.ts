// @ts-nocheck
/**
 * 获取分享信息
 * http://yapi.bwyd.com/project/21/interface/api/3398
 **/

import request from "@/service/http.ts";

export class IReqapi3398 {
  /**
   * 分享类型:1-首页2-店铺详情页3-商品详情页,@seeShareType
   */
  shareType?: string | number;
  /**
   * 店铺ID
   */
  merchantId?: string | number;
  /**
   * 商品ID
   */
  productId?: string | number;
  /**
   * 分享用户编号
   */
  userNo?: string | number;
}

/**
 * Result<ShareQrCodeVO> :Result
 */
export class IResapi3398 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ShareQrCodeVO
   */
  data?: {
    /**
     * 分享记录编号
     */
    shareNo?: string;
    /**
     * 分享链接
     */
    shareUrl?: string;
    /**
     * 分享二维码图片地址
     */
    qrCodeUrl?: string;
  };
}

export const req3398Config = (data: IReqapi3398) => ({
  url: `/share/info`,
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
export default function (data: IReqapi3398 = {}): Promise<IResapi3398["data"]> {
  return request(req3398Config(...arguments));
}
