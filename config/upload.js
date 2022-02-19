const WebpackAliyunOss = require('webpack-aliyun-oss')
const path = require('path')

const getOsscONFIG = (configs) => {
  // 获取配置中的账号密码
  const USER_HOME = (process.env.HOME || process.env.USERPROFILE)

  const access = require(path.resolve(USER_HOME, '.aliyunoss.bwyd.access.js'))

  const uploadConfig = {
    from: [],
    ...access,
    dist: 'weapp', // oss上传目录
    region: 'oss-cn-hangzhou',
    bucket: 'tsla-light',
    setOssPath(filePath) {
      const [a, b] = filePath.split('/src/assets')
      // console.log('setOssPath', a, b)
      // return filePath.replace
      return b
    },
    ...configs,
  }
  return uploadConfig
}

const uploader = (configs) => {
  new WebpackAliyunOss(getOsscONFIG(
    configs
  )).apply()
}

module.exports = {
  uploader,
}