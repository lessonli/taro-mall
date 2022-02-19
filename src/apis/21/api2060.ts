// @ts-nocheck
/**
 * 修改商品上下架状态
 * http://yapi.bwyd.com/project/21/interface/api/2060
 **/

import request from "@/service/http.ts";

/**
 * ProductStatusParam :ProductStatusParam
 */
export class IReqapi2060 {
  /**
   * 商品uuid
   */
  uuid?: string;
  /**
   * 上下架|推荐|取消推荐0:1
   */
  status?: number;
}

/**
 * Result<Integer> :Result
 */
export class IResapi2060 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: number;
}

export const req2060Config = (data: IReqapi2060) => ({
  url: `/product/publish`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 修改商品上下架状态
 **/
export default function (data: IReqapi2060 = {}): Promise<IResapi2060["data"]> {
  return request(req2060Config(...arguments));
}
