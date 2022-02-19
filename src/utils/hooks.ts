import { DEVICE_NAME } from "@/constants";
import api1772 from "@/apis/21/api1772";
import { factory, getUserInfo } from "./cachedService";
import { useCallback, useEffect, useState } from "react";
import qs from 'query-string'
import storge, { session, updateChannel } from "./storge";
import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import api3554 from "@/apis/21/api3554";
import { BWYD_ICON } from "@/constants/images";
import { host } from "@/service/http";

// ios 上对第一次进入的页面验签 ，android 每一个页面都要授权？


let url

const ua = navigator.userAgent.toLowerCase()

if (process.env.TARO_ENV === 'h5') {
  // wx = require('weixin-js-sdk');
  url = location.href
}

export const setWxH5Config = (href = url, jsApiList = [
  'checkJsApi', 'chooseWXPay', 'updateAppMessageShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getLocalImgData'
]): Promise<any | undefined> => {
  if (DEVICE_NAME !== 'wxh5') return Promise.resolve(undefined)
  if (/android/.test(ua)) {
    // 安卓需要使用当前页面url授权
    url = location.href
  }

  if (/ios/.test(ua) && href !== undefined) {
    url = href
  }

  return new Promise((resolve, reject) => {
    api1772({ appId: APP_ID, url }).then((res) => {
      wx.config({
        debug: session.getItem('debug'),
        appId: res?.appId,
        nonceStr: res?.nonceStr,
        signature: res?.signature,
        timestamp: res?.timestamp,
        jsApiList,
        openTagList: ['wx-open-launch-weapp', 'wx-open-launch-app']
      })

      wx.ready(() => {
        console.log(`wx.ready`)
        resolve(wx)
      })

      wx.error(() => {
        console.log('wx.error')
        reject()
      })
    }).catch(err => {
      console.log('api1772 err')
      reject()
    })
  })
}

/**
 * 缓存过的wx 签名
 */
export const cachedWxConfig = factory(
  Symbol('wx-share'),
  () => setWxH5Config(),
  5 * 60 * 1000,
)

export const cachedShareData = factory(
  Symbol('cachedShareData'),
  () => api3554({
    shareType: 1,
  })
)

/**
 * 解析H5分享链接为小程序分享信息
 * @param link 
 * @returns 
 */
export const parseH5LinkToWeapp = (link: string) => {
  const { url, query } = qs.parseUrl(link)
  return {
    path: url.replace(host, ''),
    query: Object.keys(query).reduce((arr, key) => {
      arr.push(`${key}=${query[key]}`)
      return arr
    }, []).join('&'),
  }
}

/**
 * 页面 自动调用微信默认分享
 * 需要重新定义分享的请不要调用该hook
 * @param data 
 */
export const useWxShare = (
  data?: {
    title?: string;
    desc?: string;
    link?: string;
    imgUrl?: string;
  }
) => {

  useEffect(() => {
    if (process.env.TARO_ENV === 'h5') {
      (async () => {
        const res = await cachedShareData()
        const shareData = {
          title: useAppTitle(),
          desc: res?.subTitle,
          link: res?.shareUrl,
          imgUrl: BWYD_ICON,
          ...(data || {}),
        }
        const wx = await cachedWxConfig()
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)

      })()
    }
  }, [])

  // 小程序 分享回调
  if (process.env.TARO_ENV === 'weapp') {
    useShareAppMessage(async (options) => {
      const res = await cachedShareData()
      const shareData = {
        title: useAppTitle(),
        imageUrl: BWYD_ICON,
        path: res?.shareUrl?.replace(host, ''),
      }
      if (options.from !== 'button') {
        console.warn(`按钮触发的分享 如果你需要使用自定义，不要使用该hook`)
      }
      return shareData
    })

    useShareTimeline(async () => {
      const res = await cachedShareData()
      const shareData = {
        title: useAppTitle(),
        imageUrl: BWYD_ICON,
        path: res?.shareUrl?.replace(host, ''),
      }
      return shareData
    })
  }
}

/**
 * 小程序 动态切换channo
 */
export const useWeappUrlChannelHook = () => {
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      const app = Taro.getCurrentInstance()
      const params = app.router?.params
      console.log('useWeappUrlChannelHook', params);
      // 从分享链路 isShare进来的
      if (params?.isShare !== undefined) {
        updateChannel(params.channel)
      }
    }
  }, [])
}

export const useUserTypeHook = () => {
  const [userType, useUserType] = useState<'merchant' | 'buyer'>('buyer')
  useEffect(() => {
    getUserInfo().then(res => {
      if (res.userLevel === 3) {
        useUserType('merchant')
      }

    })
  }, [])
  return { userType }
}

export const useUserTypeHookHome = () => {
  const [userType, useUserType] = useState<string>('')
  useEffect(() => {
    getUserInfo().then(res => {
      if (res.userLevel === 3) {
        useUserType('merchant')
      } else {
        useUserType('buyer')
      }

    })
  }, [])
  return { userType }
}

/**
 * useAsync 使用async类操作,如 提交：

value: promise返回的数据，并保存在state中
pending: promise的pending状态
error: promise的出错状态
setValue: 手动改变value的方法
run: 手动触发请求的方法

示例

const {run: handleSubmit, value, pending} = useAsync(async () => {
  await sleep(1000)
  toast('提交成功')
  return {id: 'xxx'}
}, false)

<Button disabled={pending} onClick={handleSubmit}>提交</Button>
<View>提交返回的结果 {value}</View>
 */
export const useAsync = <T extends any>(asyncFunction: (
  ...args: any[]) => Promise<T>,
  options?: {
    /**
     * 手动调用
     */
    manual: boolean;
  }
) => {
  const [value, setValue] = useState<T | undefined>(undefined)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<any>(undefined)

  const run = useCallback(
    (...args) => {
      setPending(true)
      setError(undefined)
      return asyncFunction(...args)
        .then((response) => {
          setValue(response)
          return Promise.resolve(response)
        })
        .catch((error) => {
          setError(error)
          return Promise.reject(error)
        })
        .finally(() => {
          setPending(false)
        })
    },
    [asyncFunction]
  )

  useEffect(() => {
    if (!options?.manual) {
      run()
    }
  }, [run, options?.manual])

  return { value, pending, error, setValue, run }
}

export const useAppTitle = () => {
  return API_ENV === 'prod' ? '博物有道' : '博览万物'
}