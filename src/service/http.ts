import Taro from '@tarojs/taro'
import { DEVICE_NAME } from '@/constants'
import { genUuid } from '@/components/Upload/oss'
import storge, { getToken, session } from '@/utils/storge'
import { getUrlParam, loginCertify } from '@/utils/base'
import { Sentry } from '@/sentry.repoter'
import { Severity } from '@sentry/browser'

// 创建新实例  默认配置
const env = `${Taro.ENV_TYPE[Taro.getEnv()]}_${process.env.NODE_ENV}`

export const weappVersion = WEAPP_VERSION

/**
 * 小程序过审状态,默认已过审
 */
let weappCheckedStatus = true

/**
 * 获取 小程序过审状态 true 为已过审
 * @returns
 */
export const getWeappCheckedStatus = () => weappCheckedStatus

const XTERMINAL = {
  weapp: 'MA',
  wxh5: 'MP',
  webh5: 'H5',
  iosbwh5: 'IOS',
  androidbwh5: 'ANDROID',
}

const hosts = {
  mock: 'http://yapi.bwyd.com/mock',
  dev: 'https://dev.bowuyoudao.com',
  test: 'https://dev.bowuyoudao.com',
  prod: 'https://h5.bowuyoudao.com',
}

export const host = hosts[API_ENV]

const urls = {
  mock: 'http://yapi.bwyd.com/mock',
  dev: 'http://dev.api.com',
  test: 'https://dev.bowuyoudao.com/web-api',
  prod: 'https://alpha.bowuyoudao.com',
}

interface AxiosOption {
  // isShowLoading: boolean;
  // loadingText: string;
  yapi?: string | number;
  url: string;
  data: any;
  method: any;
  header: {
    'content-type': string;
    'X-TOKEN': any;
    'X-TERMINAL': 'IOS' | 'ANDROID' | 'H5' | 'MP' | 'MA';
    'X-CHANNEL'?: string | number | undefined
  };
  success(res: any): Promise<Taro.General.CallbackResult> | undefined;
  error(e: any): void;
}
/**
 * 接口地址域名
 */
export const apiUrl = urls[API_ENV]

console.log(`API_ENV => ${API_ENV}, DEVICE_NAME : ${DEVICE_NAME}, apiUrl => ${apiUrl}, host => ${host}`)

let prefixApiUrl = urls[API_ENV]

// 出现异常 不会抛出
export const request = async (config: AxiosOption) => {

  const token = getToken()
  let channel = session.getItem('channel')
  if (API_ENV !== 'mock') {
    config.header['X-TOKEN'] = token
    config.header['X-TERMINAL'] = XTERMINAL[DEVICE_NAME]
    config.header['X-CHANNEL'] = channel
  }
  config.data = {
    ...(config.data || {}),
    requestId: genUuid(),
  }

  const requestData = {
    ...config,
    _beurl: config.url,
    url: API_ENV === 'mock' ? `${urls[API_ENV]}/${config.yapi}${config.url}` : (() => {
      // build 模式有过审配置
      return process.env.NODE_ENV === 'production' ? `${prefixApiUrl}${config.url}` : `${urls[API_ENV]}${config.url}`
    })()
  }

  try {
    const response = await Taro.request(requestData)
    console.log('请求：', {
      ...requestData,
      response,
    })

    if (API_ENV === 'mock' && response?.data?.code !== 1000) return Promise.resolve(response.data.data)
    if (response?.data?.code === 0) return Promise.resolve(response.data.data)
    // Sentry?.withScope(scope => {
    //   scope.setTag('be_api_url', requestData._beurl)
    //   scope.setLevel(Severity.Fatal)
    //   Sentry?.captureException(response.data)
    //   Sentry?.close()
    // })

    const rejectData = {
      ...response.data,
      _requestData: {
        url: requestData._beurl,
        data: requestData.data,
        method: requestData.method,
      }
    }

    if (process.env.TARO_ENV === 'weapp') {
      // 小程序需要手动捕获错误
      Sentry?.captureException(rejectData)
    }

    return Promise.reject(rejectData)
  } catch (e) {
    console.log('返回错误：', e);
    Taro.showToast({ title: '请求接口出现问题', icon: 'none' })
    return Promise.reject(e)
  }
}
// 异常提示
export const withErrToast = (fn) => {
  return fn.catch(e => {
    if (e?.code !== 1000) {
      Taro.showToast({ title: e?.message || e?.msg || '网络开小差~', icon: 'none' })
    }
    return Promise.reject(e)
  })
}

// 响应拦截器
export const withResponseIntercept = (fn) => {

  return fn.catch(e => {
    console.warn('service error', e)
    // TODO: 状态码拦截
    if (e.code === 1000) {
      console.log('登录拦截');
      
      loginCertify()
    } else if (e.code === 1010) {
      loginCertify.call(this, 1)
    }
    return Promise.reject(e)
  })
}

export default config => withResponseIntercept(withErrToast(request(config)))

/**
 * 获取小程序过审状态
 */
export const getAppCheckedStatus = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      resolve(undefined)
    } else if (
      process.env.NODE_ENV === 'production' &&
      process.env.TARO_ENV === 'weapp' &&
      API_ENV === 'prod'
    ) {
      Taro.request({
        url: `https://alpha.bowuyoudao.com/app/version/miniApp/auditStatus?version=${weappVersion}`,
        method: 'GET',
        success: (res) => {
          console.log(res)
          if (res.data.code === 0) {
            if (res.data.data.auditStatus === 0) {
              // 审核中
              prefixApiUrl = urls['test']
              weappCheckedStatus = false
            } else if (res.data.data.auditStatus === 1) {
              // 已过审
              prefixApiUrl = urls['prod']
              weappCheckedStatus = true
            }
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        },
        fail: (e) => {
          reject(e)
        }
      })
    } else {
      resolve(undefined)
    }

  })
}
