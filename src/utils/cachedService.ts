import api1652, { IResapi1652 } from "@/apis/21/api1652";
import Taro from '@tarojs/taro'
import { request } from '@/service/http'
import { req2100Config, IResapi2100 } from "@/apis/21/api2100";
import api2108, { IResapi2108, req2108Config } from "@/apis/21/api2108";
import api2452, { IReqapi2452, IResapi2452, req2452Config } from "@/apis/21/api2452";
import api2220 from "@/apis/21/api2220";
// import { API_ENV } from "@/service/http";
import { mapProtites } from "./base";

import { chinaAddrsData, Categories } from "./mockData";
import { IResapi2912, req2912Config } from "@/apis/21/api2912";
import api2996 from "@/apis/21/api2996";
import api2260, { IResapi2260 } from "@/apis/21/api2260";
import api1892, { IResapi1892 } from "@/apis/21/api1892";
import dayjs from "dayjs";
import api4602 from "@/apis/21/api4602";
import api4508 from "@/apis/21/api4508";
import { session, updateToken } from "./storge";
import { req4082Config, IResapi4082 } from "@/apis/21/api4082";
import api4292 from "@/apis/21/api4292";
import api4808 from "@/apis/21/api4808";
// import { getWeappAuthCode } from "@/components/WxComponents/useWeappLogin";
import api1788 from "@/apis/21/api1788";
import debounce from 'lodash/debounce'


export type IChinaTree = {
  label: string;
  level?: number;
  value: string | number;
  children?: IChinaTree;
}[]

const cachedApiMap: Map<Symbol, { request: any; updateTime: number }> = new Map();

/**
 * 订单角色
 */
export const cachedOrderMap: Record<string, 'buyer' | 'merchant'> = {}

/**
 * 查询 订单角色
 * @param orderNo 
 * @returns 
 */
export const getCachedOrderRule = async (orderNo: string) => {
  if (cachedOrderMap[orderNo] !== undefined) return cachedOrderMap[orderNo]
  const res = await api4292({ orderNo })
  // 0用户, 1商户
  const userCurrentPosition = res === 0 ? 'buyer' : 'merchant'
  cachedOrderMap[orderNo] = userCurrentPosition
  return userCurrentPosition
}

/**
 * 清除系统接口缓存
 */
export const clearCache = () => {
  Array.from(cachedApiMap).forEach(([key]) => {
    cachedApiMap.delete(key)
  });
}

/**
 * 请求缓存
 * 支持 自动重置
 * 支持 缓存超时重置
 * @param name 
 * @param fn 
 * @param cacheTime 
 * @returns 
 */
export const factory = <T = any>(
  name: any,
  fn: () => Promise<T>,
  /**
   * 缓存有效期 默认1min
   */
  cacheTime = 1 * 60 * 1000,
) => {

  let state = 'pending'

  const cachedFn = function (): Promise<T> {
    
    if (!cachedApiMap.get(name)) {
      const updateTime = new Date().getTime()
      state = 'pending'
      const request = fn()
      cachedApiMap.set(name, {
        request,
        updateTime,
      });
      request.then(() => {
        state = 'fulfilled'
      }).catch(() => {
        state = 'rejected'
      })
      return request
    } else {
      if (state === 'rejected') {
        // 上次请求出错，下次请求走重置
        return cachedFn.reset()
      }
      const updateTime = cachedApiMap.get(name)?.updateTime as number
      if (new Date().getTime() - updateTime >= cacheTime) {
        // 缓存过期
        return cachedFn.reset()
      }
      return cachedApiMap.get(name)?.request;
    }
  };

  cachedFn.reset = function () {
    cachedApiMap.delete(name);
    return cachedFn();
  };

  return cachedFn;
};

export const sleep = (delay: number = 3000) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(`sleeped ${delay}ms`)
    resolve(delay)
  }, delay);
})

let hasTryCodeLogin = false

const getWeappAuthCode = () => new Promise((reslove, reject) => {
  Taro.login({
    success: res => {
      if (res?.code && !!res?.code) {
        reslove(res.code)
      } else {
        reject(res)
      }
    },
    fail: reject
  })
})

const weappCodeLogin = async () => {
  await sleep(10)
  const code = await getWeappAuthCode()
  console.log('code', code);
  
  const userInfo = await api1788({code, appId: WEAPP_APP_ID})
  userInfo?.token && updateToken(userInfo?.token)
  return userInfo?.token
}

export const tryCodeLogin = factory(
  Symbol('tryCodeLogin'),
  async () => {
    if (process.env.TARO_ENV !== 'weapp') {
      return Promise.resolve()
    } else {
      return weappCodeLogin()
    }
  },
  1 * 60 * 1000
)

/**
 * 获取用户
 */
