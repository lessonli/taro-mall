const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const {WebpackManifestPlugin, getCompilerHooks} = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {SentrySourcemapPlugin: SentryCliPlugin} = require('@longwoo/sentry-sourcemap-plugin')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin');

const dayjs = require('dayjs')

const fs = require('fs')

const jsCdns = [
  {
    module: 'react',
    entry: "https://tsla.bowuyoudao.com/npm/modules/react.17.0.2.production.min.js",
    global: "React",
  },
  {
    module: 'react-dom',
    entry: "https://tsla.bowuyoudao.com/npm/modules/react-dom.17.0.2.production.min.js",
    global: 'ReactDOM',
  },
  {
    module: 'tim-js-sdk',
    entry: "https://tsla.bowuyoudao.com/npm/modules/tim-js-sdk.2.15.0.js",
    global: 'TIM',
  },
  {
    module: 'tim-upload-plugin',
    entry: "https://tsla.bowuyoudao.com/npm/modules/tim-upload-plugin.1.0.3.js",
    global: 'TIMUploadPlugin',
  },
  {
    module: 'recoil',
    entry: 'https://tsla.bowuyoudao.com/npm/modules/recoil.0.2.0.min.js',
    global: 'Recoil'
  },
  {
    module: 'weixin-js-sdk',
    entry: "https://tsla.bowuyoudao.com/npm/modules/weixin-js-sdk.1.6.0.js",
    global: 'wx'
  },
]
class AppendH5CdnAssetsPlugin {
  apply(compiler) {
    const { beforeEmit } = getCompilerHooks(compiler);
    const cdns = jsCdns.reduce((res, item) => {
      res[item.module] = item.entry
      return res
    }, {})
    beforeEmit.tap('AppendH5CdnAssetsPlugin', (manifest) => {
      return {
        'assets-retry': 'https://tsla.bowuyoudao.com/npm/modules/assets-retry.umd.js',
        ...manifest,
        ...cdns,
      };
    });
  }
}

/**
 * 小程序提审版本号
 * 每次提审前 更新
 * 提审通过后后端 切换为过审状态
 */
 const weappVersion = require('../package.json').version

const API_ENV = process.env.API_ENV || 'prod'
const SOURCE_MAP = !!process.env.SOURCE_MAP

const path = require('path');
const babelConfig = require('../babel.config');

const LAST_MODIFY = dayjs().format('YYYY-MM-DD HH:mm:ss')

const RELEASE = (() => {
  let release
  if (process.env.TARO_ENV === 'weapp') {
    release = `weapp_${weappVersion}`
  } else {
    release = `h5_${dayjs(LAST_MODIFY).format()}`
  }
  console.log(`执行环境 API_ENV: ${API_ENV} ${process.env.NODE_ENV}`)
  console.log(`release => ${release}`)
  if (process.env.TARO_ENV === 'weapp' && SOURCE_MAP) {
    console.log(`上传小程序sourceMap 到sentry`);
    
  }
  return release
})()

const sentryUploadConfig = {
  org: 'sentry_bw',
  url: 'https://sentry.bowuyoudao.com/',
  authToken: 'c7be6f7890324e2c8df0f4616c41f94795003518f51443eaac892dc63548476e',
  include: `./dist/${process.env.TARO_ENV}`,
  urlPrefix: (() => {
    if (process.env.TARO_ENV === 'h5') {
      return API_ENV === 'prod' ? 'https://tsla.bowuyoudao.com/h5-assets/' : '~/'
    } else if (process.env.TARO_ENV === 'weapp') {
      // https://github.com/alexayan/sentry-mina/issues/2
      /**
       * 小程序需要等送审完成后才能 上传最新版本的sourceMap
       * 流程：发包 => 设置版本号送审状态 & 提审 => 过审 & 设置版本号过审状态 & 全量发布 => 打包 & 上传sourcemap 
       */
      return '~/appservice/'
    }
  })(),
  release: RELEASE,
  project: API_ENV === 'prod' ? 'online_h5_weapp' : 'bw_weapp',
}

