// @ts-nocheck
/**
 * 获取专题活动详情信息
 * http://yapi.bwyd.com/project/21/interface/api/4268
 **/

import request from "@/service/http.ts";

export class IReqapi4268 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ActivityInfoVo> :Result
 */
export class IResapi4268 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ActivityInfoVo
   */
  data?: {
    /**
     * 活动uuid
     */
    uuid?: string;
    /**
     * 活动封面
     */
    icon?: string;
    /**
     * 活动状态：0->下线；1->上线
     */
    status?: number;
    /**
     * 限定范围0:全平台1:当前活动
     */
    scope?: number;
    /**
     * 广告展示名称
     */
    showName?: string;
    /**
     * 分享标题
     */
    shareTitle?: string;
    /**
     * 分享副标题
     */
    shareSubTitle?: string;
    /**
     * 分享海报
     */
    sharePosters?: string;
    /**
     * 模板配置
     */
    templateStr?: string;
  };
}

export const req4268Config = (data: IReqapi4268) => ({
  url: `/activity/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取专题活动详情信息
 **/
export default function (data: IReqapi4268 = {}): Promise<IResapi4268["data"]> {
  return request(req4268Config(...arguments));
}
