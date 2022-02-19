// @ts-nocheck
/**
 * 商品预发布前置查询
 * http://yapi.bwyd.com/project/21/interface/api/2936
 **/

import request from "@/service/http.ts";

export class IReqapi2936 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ProdPrePublishVo> :Result
 */
export class IResapi2936 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdPrePublishVo
   */
  data?: {
    /**
     * 是否需要缴纳保证金
     */
    isNeedMargin?: boolean;
  };
}

export const req2936Config = (data: IReqapi2936) => ({
  url: `/product/prePublish`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品预发布前置查询
 **/
export default function (data: IReqapi2936 = {}): Promise<IResapi2936["data"]> {
  return request(req2936Config(...arguments));
}
