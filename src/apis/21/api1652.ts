// @ts-nocheck
/**
 * 商品分类树状结构
 * http://yapi.bwyd.com/project/21/interface/api/1652
 **/

import request from "@/service/http.ts";

export class IReqapi1652 {}

/**
 * Result<List<ProdCateNode>> :Result
 */
export class IResapi1652 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ProdCateNode
   */
  data?: {
    /**
     * 子级菜单 ,ProdCateNode
     */
    children?: {}[];
    /**
     * 主键id
     */
    id?: number;
    /**
     * 类目名称
     */
    name?: string;
    /**
     * 分类图标
     */
    icon?: string;
    /**
     * 分佣比例
     */
    distPercent?: number;
  }[];
}

export const req1652Config = (data: IReqapi1652) => ({
  url: `/product/categories`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商品分类树状结构
 **/
export default function (data: IReqapi1652 = {}): Promise<IResapi1652["data"]> {
  return request(req1652Config(...arguments));
}