module.exports = {
  weappVersion,
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    ASSET_CDN: `"https://tsla.bowuyoudao.com/weapp"`,
    LAST_MODIFY: `"${LAST_MODIFY}"`,
    RELEASE: `"${RELEASE}"`,
  },
  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
      compress: {
        drop_console: API_ENV === 'prod',
        drop_debugger: API_ENV === 'prod',
      }
    }
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    },
    enableSourceMap: true,
    sourceMapType: 'source-map',
    webpackChain (chain) {
      //  chain.plugin('analyzer')
      //    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      chain.merge({
        plugin: {
          copyPlugin: {
            plugin: require('copy-webpack-plugin'),
            args: [{ patterns: [{ from: path.resolve(__dirname, '../src/workers'), to: 'workers' }] }],
          },
        },
      });

      if (SOURCE_MAP) {
        chain.plugin('SentryCliPlugin')
         .use(new SentryCliPlugin(sentryUploadConfig))
      }
      
    },
  },
  h5: {
    // output: {
    //   filename: 'js/[name].[hash:8].js',
    //   chunkFilename: 'js/[name].[chunkhash:8].js',
    // },
    publicPath: API_ENV === 'prod' ? 'https://tsla.bowuyoudao.com/h5-assets/' : 'https://dev.bowuyoudao.com/',
    enableSourceMap: true,
    sourceMapType: 'source-map',
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
     webpackChain (chain) {
        //  chain.plugin('analyzer')
        //    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])

        chain.merge({
          module: {
            rule: {
              es5Loader: {
                test: /\.[tj]s[x]?$/i,
                include: [
                  path.resolve(__dirname, '../node_modules/@tarojs/components'),
                  path.resolve(__dirname, '../src')
                ],
                use: [
                  {
                    loader: 'babel-loader',
                    options: babelConfig,
                  }
                ]
              }
            }
          }
        })
        
        chain.plugin('WebpackManifestPlugin')
          .use(new WebpackManifestPlugin({
            fileName: 'manifest.html',
            filter: ({name, path}) => {
              // 文件预加载名单
              const names = [
                'app.css',
                'app.js',
                'polyfills-dom.js',
              ]
              return names.includes(name)
            }
          }))

        chain.plugin('AppendH5CdnAssetsPlugin')
          .use(new AppendH5CdnAssetsPlugin())
        chain.plugin('HtmlWebpackExternalsPlugin')
          .use( new HtmlWebpackExternalsPlugin({
            externals: [
              API_ENV !== 'prod' && {
                module: 'vconsole',
                entry: 'https://tsla.bowuyoudao.com/npm/modules/vconsole.3.9.1.min.js',
                global: 'VConsole'
              },
              ...jsCdns,
              // {
              //   module: '@sentry/brower',
              //   entry: {
              //     path: 'https://tsla.bowuyoudao.com/npm/@sentry/brower/6.13.3/bundle.min.js',
              //     attributes: {
              //       // integrity: 'sha384-sGMbmxgVprpEFMz6afNDyADd4Kav86v5Tvo2Y6w5t8tHUn1P1at3lCjN7IQo2c7E',
              //       crossorigin: 'anonymous',
              //     },
              //   },
              //   global: 'Sentry',
              // },
              
            ].filter(Boolean)
          }))

        chain.plugin('htmlWebpackPlugin')
          .use(new HtmlWebpackPlugin({
            title: '博物有道',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            meta: {
              'LM': LAST_MODIFY,
              'lang': 'zh-CN',
            },
            minify: {
              collapseWhitespace: true,
              keepClosingSlash: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
            },
          }))

        /**
         * js cdn 资源加载出错自动重试
         * https://zhuanlan.zhihu.com/p/96120037
         * https://www.npmjs.com/package/webpack-retry-chunk-load-plugin
         * https://www.npmjs.com/package/assets-reload
         */
        // chain.plugin('webpack-retry-chunk-load-plugin')
        //   .use(new RetryChunkLoadPlugin({
        //     // optional stringified function to get the cache busting query string appended to the script src
        //     // if not set will default to appending the string `?cache-bust=true`
        //     // cacheBust: `function() {
        //     //   return Date.now();
        //     // }`,
        //     // optional value to set the amount of time in milliseconds before trying to load the chunk again. Default is 0
        //     retryDelay: 300,
        //     // optional value to set the maximum number of retries to load the chunk. Default is 1
        //     maxRetries: 5,
        //     // optional list of chunks to which retry script should be injected
        //     // if not set will add retry script to all chunks that have webpack script loading
        //     // chunks: ['chunkName'],
        //     // optional code to be executed in the browser context if after all retries chunk is not loaded.
        //     // if not set - nothing will happen and error will be returned to the chunk loader.
        //     // lastResortScript: "window.location.href='/500.html';",
        //   }))

        SOURCE_MAP && chain.plugin('SentryCliPlugin')
          .use(new SentryCliPlugin(sentryUploadConfig))

          // fs.writeFileSync('./webpack.config.json', chain.toString())
      }
    
  }
}
