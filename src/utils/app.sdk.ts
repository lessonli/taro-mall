import {DEVICE_NAME, isAppWebview} from '@/constants'
import { sleep } from './cachedService';

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
  } else {
      document.addEventListener('WebViewJavascriptBridgeReady' , function() {
                                callback(WebViewJavascriptBridge)
                                }, false );
  }
  if (DEVICE_NAME !== 'iosbwh5') return
  // =====以下是iOS必须的特殊处理========
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
  // =====以上是iOS必须的特殊处理========
}

// 固定写法2 函数名字与1保持一致

if (isAppWebview) {
  setupWebViewJavascriptBridge(function(bridge) {
    // Java 注册回调函数，第一次连接时调用 初始化函数
    //  bridge.init();
    bridge.registerHandler('testJSFunction', (data, cb) => {
      console.log('app 调用 js')
      cb('js执行')
    })
  
  });
}
export const getAppToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    WebViewJavascriptBridge.callHandler(
      'getToken',
      '{}',
      (res) => {
        console.log('getToken 响应', res);
        const {code, data} = JSON.parse(res)
        if (code === 0) { 
          resolve(data)
        } else {
          reject(JSON.parse(res))
        }
      }
    )
  })
}

/**
 * 
 * @param query 打开app 商品详情页
 */
export const openAppProdcutDetail = (query: {
  productId: string;
  productType?: string;
  [x: string]: string;
}) => {
  WebViewJavascriptBridge.callHandler(
    'openNativePage',
    JSON.stringify({
      page: '/product/detail',
      params: query,
    }),
  )
}

/**
 * 打开app店铺首页
 * @param query 
 */
export const openAppMerchantHome = (query: {
  merchantId?: string;
  [x: string]: string;
}) => {
  WebViewJavascriptBridge.callHandler(
    'openNativePage',
    JSON.stringify({
      page: '/merchant/home',
      params: query || {},
    }),
  )
}

/**
 * js调用app 同步方法
 * @param methodName 
 * @param params 
 * @returns 
 */
export function runAppSyncMethod (
  methodName: string,
  params?: Record<string, any>,
) {
  return WebViewJavascriptBridge.callSyncHandler(
    methodName,
    params ? JSON.stringify(params) : undefined,
  )
}


/**
 * app调用 js 异步方法
 * @param methodName 
 * @param params 
 * @param cb 
 */
export function bwNativeCallJsAsyncFn (
  methodName: string,
  params: string,
  cb?: Function
) {
  const methods = {
    aaa: async (data) => {
      console.log(data)
      await sleep(1000)
      return {c: 2}
    }
  }
  methods[methodName]?.(JSON.parse(params)).then(res => cb?.(res))
}

export function noop () {}

const syncCbs = {
  loginSuccess: noop,
  webviewShow: noop,
}

/**
 * 监听app 调用js
 * @param methodName 
 * @param fn 
 */
export function addAppEventlistener (methodName: string, fn) {
  syncCbs[methodName] = fn
}

/**
 * 移除监听app 调用js
 * @param methodName 
 * @param fn 
 */
export function removeAppEventlistener (methodName: string, fn?) {
  syncCbs[methodName] = fn || noop
}


/**
 * app调用 js 同步方法
 * @param methodName 
 * @param params 
 */
 export function bwNativeCallJsSyncFn (
  methodName: string,
  params?: string,
) {
  return syncCbs[methodName](params)
}

if (process.env.TARO_ENV === 'h5' && isAppWebview) {
  window.bwNativeCallJsAsyncFn = bwNativeCallJsAsyncFn
  window.bwNativeCallJsSyncFn = bwNativeCallJsSyncFn
}

