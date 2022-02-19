// @ts-nocheck
/**
 * 文章分类树状结构
 * http://yapi.bwyd.com/project/21/interface/api/2852
 **/

import request from "@/service/http.ts";

export class IReqapi2852 {}

/**
 * Result<List<ArticleCateNodeVo>> :Result
 */
export class IResapi2852 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ArticleCateNodeVo
   */
  data?: {
    /**
     * 子级菜单 ,ArticleCateNodeVo
     */
    children?: {}[];
    /**
     * 文章id
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
  }[];
}

export const req2852Config = (data: IReqapi2852) => ({
  url: `/article/categories`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 文章分类树状结构
 **/
export default function (data: IReqapi2852 = {}): Promise<IResapi2852["data"]> {
  return request(req2852Config(...arguments));
}
