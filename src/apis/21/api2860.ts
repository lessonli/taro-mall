// @ts-nocheck
/**
 * 获取文章详情
 * http://yapi.bwyd.com/project/21/interface/api/2860
 **/

import request from "@/service/http.ts";

export class IReqapi2860 {
  /**
   * (String)
   */
  uuid?: string | number;
}

/**
 * Result<ArticleInfoVo> :Result
 */
export class IResapi2860 {
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

export const req2860Config = (data: IReqapi2860) => ({
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
export default function (data: IReqapi2860 = {}): Promise<IResapi2860["data"]> {
  return request(req2860Config(...arguments));
}
