const shell = require('shelljs')
const API_ENV = process.env.API_ENV || 'mock'
const ip = require('ip')

console.log(`
执行环境 API_ENV: ${API_ENV}
我的 ip: ${ip.address()}
`)

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    ASSET_CDN: `"http://${ip.address()}:10087/src/assets"`,
  },
  mini: {},
  h5: {
  }
}