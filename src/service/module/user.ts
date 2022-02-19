import http from "../http";

import AUTH_CERTIFY from '@/apis/21/api2420'


/**
 * 个人认证
 * @param  无 
 * @returns 
 */
export const auth_certify = (data?) => {
  return AUTH_CERTIFY(data)
}