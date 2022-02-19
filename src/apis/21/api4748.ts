// @ts-nocheck
/**
 * 分页查询商品草稿箱信息
 * http://yapi.bwyd.com/project/21/interface/api/4748
 **/

import request from "@/service/http.ts";

export class IReqapi4748 {
  /**
   * 商品类型0:一口价商品1:拍卖器,com.bwyd.product.enums.ProductType
   */
  productType?: string | number;
  /**
   * 搜索关键词
   */
  keywords?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ProductDraftVo>> :Result
 */
export class IResapi4748 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * uuid编号
       */
      uuid?: string;
      /**
       * 草稿箱内容
       */
      text?: string;
    }[];
  };
}

export const req4748Config = (data: IReqapi4748) => ({
  url: `/product/draft/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询商品草稿箱信息
 **/
export default function (data: IReqapi4748 = {}): Promise<IResapi4748["data"]> {
  return request(req4748Config(...arguments));
}