export const getUserInfo = factory<Required<IResapi2100>['data']>(
  Symbol('getUserInfo'),
  async () => {
    try {
      // @ts-ignore
      const res = await request(req2100Config({}))
      session.setItem('_userInfo', res)
      return res as Required<IResapi2100>['data']
    } catch (err) {
      if (hasTryCodeLogin) return Promise.reject(err)
      hasTryCodeLogin = true
      console.log('尝试code login');
      const a = await tryCodeLogin()
      console.log('重新获取用户信息', a);
      return getUserInfo.reset()
    }
  },
  2 * 60 * 1000
)


// 获取用户状态
export const getStatus = factory<Required<IResapi2108>['data']>(
  Symbol('getStatus'),
  // async () => {
  //   // @ts-ignore
  //   return request(req2108Config({})).then(res => {

  //     // if (res.mobileStatus !== 1) {
  //     //   Taro.navigateTo({
  //     //     url: '/pages/other/login-mobile/index'
  //     //   })
  //     //   return
  //     // }
  //     return res as Required<IResapi2108>['data'];
  //   }).catch(err => {
  //     if (err.code === 1000) {
  //       return false;
  //     } else {
  //       return err
  //     }
  //   });
  //   // const res = await 
  //   // return res as Required<IResapi2108>['data']
  // },
  async () => {
    // @ts-ignore
    const res = await request(req2108Config({}))
    return res as Required<IResapi2108>['data']
  },
)
// 获取用户im标识
export const getImID = factory<Required<IResapi4082>['data']>(
  Symbol('getImID'),
  async () => {
    // @ts-ignore
    const res = await request(req4082Config({}))
    return res as Required<IResapi4082>['data']
  },
)

// 缓存 商户状态
export const getMerchantInfo = factory<Required<IResapi2452>['data']>(
  Symbol('getMerchantInfo'),
  async () => {
    // @ts-ignore
    const res = await request(req2452Config({}))
    return res as Required<IResapi2452>['data']
  },
)

export const getServices = factory<Required<IResapi1892>['data']>(
  Symbol('getServices'),
  async () => {
    // @ts-ignore
    const res = await api1892()
    return res as Required<IResapi1892>['data']
  },
)

export const getCategories = factory<IResapi1652['data']>(
  Symbol('getCategories'),
  // @ts-ignore
  async () => {
    const res = await api1652()
    return API_ENV === 'mock' ? Categories : res
  },
)

// 获取地址列表
export const getAddressList = factory<IResapi2260['data']>(
  Symbol('getAddressList'),
  // @ts-ignore
  async () => {
    const res = await api2260()
    return res
  },
)
// timeDifference

export const globalConfig = factory<Required<IResapi2912>['data'] & { timeDifference: number }>(
  Symbol('globalConfig'),
  async () => {
    // @ts-ignore
    const res = await request(req2912Config({}))
    return new Promise((resolve) => {
      // @ts-ignore
      res && resolve({
        timeDifference: res?.curlTime - dayjs().valueOf(),
        ...res
      })
    })
  },
)


getCategories.parseLastId = async (lastId) => {
  const res = await getCategories()
  const source = mapProtites(res, { name: 'label', id: 'value' }, { distPercent: 'distPercent' })
  const tree = {}
  const fn = (data, paths = [],) => {
    data.forEach(({ value, children = [], ...rest }) => {
      if (children.length > 0) {
        fn(children, [...paths, value])
      } else {
        tree[value] = {
          ...rest,
          value,
          paths: [...paths, value],
        }
      }
    })
  }
  fn(source)
  return tree[lastId]
}

// 获取省市区
export const getChinaAddsTree = factory<IChinaTree>(
  Symbol('getChinaAddsTree'),
  // @ts-ignore
  async () => {
    const res = await api2220()
    return mapProtites(
      // @ts-ignore
      API_ENV === 'mock' ? chinaAddrsData : res,
      { name: 'label' },
      { name: 'value' },
    )
  },
)

// 拉取保证金
export const getMargins = factory(
  Symbol('getMargins'),
  async () => {
    const res = await api2996()
    return res
  },
)

export const getConfigSwitch = factory(
  Symbol('getConfigSwitch'),
  api4602,
)
/**
 * 校验商户是否可开直播
 **/
export const checkCanLive = factory(
  Symbol('checkCanLive'),
  api4508,
)

/**
 * 获取订单支付配置
 */
export const getSupportedOrderPays = factory(
  Symbol('getSupportedPays'),
  async () => {    
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          payType: 1,
          enablePay: 1,
        },
        {
          payType: 2,
          enablePay: 1,
        },
        {
          payType: 21,
          enablePay: 1,
        },
      ]
    }
    const res = await api4808({tradeType: 2})
    return res
  }
)