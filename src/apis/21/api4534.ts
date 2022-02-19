// @ts-nocheck
/**
 * 邀请记录
 * http://yapi.bwyd.com/project/21/interface/api/4534
 **/

import request from "@/service/http.ts";

export class IReqapi4534 {
  /**
   * 活动ID
   */
  uuid?: string | number;
  /**
   * 用户ID，前端无需传
   */
  inviteUserId?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<NewerActivityInviteListUserVo>> :Result
 */
export class IResapi4534 {
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
       * 昵称
       */
      nickName?: string;
      /**
       * 头像
       */
      headImg?: string;
      /**
       * 用户ID
       */
      userId?: string;
      /**
       * 奖励金额
       */
      rewardAmount?: number;
      /**
       * 注册时间
       */
      gmtCreate?: string;
    }[];
  };
}

export const req4534Config = (data: IReqapi4534) => ({
  url: `/activity/newer/invite/list`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 邀请记录
 **/
export default function (data: IReqapi4534 = {}): Promise<IResapi4534["data"]> {
  return request(req4534Config(...arguments));
}
