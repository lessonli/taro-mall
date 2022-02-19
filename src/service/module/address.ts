import http from "../http";

import GET_ADDRESS_LIST from '@/apis/21/api2260'
import ADD_ADDRESS from '@/apis/21/api2228'


/**
 * 获取个人地址列表
 * @param  无 
 * @returns list
 */
export const getAddressList = (data?) => {
  return GET_ADDRESS_LIST(data)
}

/**
 * 新增地址
 * @param  无 
 * @returns 
 */
export const addAddress = (data?) => {
  return ADD_ADDRESS(data)
}