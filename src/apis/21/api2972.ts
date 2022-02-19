// @ts-nocheck
/**
 * 根据广告位位置获取列表数据
 * http://yapi.bwyd.com/project/21/interface/api/2972
 **/

import request from "@/service/http.ts";

export class IReqapi2972 {
  /**
   * 0首页轮播 1首页推荐位 2用户中心轮播 3卖家中心轮播 4首页金刚区 5首页弹窗(Integer)
   */
  type?: string | number;
}

/**
 * Result<List<AdvertiseVo>> :Result
 */
export class IResapi2972 {
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

export const req2972Config = (data: IReqapi2972) => ({
  url: `/banner/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据广告位位置获取列表数据
 **/
export default function (data: IReqapi2972 = {}): Promise<IResapi2972["data"]> {
  return request(req2972Config(...arguments));
}
