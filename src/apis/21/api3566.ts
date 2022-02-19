// @ts-nocheck
/**
 * 获取分享链接详情
 * http://yapi.bwyd.com/project/21/interface/api/3566
 **/

import request from "@/service/http.ts";

export class IReqapi3566 {
  /**
   * 分享编号
   */
  shareNo?: string | number;
}

/**
 * Result<ShareLinkVo> :Result
 */
export class IResapi3566 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ShareLinkVo
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

export const req3566Config = (data: IReqapi3566) => ({
  url: `/share/link/detail`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取分享链接详情
 **/
export default function (data: IReqapi3566 = {}): Promise<IResapi3566["data"]> {
  return request(req3566Config(...arguments));
}
