// @ts-nocheck
/**
 * 分页查询文章列表
 * http://yapi.bwyd.com/project/21/interface/api/2868
 **/

import request from "@/service/http.ts";

export class IReqapi2868 {
  /**
   * 文章分类id
   */
  categoryId?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ArticleInfoVo>> :Result
 */
export class IResapi2868 {
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
       * uuid主键
       */
      uuid?: string;
      /**
       * 文章标题
       */
      title?: string;
      /**
       * 文章作者
       */
      author?: string;
      /**
       * 文章图标
       */
      icon?: string;
      /**
       * 文章发表时间
       */
      gmtCreate?: string;
      /**
       * 文章内容(详情界面返回值)
       */
      content?: string;
    }[];
  };
}

export const req2868Config = (data: IReqapi2868) => ({
  url: `/article/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询文章列表
 **/
export default function (data: IReqapi2868 = {}): Promise<IResapi2868["data"]> {
  return request(req2868Config(...arguments));
}
