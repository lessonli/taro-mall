#### 博物有道 小程序

```
// 本地开启图片服务
npm run  asset-cdn
// mock 开发
yarn dev:h5

// test 开发h5
npx cross-env API_ENV=test yarn dev:h5

// prod 打包
npx cross-env API_ENV=prod yarn build:weapp

// prod 打包 & 上传sourcemap到sentry
https://github.com/alexayan/sentry-mina/issues/2
/**
* 小程序需要等送审完成后才能 上传最新版本的sourceMap
* 流程：发包 => 设置版本号送审状态 & 提审 => 过审 & 设置版本号过审状态 & 全量发布 => 打包 & 上传sourcemap 
*/
<!-- npx cross-env API_ENV=prod SOURCE_MAP=1 yarn build:weapp -->


1. 每次发版需要为当前小程序指定一个唯一的版本号，并在初始化sentry sdk时传递给release配置项
2. 程序审核通过后，需要在小程序管理后台（https://mp.weixin.qq.com/wxamp/wxaalarm/get_jserr?lang=zh_CN）下载“线上版本 Source Map 文件”
3. 替换 weapp-sourcemap/app-service.map.map 文件

上传
sentry-cli releases files "weapp_2.0.11" upload-sourcemaps /Users/lx/Downloads/work-space/wx-h5-web/weapp-sourcemap --rewrite --url-prefix "https://usr"

```

```
// 打包 dev
npx cross-env API_ENV=test yarn build:h5
```

#### title

##### js app交互
* `userCurrentPosition`(buyer | merchant) `token`, 从url携带

* js 调用 app: 打开商品详情页 方法名 `openNativePage`, 入参 { page: '/product/detail', params: {productId: 'xxxx'} }

* js 调用原生相机扫描条形码 方法名 `scanCode`, 入参 { scanType: ['barCode'] }, 返回值 `扫码结果`、

```js
WebViewJavascriptBridge.callHandler(
  'scanCode',
  '{ scanType: ['barCode'] }',
  res => {
    const {code, data} = JSON.parse(res)
    console.log('扫码结果', data)
  }
)
```

#### 调整图片尺寸 加载
https://help.aliyun.com/document_detail/44705.html

```
import qs from 'query-string'

qs.stringifyUrl({
  url: orginUrl,
  query: {
    'x-oss-process': 'image/resize,w_100/quality,q_80'
  }
})

```
