import { DEVICE_NAME, systemInfo } from "@/constants";
import { apiUrl, getWeappCheckedStatus, host } from "@/service/http";
import Taro, { NodesRef } from "@tarojs/taro";
import Big from "big.js";
import dayjs from 'dayjs'
import load from "load-script";
import { session, updateToken } from "./storge";
import qs from 'query-string'
import Downloader from '@/components/Poster/components/downLoad'
import { getUserAvatar } from "./poster";


const downloader = process.env.TARO_ENV === 'weapp' ? new Downloader() : { download: () => new Promise(() => { }) }// h5缓存待定

/**
 * 海报图片缓存
 * @param preList  业务组件缓存
 * @param key  对于key值 如 icon图片传 icon
 * @param data  图片地址
 * @returns  对应参数值
 */
export const cacheImg = (data: string | string[]) => {
  return new Promise(async (resolve) => {
    if (process.env.TARO_ENV === 'weapp') {
      if (data instanceof Array) {
        let list = []
        data.forEach(img => {
          list.push(downloader.download(img, true))
        })
        const result = Promise.all(list)
        resolve(result)
      } else {
        downloader.download(data, true).then(result => {
          resolve(result)
        })
      }
    } else {
      resolve(true)
    }
  })
}

/**
 * 海报比缓存比对是否用库存
 * @param pre  业务组件缓存
 * @param key  对于key值 如 icon图片传 icon
 * @param baseUrl  初始图片地址
 * @param size  oss图片比例
 * @returns  对应参数值
 */

export const getCacheImg = (pre: any, baseUrl?: string, size?: number) => {
  return baseUrl
}

const SystemInfo = Taro.getSystemInfoSync()

/**
 * 获取url上对应的参数
 * @param name  参数
 * @returns  对应参数值
 */
export const getUrlParam = (name: string) => {
  var href = window.location.href;
  var url = href.split("?");
  if (url.length <= 1) {
    return "";
  }
  var params = url[1].split("&");

  for (var i = 0; i < params.length; i++) {
    var param = params[i].split("=");
    if (name == param[0]) {
      return param[1];
    }
  }
}

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


/**
 * 获取dom
 * @returns  dom
 */

export const selectorQueryClientRect = (
  selector: string,
): Promise<NodesRef.BoundingClientRectCallbackResult> =>
  new Promise(resolve => {
    const query = Taro.createSelectorQuery();
    query
      .select(selector)
      .boundingClientRect((res: NodesRef.BoundingClientRectCallbackResult) => {
        resolve(res)
      })
      .exec()
  })

// 转化递归数据结构
export const mapProtites = function (source: any[], ...args: Record<string, string>[]) {
  const a = typeof arguments[1] === 'string'
  const childrenKey = a ? arguments[1] : 'children'
  const protitesArr = Array.prototype.slice.call(arguments, a ? 2 : 1, arguments.length)

  return source.map((item) => {
    const newItem = {}
    protitesArr.forEach(protites => {
      Object.keys(protites).reduce((res, current) => {
        res[protites[current]] = item[current]
        return res
      }, newItem)

      if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
        newItem['children'] = mapProtites(item[childrenKey], ...args)
      }
    })
    return newItem
  })
}

// 时间格式化
export const formatDate = (date: string | number | undefined, formatType = 'YYYY-MM-DD HH:mm') => dayjs(date || '').format(formatType)

/**
 * 金钱 千分位转化
 * @param num 
 * @returns 
 */
export const formatMoeny = (num: number | string = '') => (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')

/**
 * 金钱 分 => 元
 * @param num 
 * @returns 
 */
export const fen2yuan = (num: any) => {
  if (!num) return 0
  var regexp = /(?:\.0*|(\.\d+?)0+)$/
  num = (num / 100).toFixed(2)
  num = num.replace(regexp, '$1')
  // const a = new Big(num)
  // // const b = a.div(100).toNumber()
  // console.log(num)
  return num
}

/**
 * 元转分
 * @param num 
 * @returns 
 */
export const yuan2fen = (num: any) => {
  if (['', undefined, null].includes(num)) return ''
  const a = new Big(num)
  const b = a.mul(100).toNumber()
  return b
}
// 富文本转化
export const escape2Html = (str: string) => {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; }).replace('<section', '<div').replace('<img', '<img style="max-width:100%;height:auto" ');
}
console.log(SystemInfo)
// 获取真实像素 88px = 11.73vw
export const getRealSize = (px: number) => px / (750 / 100) * (SystemInfo.screenWidth / 100)

export const getEmojiSize = (px: number) => px * SystemInfo.screenWidth / 750

//动态向url添加参数
export const addOrgToUrl = (url, paramName, replaceWith) => {
  //url字符串添加参数
  //url:路径地址 paramName：参数名 replaceWith：参数值
  if (url.indexOf(paramName) > -1) {
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    url = url.replace(re, paramName + '=' + replaceWith);
  } else {
    var paraStr = paramName + '=' + replaceWith;

    var idx = url.indexOf('?');
    if (idx < 0)
      url += '?';
    else if (idx >= 0 && idx != url.length - 1)
      url += '&';
    url = url + paraStr;
  }
  return url;
}

