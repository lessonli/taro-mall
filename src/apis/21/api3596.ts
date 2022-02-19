// @ts-nocheck
/**
 * 获取文章详情
 * http://yapi.bwyd.com/project/21/interface/api/3596
 **/

import request from "@/service/http.ts";

export class IReqapi3596 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ArticleInfoVo> :Result
 */
export class IResapi3596 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * ArticleInfoVo
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
  };
}

export const req3596Config = (data: IReqapi3596) => ({
  url: `/article/getInfo`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取文章详情
 **/
export default function (data: IReqapi3596 = {}): Promise<IResapi3596["data"]> {
  return request(req3596Config(...arguments));
}
