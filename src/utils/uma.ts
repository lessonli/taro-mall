import dayjs from "dayjs"
import { session, userUuid } from "./storge"
const {UMA_APP_KEY} = require('@/constants/index')

let uma = undefined

if (process.env.TARO_ENV === 'weapp') {
  uma = require('umtrack-wx')
  wx.uma = uma
}

let inited = false

async function umaInit () {
  if (process.env.TARO_ENV === 'weapp') {
    console.log('UMA_APP_KEY', UMA_APP_KEY, uma);
    // await sleep(100)
    uma.init({
      appKey: UMA_APP_KEY,
      useOpenid: false,
      autoGetOpenid: false,
      debug: true,
      enableVerify: true,
    })
  
    // uma.setOpenid(WEAPP_APP_ID)

    inited = true
  }
}

umaInit()

export default uma

/**
 * 自定义埋点
 * https://developer.umeng.com/docs/147615/detail/169664
 */
export const sendCustomEvent = (
  // 事件名
  eventName: string, 
  prototys?: Record<string, string | number>,
  pageDetail?: Taro.RouterInfo<Partial<Record<string, string>>> | null
) => {
  

  let page = {}

  if (pageDetail) {
    page = {
      path: pageDetail?.path,
      params: pageDetail?.params,
      sence: pageDetail?.scene,
      shareTicket: pageDetail?.shareTicket,
    }
  }

  const {path, params} = session.getItem('entryFromPage')

  const data = {
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    userId: session.getItem('_userInfo')?.userId || '',
    // nickName: session.getItem('_userInfo')?.nickName,
    // userLevel: session.getItem('_userInfo')?.userLevel,
    // uuid: userUuid,
    channel: session.getItem('channel') || '',
    e_path: path || '',
    e_params: JSON.stringify(params || {}),
    // pageDetail: page,
    ...(prototys || {}),
  }

  console.log('上报埋点', eventName, data);
  

  wx?.aldstat?.sendEvent(eventName, data)
  
  uma?.trackEvent?.(eventName, data)
}