// 获取要传到address的地址

export const getUrl2Address = (url, page, type?) => {
  let pathName
  if (type) {
    pathName = url
    for (const key in page.router?.params) {
      console.log(key);

      key !== 'sourceUrl' && (pathName = addOrgToUrl(pathName, key, page.router?.params[key]))
    }
  } else {
    pathName = addOrgToUrl(url, 'sourceUrl', page.app.config.router.pathname)
    for (const key in page.router?.params) {
      pathName = addOrgToUrl(pathName, key, page.router?.params[key])
    }
  }
  return pathName
}
/**
 * 计算倒计时
 * @param endTime 
 * @param delay 
 * @param start 
 * @returns 
 */
export const countDownTimeStr = (endTime: number, delay = 0, start = dayjs().valueOf()) => {
  const r = endTime - delay - start
  const h = Math.floor(r / 1000 / 60 / 60)
  const m = Math.floor(r / 1000 / 60 % 60)
  const s = Math.floor(r / 1000 % 60)
  return r > 0 ? {
    h, m, s,
    hh: h > 9 ? h : '0' + h,
    mm: m > 9 ? m : '0' + m,
    ss: s > 9 ? s : '0' + s,
  } : null
}

// 销量展示

export const numCount = (num) => {
  if (num < 999) {
    return num
  }
  if (num > 999 && num < 10000) {
    return '999+'
  }
  if (num > 10000) {
    return '1w+'
  }
}

/**
 * web 端 title 更新
 * @param title 
 */
export const updateH5Title = (title: string) => {
  if (process.env.TARO_ENV === 'h5') {
    document.title = title
  }
}

export const debounce = function (func, wait) {
  let timer;
  return function () {
    let context = this; // 注意 this 指向
    let args = arguments; // arguments中存着e

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

const loginJump = (type) => {
  if (DEVICE_NAME === 'wxh5') {
    const url = window.location.origin + '/pages/other/login-mobile/index'
    const channel = session.getItem('channel')
    session.setItem('redirect', window.location.href)
    if (type === 1) {
      Taro.navigateTo({
        url: '/pages/other/login-mobile/index'
      })
    } else {
      window.location.href = `${apiUrl}/auth/wx/mp/auth-url?appId=${APP_ID}&sourceUrl=${encodeURIComponent(url)}&wxH5LoginType=NORMAL&channel=${channel}`
    }
  } else if (DEVICE_NAME === 'webh5') {
    if (window.location.href.indexOf('login-mobile') < 0) {
      session.setItem('redirect', window.location.href)
    }
    Taro.redirectTo({
      url: '/pages/other/login-mobile/index'
    })

  } else if (DEVICE_NAME === 'weapp') {
    // let path = Taro.getCurrentInstance().router?.path
    // path = path?.startsWith('/') ? path : '/' + path
    // 部分机型 无法获取Taro.getCurrentInstance().page?.$taroPath 需要降级处理
    //@ts-ignore
    const path = '/' + Taro.getCurrentInstance().page?.$taroPath || 'pages/index/index'
    session.setItem('redirect', path)
    Taro.redirectTo({
      url: getWeappCheckedStatus() ? '/pages/login/index' : '/pages/other/login-mobile/index'
    })
  } else if (DEVICE_NAME === 'iosbwh5' || DEVICE_NAME === 'androidbwh5') {
    WebViewJavascriptBridge.callHandler(
      'openNativePage',
      JSON.stringify({
        page: 'login'
      }),
      (appres) => {
        const appRes = JSON.parse(appres)
        if (appRes.code === 0) {
          updateToken(appRes.data)
        } else {
          console.warn(`用户在app端取消了登录`)
        }
      }
    )
  }
}


export const loginCertify = debounce(loginJump, 1000)


export const loadScript = (src: string) => {
  const id = `bw-${src}`
  return new Promise((reslove, reject) => {

    if (document.getElementById(id)) {
      reslove(undefined)
      return
    }

    load(src, {
      attrs: {
        id
      },
      id
    }, (err, script) => {
      if (err) {
        reject(err)
      } else {
        reslove(script)
      }
    })
  })

}

export const unitChatTime = (value) => {
  let today = new Date(new Date(new Date().toLocaleDateString()).getTime())
  const time = dayjs(today).valueOf()
  if (value * 1000 < time && value * 1000 > time - 86400000) {
    return '昨天 ' + dayjs(value * 1000).format('HH:mm:ss')
  }
  if (value * 1000 > time) {
    return dayjs(value * 1000).format('HH:mm:ss')
  }
  if (value * 1000 < time - 86400000) {
    return dayjs(value * 1000).format('MM-DD HH:mm:ss')
  }
}

/**
 * 图片代理
 * @param src 
 * @param query 
 * @returns 
 */
export const getHostProxyImg = (src: string, query?: Record<string, string>) => {
  const { url: urle, query: queryf } = qs.parseUrl(src)
  const c = qs.stringifyUrl({
    url: urle,
    query: {
      ...queryf,
      ...(query || {}),
    }
  })
  const arr = ['https://image.bowuyoudao.com', 'https://bwyd-test.oss-cn-hangzhou.aliyuncs.com']

  const m = arr.find(item => src.startsWith(item))

  if (m) {
    return c
  }

  // const u = `${src}${src.indexOf('?') > 0 ? '&' : '?'}x-oss-process=image/resize,p_50`
  const a = `${host}/proxy-image/${c}`
  return a
}

export function deepClone(obj = {}) {
  // obj是null或undefined（注意这里使用的==不是===）或者不是对象和数组，直接返回
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  // 初始化返回结果
  let result
  if (obj instanceof Array) {
    result = []
  } else {
    result = {}
  }
  for (let key in obj) {
    // 保证 key 不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 递归
      result[key] = deepClone(obj[key])
    }
  }
  // 返回结果
  return result
}

const preLoadImgFn = () => {
  const loadedImages: string[] = []

  const fn = (src: string) => {
    if (loadedImages.includes(src) || process.env.NODE_ENV === 'development') {
      return Promise.resolve(src)
    }
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'weapp') {
        // TODO: downloadFile getImageInfo
        Taro.getImageInfo({
          src,
          success: (res) => {
            resolve(src)
          },
          fail: reject
        })
      } else {
        const img = new Image();
        img.src = src
        img.crossOrigin = "anonymous";
        img.onload = function () {
          resolve(src)
        }

        img.onerror = reject
      }
    })
  }

  return fn
}

