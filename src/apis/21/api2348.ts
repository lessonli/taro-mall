// @ts-nocheck
/**
 * 分页查询商品评论信息
 * http://yapi.bwyd.com/project/21/interface/api/2348
 **/

import request from "@/service/http.ts";

export class IReqapi2348 {
  /**
   * 商户id
   */
  merchantId?: string | number;
  /**
   * 0:好评1:中评2:差评，默认查询全部,com.bwyd.product.enums.CompScoreState
   */
  scoreState?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ProdCommentVo>> :Result
 */
export class IResapi2348 {
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
       * 订单号
       */
      orderNo?: string;
      /**
       * 评论上传图片
       */
      albumPics?: string;
      /**
       * 评论内容
       */
      content?: string;
      /**
       * 评论时间
       */
      gmtCreate?: string;
      /**
       * 综合评分
       */
      compScore?: number;
      /**
       * 评论用户信息 ,UserBaseInfoVO
       */
      userInfo?: {
        /**
         * 昵称
         */
        nickName?: string;
        /**
         * 头像
         */
        headImg?: string;
      };
    }[];
  };
}

export const req2348Config = (data: IReqapi2348) => ({
  url: `/comment/pageList`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 分页查询商品评论信息
 **/
export default function (data: IReqapi2348 = {}): Promise<IResapi2348["data"]> {
  return request(req2348Config(...arguments));
}
