// @ts-nocheck
/**
 * 查询直播群历史消息，最后30条
 * http://yapi.bwyd.com/project/21/interface/api/4842
 **/

import request from "@/service/http.ts";

export class IReqapi4842 {
  /**
   * (String)
   */
  roomId?: string | number;
}

/**
 * Result<List<IMGroupMsgCallbackParam>> :Result
 */
export class IResapi4842 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * IMGroupMsgCallbackParam
   */
  data?: {
    groupId?: string;
    type?: string;
    fromAccount?: string;
    msgTime?: number;
    /**
     * IMGroupMsgBodyParam
     */
    msgBody?: {
      msgType?: string;
      msgContent?: string;
    }[];
    /**
     * IM用户信息 ,ProdLiveUserVo
     */
    liveUser?: {
      /**
       * 用户昵称|商户名称
       */
      nickName?: string;
      /**
       * 用户头像|商户logo
       */
      headImg?: string;
      /**
       * 直播间用户IM标识
       */
      identifier?: string;
      /**
       * 会员等级
       */
      memLevel?: number;
    };
  }[];
}

export const req4842Config = (data: IReqapi4842) => ({
  url: `/live/room/historyMsg`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 查询直播群历史消息，最后30条
 **/
export default function (data: IReqapi4842 = {}): Promise<IResapi4842["data"]> {
  return request(req4842Config(...arguments));
}
