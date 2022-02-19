// @ts-nocheck
/**
 * 获取国家地址信息树状列表
 * http://yapi.bwyd.com/project/21/interface/api/2220
 **/

import request from "@/service/http.ts";

export class IReqapi2220 {}

/**
 * Result<List<AddressNodeVo>> :Result
 */
export class IResapi2220 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * AddressNodeVo
   */
  data?: {
    /**
     * 地址名臣
     */
    name?: string;
    /**
     * 等级：1-省2-市3-区县
     */
    level?: number;
    /**
     * 编号
     */
    code?: number;
    /**
     * 下级地址列表 ,AddressNodeVo
     */
    children?: {}[];
  }[];
}

export const req2220Config = (data: IReqapi2220) => ({
  url: `/config/common/address`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取国家地址信息树状列表
 **/
export default function (data: IReqapi2220 = {}): Promise<IResapi2220["data"]> {
  return request(req2220Config(...arguments));
}
