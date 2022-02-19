import * as SentryWeb from '@sentry/browser'
import Taro from "@tarojs/taro";
import { weappVersion } from "./service/http"
import { Integrations } from "@sentry/apm"
import storge, { session, userUuid } from "./utils/storge"
import dayjs from "dayjs";
import { DEVICE_NAME } from "./constants";

/**
 * 启用sentry上报环境变量
 */
export const SENTRY_REPORT_ENV = (API_ENV === 'test' || API_ENV === 'prod') && process.env.NODE_ENV === 'production'
// export const SENTRY_REPORT_ENV = true

const Sentry = SENTRY_REPORT_ENV ? SentryWeb : undefined

export {
  Sentry
}

const dsns = {
  'bwyd_weapp': 'https://d002036c466d4ecc8b5dc59b5ab7dd21@Sentry.bowuyoudao.com/2',
  'online_bwyd_weapp': "https://e6ce43633ad548e4a05de7f21754cf23@Sentry.bowuyoudao.com/3",
  'online_h5_weapp': 'https://71edccf1a97148429f2290d9eb8b60a6@sentry.bowuyoudao.com/11',
}

/**
 * 手动捕获异常
 *  Sentry?.captureException({
              exceptionName,
              errs,
              value,
            })
 */
export type IHandleCaptureException = {
  /**
   * 该值会被设置 到tag HCE 上
   */
  exceptionName: string;
  errs: any;
  value: any;
  /**
   * 资源重试次数
   */
  RETRY_TIMES?: number;
}

const beforeSend = (event, hint) => {
  
  event.user = {
    uuid: userUuid,
    userId: session.getItem('_userInfo')?.userId,
    nickName: session.getItem('_userInfo')?.nickName,
    userLevel: session.getItem('_userInfo')?.userLevel,
  }

  if (hint?.originalException === undefined) {
    // Sentry?.close()
    return null
  }
  // 返回 null， 表示过滤掉事件，不上传
  // https://zhuanlan.zhihu.com/p/205144885
  if (
    hint.originalException?.code === 1000 ||
    (
      hint.originalException?.code === 2024 && hint.originalException?.message === '用户未登录'
    ) || (
      hint.originalException?.code === 2025 && hint.originalException?.message === '重复登录'
    )
  ) {
    return null
  }

  if (hint.originalException?.code !== undefined) {
    event.tags = {
      ...event.tags,
      code: hint.originalException.code,
      api_url: hint.originalException._requestData?.url,
    }
  }

  // 手动捕获消息格式
  if (hint.originalException?.exceptionName) {
    event.tags = {
      ...event.tags,
      HCE: hint.originalException.exceptionName,
    }
  }

  if (hint.originalException?.RETRY_TIMES) {
    // 资源重试次数
    event.tags.RETRY_TIMES = hint.originalException?.RETRY_TIMES
  }

  console.log('sentry beforeSend =>', event, hint)

  return event
}

Sentry?.init({
  dsn: API_ENV === 'prod' ? dsns.online_h5_weapp : dsns.bwyd_weapp,
  release: RELEASE,
  beforeSend,
  environment: process.env.NODE_ENV,
  integrations: ([
    process.env.TARO_ENV === 'h5' && new Integrations.Tracing()
  ]).filter(Boolean)
})

Sentry?.configureScope(scope => {
  // scope.setTag('version', weappVersion)
  scope.setTag('taro_platform', DEVICE_NAME)
})

if (process.env.TARO_ENV === 'h5') {
  window.catchToSentry = Sentry?.captureException
}
/**
 * sentry 可以对特定流程做异常监控
 * 如直播间页面 params 上参数 roomId为必填，为校验进入页面流程，可以如下处理
 * useEffect(() => {
    const value = page.router?.params || {}
    asyncValidate(
      {
        roomId: {
          required: true,
        },
      },
      value,
    ).catch((errs) => {
      Sentry?.captureException({
        exceptionName: 'live_room_url_params',
        errs,
        value,
      } as IHandleCaptureException)
    })
  }, [])

  打开 sentry 平台， 查找tag HCE 为对应 'live_room_url_params'值的
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */