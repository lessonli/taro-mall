// @ts-nocheck
/**
 * 商户状态信息
 * http://yapi.bwyd.com/project/21/interface/api/2452
 **/

import request from "@/service/http.ts";

export class IReqapi2452 {}

/**
 * Result<MerchantStatusVo> :Result
 */
export class IResapi2452 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * MerchantStatusVo
   */
  data?: {
    /**
     * 商户编号
     */
    merchantNo?: string;
    /**
     * 商户等级（1\2\3-商户）,@seecom.bwyd.user.enums.MerchantLevelType
     */
    merchantLevel?: number;
    /**
     * 认证状态：0-未认证1-认证中（待审核）2-已认证,@seecom.bwyd.user.enums.MerchantAuthStatus
     */
    authStatus?: number;
    /**
     * 是否启用：0-未启用1-已启用
     */
    enable?: number;
    /**
     * 店铺保证金状态：0-未缴纳1-已缴纳
     */
    shopMarginStatus?: number;
    /**
     * 是否设置退货地址：0-未设置1-已设置
     */
    returnAddressStatus?: number;
    /**
     * 自营店铺：0-非自营1-自营
     */
    ownShop?: number;
    /**
     * 是否允许佣金提现：0-不允许1-允许
     */
    enableWithdrawCommission?: number;
    /**
     * 是否允许货款提现：0-不允许1-允许
     */
    enableWithdrawProduct?: number;
  };
}

export const req2452Config = (data: IReqapi2452) => ({
  url: `/merchant/status`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 商户状态信息
 **/
export default function (data: IReqapi2452 = {}): Promise<IResapi2452["data"]> {
  return request(req2452Config(...arguments));
}
