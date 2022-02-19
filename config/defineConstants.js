const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

const weappVersion = pkg.version

const defineConstants = (() => {

  const API_ENV = process.env.API_ENV || 'prod'

  const ONLINE_H5_APPID = 'wx40310c143bed9532'
  const ONLINE_WEAPP_APPID = 'wx0c9681ccadb9645a'
  const ONLINE_WEAPP_GH_ID = 'gh_c00a2ec74aa6'

  const BL_H5_APPID = 'wx346c6ec7430bdc49'
  const BL_WEAPP_APPID = 'wxc655e85bc50aa38c'
  const BL_WEAPP_GH_ID = 'gh_465f8605cf09'

  const WEAPP_APP_ID = API_ENV === 'prod' ? ONLINE_WEAPP_APPID : BL_WEAPP_APPID

  const WEAPP_GH_ID = API_ENV === 'prod' ? ONLINE_WEAPP_GH_ID : BL_WEAPP_GH_ID

  const projectConfigJson = require('./project.config.json.js')

  fs.writeFileSync(
    path.join(__dirname, '../project.config.json'),
    JSON.stringify({
      ...projectConfigJson,
      appid: WEAPP_APP_ID,
      description: API_ENV === 'prod' ? 'bwyd-weapp' : 'blww-weapp',
      projectname: API_ENV === 'prod' ? '博物有道' : '博览万物',
    }, null, 2)
  )

  if (process.env.TARO_ENV === 'weapp') {
    console.log(`正在构建 => ${API_ENV === 'prod' ? '博物有道' : '博览万物'} 小程序`, weappVersion)
  }

  return {
    API_ENV: `"${API_ENV}"`,
    APP_ID: `"${API_ENV === 'prod' ? ONLINE_H5_APPID : BL_H5_APPID}"`,
    WEAPP_APP_ID: `"${WEAPP_APP_ID}"`,
    WEAPP_GH_ID: `"${WEAPP_GH_ID}"`,
    WEAPP_VERSION: `"${weappVersion}"`,
    jsconfig: {
      appid: API_ENV === 'prod' ? ONLINE_H5_APPID : BL_H5_APPID,
      API_ENV,
      WEAPP_VERSION: weappVersion,
      WEAPP_GH_ID,
      WEAPP_APP_ID,
    }
  }
})()

module.exports = defineConstants