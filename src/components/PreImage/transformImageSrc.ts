import { ossUrl } from "../Upload/oss"

/**
 * 去掉链接前缀到后端,用于表单提交图片到服务器
 */
export const cutImagePrefixToService = (url: string) => {
  return url.replace(new RegExp(ossUrl, 'gm'), '')
}

/**
 * 根据图片地址 自动拼接域名
 */
export const autoAddImageHost = (src: string | undefined) => {
  if (!src) return src
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  } else {
    return ossUrl + src
  }
}