// @ts-nocheck
/**
 * 根据广告位位置获取列表数据(批量)
 * http://yapi.bwyd.com/project/21/interface/api/4694
 **/

import request from "@/service/http.ts";

/**
 * AdvSearchParam :AdvSearchParam
 */
export class IReqapi4694 {
  /**
   * 0:首页轮播1:首页推荐位2:用户中心轮播3:卖家中心轮播4:首页金刚区5:首页弹窗 ,Integer
   */
  types?: number[];
}

/**
 * Result<List<AdvertiseVo>> :Result
 */
export class IResapi4694 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * AdvertiseVo
   */
  data?: {
    /**
     * 专题活动id
     */
    uuid?: string;
    /**
     * 0:首页轮播1:首页推荐位2:用户中心轮播3:卖家中心轮播4:首页金刚区5:首页弹窗
     */
    type?: number;
    /**
     * 广告位图片
     */
    icon?: string;
    /**
     * H5链接地址
     */
    h5Url?: string;
    /**
     * 小程序链接地址
     */
    maUrl?: string;
    /**
     * 展示间隔时间，单位:分（值为空时永久展示）
     */
    inrTime?: number;
  }[];
}

export const req4694Config = (data: IReqapi4694) => ({
  url: `/banner/batch`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据广告位位置获取列表数据(批量)
 **/
export default function (data: IReqapi4694 = {}): Promise<IResapi4694["data"]> {
  return request(req4694Config(...arguments));
}
