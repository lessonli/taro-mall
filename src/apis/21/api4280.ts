// @ts-nocheck
/**
 * 根据线上环境商品id获取本地数据id
 * http://yapi.bwyd.com/project/21/interface/api/4280
 **/

import request from "@/service/http.ts";

export class IReqapi4280 {
  /**
   * ID(Long)
   */
  id?: string | number;
  /**
   * 0一品价商品 1拍品 2-店铺 3-只有spid(Integer)
   */
  type?: string | number;
  /**
   * type 0一品价商品 1拍品 2-店铺 3-只有(Long)
   */
  spid?: string | number;
}

/**
 * Result<UuidConvertVo> :Result
 */
export class IResapi4280 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * UuidConvertVo
   */
  data?: {
    /**
     * 商品ID
     */
    productId?: string;
    /**
     * 渠道编号
     */
    channelNo?: string;
    /**
     * 店铺ID
     */
    merchantId?: string;
  };
}

export const req4280Config = (data: IReqapi4280) => ({
  url: `/product/getUuidById`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据线上环境商品id获取本地数据id
 **/
export default function (data: IReqapi4280 = {}): Promise<IResapi4280["data"]> {
  return request(req4280Config(...arguments));
}
