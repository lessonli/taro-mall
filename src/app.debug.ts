import qs from "query-string";
import api4280 from "./apis/21/api4280";
import { isAppWebview } from "./constants";
import { host } from "./service/http";
import { getAppToken } from "./utils/app.sdk";
import { loadScript } from "./utils/base";
import storge, { session, updateChannel, updateToken } from "./utils/storge";

function afterBridgeReadyGetToken () {
  return new Promise((resolve, reject) => {
    document.addEventListener('WebViewJavascriptBridgeReady', () => {
      console.log('pageReady');
      
      getAppToken().then(str => {
        resolve(str)
      }).catch(reject)
    })
  })
}

export default async function () {
  
  if (process.env.TARO_ENV === 'h5') {
    
    const { url, query } = qs.parseUrl(window.location.href)
    if (query.vconsole) {
      session.setItem('vconsole', true)
    }
    let { token, userCurrentPosition } = query

    token && updateToken(token)
    // 兼容
    if (API_ENV === 'prod') {

      if (url.includes('pages/goods_details/index')) {
        try {
          const res = await api4280({ type: 0, id: query.id || '', spid: query.spid || '' })
          window.location.replace(qs.stringifyUrl({
            url: `${host}/pages/goods/goodsDetail/index`,
            query: {
              channel: res?.channelNo || '',
              productId: res?.productId || '',
            }
          }))
        } catch (e) {
          window.location.replace(host)
        }

        return

      }
      // pages/columnAuction/auction_detail/index 拍品页
      if (url.includes('pages/columnAuction/auction_detail/index')) {
        try {
          const res = await api4280({ type: 1, id: query.id || '', spid: query.spid || '' })
          window.location.replace(qs.stringifyUrl({
            url: `${host}/pages/goods/goodsDetail/index`,
            query: {
              channel: res?.channelNo || '',
              productId: res?.productId || '',
            }
          }))
        } catch (e) {
          window.location.replace(host)
        }

        return

      }

      // 兼容店铺首页
      if (url.includes('pages/store/home/index')) {
        try {
          const res = await api4280({ type: 2, id: query.id || '', spid: query.spid || '' })
          window.location.replace(qs.stringifyUrl({
            url: `${host}/pages/store/index`,
            query: {
              channel: res?.channelNo || '',
              merchantId: res?.merchantId || '',
            }
          }))
        } catch (e) {
          window.location.replace(host)
        }
        return
      }
      // 其他页面都跳首页
      if (query.spid) {
        try {
          const res = await api4280({ type: 3, spid: query.spid || '' })
          window.location.replace(qs.stringifyUrl({
            url: host,
            query: {
              channel: res?.channelNo || '',
            }
          }))
        } catch (e) {
          window.location.replace(host)
        }
      }

      // // 兼容活动模板页面
      // if (url.includes('pages/activity/activityProp/index')) {
      //   const a = qs.stringifyUrl({
      //     url: `${host}/pages/store/index`,
      //     query: {
      //       ...query,
      //       channelId: query.pid || '',
      //       merchantId: query.id || '',
      //     }
      //   })
      //   window.location.replace(a)
      // }

    }

    if (session.getItem('vconsole') && process.env.TARO_ENV === 'h5') {
      loadScript('https://tsla.bowuyoudao.com/npm/vconsole/3.9.1/vconsole.min.js').then(() => {
        // @ts-ignore
        VConsole && new VConsole()
      })
    }

    if (query.debug) {
      session.setItem('debug', true)
    }

    if (process.env.NODE_ENV !== 'production') {
      window.wx = require('weixin-js-sdk')
    }

    const { channel } = qs.parse(location.search)

    channel && updateChannel(channel)
    // 原生app 参数
    if (userCurrentPosition && ['buyer', 'merchant'].includes(userCurrentPosition)) {
      storge.setItem('userCurrentPosition', userCurrentPosition)
      session.setItem('userCurrentPosition', userCurrentPosition)
    }
  }
}