// @ts-nocheck
/**
 * 检查app的版本更新
 * http://yapi.bwyd.com/project/21/interface/api/2966
 **/

import request from "@/service/http.ts";

/**
 * AppVersionCheckParam :AppVersionCheckParam
 */
export class IReqapi2966 {
  /**
   * 应用code
   */
  appCode?: string;
  /**
   * 平台，0->iOS;1->Android
   */
  platform?: number;
  /**
   * 应用版本，必须为正整数.正整数.正整数;会进行格式校验
   */
  appVersion?: string;
  /**
   * 设备号
   */
  deviceId?: string;
}

/**
 * Result<AppVersionCheckVo> :Result
 */
export class IResapi2966 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * AppVersionCheckVo
   */
  data?: {
    /**
     * 版本号
     */
    appVersion?: string;
    /**
     * 下载地址
     */
    url?: string;
    /**
     * 升级等级，0->不提示，1->弱提示，可忽略；2->强提示；3->强制升级
     */
    upgradeLevel?: number;
    /**
     * 提示语
     */
    tips?: string;
  };
}

export const req2966Config = (data: IReqapi2966) => ({
  url: `/app/version/check`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 检查app的版本更新
 **/
export default function (data: IReqapi2966 = {}): Promise<IResapi2966["data"]> {
  return request(req2966Config(...arguments));
}
