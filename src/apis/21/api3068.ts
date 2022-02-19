// @ts-nocheck
/**
 * 获取文章详情
 * http://yapi.bwyd.com/project/21/interface/api/3068
 **/

import request from "@/service/http.ts";

export class IReqapi3068 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ArticleInfoVo> :Result
 */
export class IResapi3068 {
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

export const req3068Config = (uuid, data: IReqapi3068) => ({
  url: `/article/detail/${uuid}`,
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
export default function (
  uuid,
  data: IReqapi3068 = {}
): Promise<IResapi3068["data"]> {
  return request(req3068Config(...arguments));
}