/**
 * 预加载图片
 */
export const preLoadImg = preLoadImgFn()

export const queryUrlParams = (url) => {
  let result = {};
  let reg1 = /([^?=&#]+)=([^?=&#]+)/g
  let reg2 = /#([^?&=#]+)/g
  url.replace(reg1, (n, x, y) => result[x] = y)
  url.replace(reg2, (n, x) => result['HASH'] = x)
  return result
}

/**
 * 
 * 处理返回的用户名及店铺名（包含emoji）
 * @param name 
 * @param length 
 * @returns 
 */

export const dealName = (name: string, length: number) => {
  if (name) {
    if (name.length > length) {
      return Array.from(name).slice(0, length).join('') + '...'
    } else {
      return name
    }
  } else {
    return ''
  }
}

export const couponTIme = (time) => {

  //获取当前时间
  let now = new Date().getTime();
  if (time - now >= 24 * 60 * 60 * 1000) {
    let diffTime = time - now
    return Math.floor(diffTime / (24 * 60 * 60 * 1000)) + '天'
  } else {
    return '1天'
  }
}
/**
 * 
 * 将hel（#ffffff）转rgb
 */
export const hexToRgb = (hex) => {

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {

    r: parseInt(result[1], 16),

    g: parseInt(result[2], 16),

    b: parseInt(result[3], 16)

  } : null;

}

//navigateTo 跳转判断

const switchTabList = ['/pages/index/index', '/pages/classify/index', '/pages/im/index', '/pages/my/index/index']

export const BwTaro = {
  navigateTo: (option: Taro.navigateTo.Option) => {
    let isTabPath = false
    switchTabList.forEach(item => {
      if (option.url.startsWith(item)) {
        isTabPath = true
      }
    })
    if (option && isTabPath && process.env.TARO_ENV === 'weapp') {
      Taro.switchTab(option)
    } else {
      // 可能存在带参数匹配不到，做次兜底
      Taro.navigateTo(option).catch(() => {
        Taro.switchTab(option)
      })

    }
  },
  redirectTo: (option: Taro.redirectTo.Option) => {
    let isTabPath = false
    switchTabList.forEach(item => {
      if (option.url.startsWith(item)) {
        isTabPath = true
      }
    })
    if (option && isTabPath && process.env.TARO_ENV === 'weapp') {
      Taro.switchTab(option)
    } else {
      // 可能存在带参数匹配不到，做次兜底
      Taro.redirectTo(option).catch(() => {
        Taro.switchTab(option)
      })

    }
  }
}

export const days2second = (day:number)=>{
  return day*24*60*60
}
export const hours2Second=(hour:number)=>{
  return hour*60*60
}

// export const ms2seconds = (ms:number)=>{
//   return ms/1000
// }
// export const second2Minutes = (second:number)=>{
//   return second/60
// }

// export const minutes2hours = (minutes:number)=>{
//   return minutes/60
// }
// export const hours2day = (hours:number)=>{
//   return hours/24
// }

// export const ms2day =(ms)=>{
//   return compose( hours2day,minutes2hours,second2Minutes,ms2seconds)(ms)
// }

 