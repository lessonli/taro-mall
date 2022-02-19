/// <reference path="node_modules/@tarojs/plugin-platform-weapp/types/shims-weapp.d.ts" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

declare var API_ENV: 'mock' | 'test' | 'prod' | 'dev'
declare var ASSET_CDN: string
/**
 * 小程序 appid
 */
declare var APP_ID: string

/**
 * 小程序 appid 同 APP_ID
 */
 declare var WEAPP_APP_ID: string

/**
 * 小程序 ghid(原始id)
 */
 declare var WEAPP_GH_ID: string

/**
 * 小程序 版本号
 */
 declare var RELEASE: string

/**
 * js 调用 native app
 */
declare var WebViewJavascriptBridge:  {
  callHandler: (
    method: string,
    req: string,
    callback?: (res: string) => any,
  ) => void;

  registerHandler: (
    method: string,
    callback: () => void,
  ) => void;
}
