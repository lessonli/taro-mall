// @ts-nocheck
/**
 * 商品预发布前置查询
 **/

import request from "@/service/http.ts";

export class IReqapi3056 {}

/**
 * Result<ProdPrePublishVo> :Result
 */
export class IResapi3056 {
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

export const req3056Config = (uuid, data: IReqapi3056) => ({
  url: `/product/prePublish/${uuid}`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

export default function (
  uuid,
  data: IReqapi3056 = {}
): Promise<IResapi3056["data"]> {
  return request(req3056Config(...arguments));
}
