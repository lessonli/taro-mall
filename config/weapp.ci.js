const path = require('path');
const ci = require('miniprogram-ci');
const shelljs = require('shelljs');
const dotenv = require('dotenv');
const package = require('../package.json');
const fs = require('fs')
const {uploader} = require('./upload.js')

const defineConstants = require('./defineConstants.js');
const { exec } = require('child_process');
const dayjs = require('dayjs');
const configs = defineConstants.jsconfig

const access_token = configs.API_ENV === 'prod' ? '80402b898e2fb9568d0a391367903544e19ad620f8fe7acb5faf33ad7c2e5d59' : '2405a706e3580b4bf532409955200215bbd7e0f1e7010f14107d8a069378116f'

function resolve(p) {
  return path.resolve(__dirname, p);
}

function defaultDesc() {
  return new Date().toLocaleString() + '发布了版本' + package.version;
}

async function run() {

  try {
    // 创建项目
    const project = new ci.Project({
      appid: configs.WEAPP_APP_ID,
      type: 'miniProgram',
      projectPath: resolve('../dist/weapp'), // 可以配在环境变量
      privateKeyPath: resolve(`./private.${configs.WEAPP_APP_ID}.key`), // 可以配在环境变量 或 是在线拉取
    });

    // 小程序代码上传
    const uploadResult = await ci.upload({
      project,
      version: configs.WEAPP_VERSION,
      desc: package.version_desc || defaultDesc(),
      setting: {
        es6: true,
        minify: true,
        autoPrefixWXSS: true,
      },
      robot: 1,
      onProgressUpdate: undefined,
    });
    // console.log('uploadResult = ', uploadResult);
    console.log('---- 代码部署完毕，请到小程序后台 https://mp.weixin.qq.com/ 进行后续操作 ----');

    // 小程序预览二维码代码生成
    const previewParams = {
      project,
      desc: package.version_desc || defaultDesc(),
      setting: {
        es6: true,
        minify: true,
        autoPrefixWXSS: true,
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: resolve(`./${configs.WEAPP_APP_ID}.jpg`),
    };    

    const previewResult = await ci.preview(previewParams);
    console.log('previewResult = ', previewResult);
    console.log(`
    ---- version: ${configs.WEAPP_VERSION} 代码部署完毕 ----
    `);

    dingdingNotice(uploadResult)

  } catch (error) {
    console.log('uploadResult error = ', error);
  }
}

async function dingdingNotice (uploadResult) {
  const jpg = path.resolve(__dirname, `./${configs.WEAPP_APP_ID}.jpg`)
  // console.log(jpg);
  // 上传图片到阿里云oss
  uploader({
    from: [jpg],
    dist: 'weapp_qrcode',
    setOssPath(filePath) {
      // console.log('filePath', filePath);
      // const [a, b] = filePath.split('/config/')
      return `${configs.WEAPP_APP_ID}.jpg`
    }
  })

  const src = `https://tsla-light.oss-cn-hangzhou.aliyuncs.com/weapp_qrcode/${configs.WEAPP_APP_ID}.jpg?t=${new Date().valueOf()}`
  const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
  const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
  const extInfo = `appid: ${configs.WEAPP_APP_ID}, 总包${(allPackageInfo.size / 1024).toFixed(2)}kb, 主包 ${(mainPackageInfo.size / 1024).toFixed(2)}kb`
  const text = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      title: '小程序预览版',
      text: `#### ${configs.API_ENV === 'prod' ? '博物有道' : '博览万物'}小程序 ${configs.WEAPP_VERSION} \n > ###### ${extInfo} \n >![screenshot](${src})\n >###### 此码15分钟后失效 \n> ###### ${dayjs().format('MM-DD HH:mm:ss')} \n`,
    }
  })

  setTimeout(() => {
  
    exec(`
        curl 'https://oapi.dingtalk.com/robot/send?access_token=${access_token}' \
          -H 'Content-Type: application/json'\
          -X POST \
          -d '${text}'
        `
      )
    }, 0.5 * 60 * 1000);
}
// dingdingNotice()
run();