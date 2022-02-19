// @ts-nocheck
/**
 * 获取分享二维码
 * http://yapi.bwyd.com/project/21/interface/api/3560
 **/

import request from "@/service/http.ts";

export class IReqapi3560 {
  /**
   * 是否是微信小程序环境：0-不是1-是（小程序环境会生成小程序码。前端不用传，会根据terminal来自动识别）
   */
  isWxMiniApp?: string | number;
  /**
   * 分享类型:1.首页分享2:店铺分享3:一口价商品分享4:拍品分享5:博物学院首页6:博物学院文章页7:活动页8:开店分享,,@seeShareType
   */
  shareType?: string | number;
  /**
   * 目标ID（当类型为商品详情时，为商品ID，其他类型时则为类型对应的ID）
   */
  targetId?: string | number;
  /**
   * 分享用户编号（前端不用传）
   */
  userNo?: string | number;
  /**
   * 渠道编号（前端不用传）
   */
  channelNo?: string | number;
  /**
   * 自定义参数（?开始，跟URL参数风格一致）
   */
  customParam?: string | number;
}

/**
 * Result<ShareQrCodeVo> :Result
 */
export class IResapi3560 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ShareQrCodeVo
   */
  data?: {
    /**
     * 分享二维码图片地址
     */
    qrCodeUrl?: string;
    /**
     * 分享口令
     */
    shareToken?: string;
    /**
     * 小程序的分享Scheme
     */
    maScheme?: string;
    /**
     * 分享记录编号
     */
    shareNo?: string;
    /**
     * 分享链接
     */
    shareUrl?: string;
    /**
     * 分享类型:1-首页2-店铺详情3-一口价商品详情4-拍品详情5-博物学院首页6-博物学院文章页7-活动页8-邀请开店,9-拉新活动10-直播间11-直播预展页12-红包,,@seeShareType
     */
    shareType?: number;
    /**
     * 主标题
     */
    title?: string;
    /**
     * 分享副标题
     */
    subTitle?: string;
    /**
     * 分享图片
     */
    picUrl?: string;
    /**
     * 缩略图
     */
    icon?: string;
    /**
     * 分享渠道
     */
    channelNo?: string;
    /**
     * 是否展示弹窗：0-不展示1-展示
     */
    isShowPop?: number;
  };
}

export const req3560Config = (data: IReqapi3560) => ({
  url: `/share/qrCode`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取分享二维码
 **/
export default function (data: IReqapi3560 = {}): Promise<IResapi3560["data"]> {
  return request(req3560Config(...arguments));
}
