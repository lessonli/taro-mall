// @ts-nocheck
/**
 * 用户进出直播群
 * http://yapi.bwyd.com/project/21/interface/api/4716
 **/

import request from "@/service/http.ts";

/**
 * JSONObject :JSONObject
 */
export class IReqapi4716 {
  /**
   * TimeZone
   */
  defaultTimeZone?: {
    ID?: string;
    /**
     * TimeZone
     */
    defaultTimeZone?: {};
    /**
     * TimeZone
     */
    mainAppContextDefault?: {};
  };
  /**
   * Locale
   */
  defaultLocale?: {
    /**
     * BaseLocale
     */
    baseLocale?: {
      hash?: number;
    };
    /**
     * LocaleExtensions
     */
    localeExtensions?: {};
    hashCodeValue?: number;
    /**
     * Locale
     */
    defaultLocale?: {};
    /**
     * Locale
     */
    defaultDisplayLocale?: {};
    /**
     * Locale
     */
    defaultFormatLocale?: {};
    languageTag?: string;
    /**
     * :
     */
    isoLanguages?: string[];
    /**
     * :
     */
    isoCountries?: string[];
  };
  DEFAULT_TYPE_KEY?: string;
  DEFFAULT_DATE_FORMAT?: string;
  DEFAULT_PARSER_FEATURE?: number;
  DEFAULT_GENERATE_FEATURE?: number;
}

/**
 * IMCallbackResult :IMCallbackResult
 */
export class IResapi4716 {
  ActionStatus?: string;
  ErrorInfo?: string;
  ErrorCode?: number;
}

export const req4716Config = (data: IReqapi4716) => ({
  url: `/live/callback/im`,
  method: "POST",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 用户进出直播群
 **/
export default function (data: IReqapi4716 = {}): Promise<IResapi4716["data"]> {
  return request(req4716Config(...arguments));
}
