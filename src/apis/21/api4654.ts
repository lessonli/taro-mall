// @ts-nocheck
/**
 * 获取小程序"临时"scheme码       httpsdevelopers.weixin.qq.comminiprogramdevapi-backendopen-apiurl-schemeurlscheme.generate.html
 * http://yapi.bwyd.com/project/21/interface/api/4654
 **/

import request from "@/service/http.ts";

export class IReqapi4654 {
  /**
   * 小程序路径
   */
  path?: string | number;
  /**
   * 通过scheme码进入小程序时的query，最大128个字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()+,:;=?@-._~
   */
  query?: string | number;
}

/**
 * Result<String> :Result
 */
export class IResapi4654 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * data
   */
  data?: string;
}

export const req4654Config = (data: IReqapi4654) => ({
  url: `/wx/ma/schema`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 获取小程序"临时"scheme码       httpsdevelopers.weixin.qq.comminiprogramdevapi-backendopen-apiurl-schemeurlscheme.generate.html
 **/
export default function (data: IReqapi4654 = {}): Promise<IResapi4654["data"]> {
  return request(req4654Config(...arguments));
}
