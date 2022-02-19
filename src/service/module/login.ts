import http from '../http'
import AUTH_ORIZED_LOGININ from '@/apis/21/api1772'
import RECHARGE from '@/apis/21/api2516'
/**
 * @param data 所传登录权鉴参数
 * @returns H5登录
 */

export const AuthorizedLoginIn = (data: any) => {
  return AUTH_ORIZED_LOGININ(data)
}


/**
 * @param data 所传登录权鉴参数
 * @returns weapp登录
 */

export const AuthorizedLoginIn_weapp = (data: any) => {
  http({
    url: '/auth/wx/ma/login',
    method: 'post',
    data: data
  })
}
/**
 * @param data 所传登录权鉴参数
 * @returns H5登录
 */

export const getRechagre = (data: any) => {
  return RECHARGE(data)
}


let promiseUserFn = null

const apiUser = (delay = 3000) => new Promise((r) => {
  setTimeout(() => {
    console.log('mock api')
    r({ name: '张三' })
  }, delay);
})

const getUserInfo = async () => {
  if (promiseUserFn === null) {
    // 确保只运行一次
    // @ts-ignore
    promiseUserFn = apiUser()
  }
  const res = await promiseUserFn
  console.log('获取结果', res)
  return res
}