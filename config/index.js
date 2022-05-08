/* eslint-disable import/no-commonjs */
const path = require('path')
const fs = require('fs')
// const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
// const postcssPxToViewport = require('postcss-px-to-viewport');
// const postcssWriteSvg = require('postcss-write-svg');
// const postcssViewportUnits = require('postcss-viewport-units');
// const cssnano = require('cssnano');

const {weappVersion} = require('./prod.js')

console.log('weappVersion', weappVersion);

const urlLoaderOpt = {
  limit: 0,
  mimetype: false,
  name: '[name].[ext]',
  publicPath: 'https://tsla.bowuyoudao.com/weapp/img'
}

const API_ENV = process.env.API_ENV || 'prod'
// if (process.env.NODE_ENV !== 'development') {
//   Object.assign(urlLoaderOpt, {
//     limit: 0,
//     mimetype: false,
//     name: '[name].[ext]',
//     publicPath: 'https://bowu-icons.oss-cn-beijing.aliyuncs.com/weapp'
//   })
// }


const defineConstants = require('./defineConstants.js')

const config = {
  projectName: 'bwyd-mall',
  date: '2021-7-22',
  designWidth: 750,
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    'recoil': path.resolve(__dirname, '..', 'node_modules/recoil/umd/recoil.js'),
    'tim': process.env.TARO_ENV === 'weapp' ? 'tim-wx-sdk' : 'tim-js-sdk',
    '@sentry/browser': process.env.TARO_ENV === 'weapp' ? 'sentry-miniapp' : '@sentry/browser'
    // 'scheduler': path.resolve(__dirname, '..', 'node_modules/scheduler/umd/scheduler.production.min.js')
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [
    '@tarojs/plugin-html',
  ],
  defineConstants,
  copy: {
    patterns: [
    ],
    options: {
    }
  },
	sass: {
	  resource: [
	    path.resolve(__dirname, '..', 'src/style/common/variables.scss'),
	  ],
	  projectDirectory: path.resolve(__dirname, '..'),
	}, 
  framework: 'react',
  mini: {    
      webpackChain(chain, webpack) {
      chain.merge({
        plugin: {
          copyPlugin: {
            plugin: require('copy-webpack-plugin'),
            args: [{ patterns: [{ from: path.resolve(__dirname, '../src/workers'), to: 'workers' }] }],
          },
        },
      });
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    // file: {
    //   emitFile: false,
    //   useRelativePath: true,
    //   name: function () {
    //     return `[hash].[ext]`
    //   },
    //   publicPath: 'http://192.168.0.48:5000/img'
    // },
    imageUrlLoaderOption: urlLoaderOpt,
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        // config: urlLoaderOpt
        config: {
          limit: 0,
          // mimetype: false,
          // name: '[name].[ext]',
        }
      },
      
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css'
    },
    devServer: {
      port: 10086,
      // proxy: {
      //   '/web-api/': 'http://m.jordonyu.com/web-api/'
      // },
    },
    router: {
      mode:  'browser'
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      pxtransform: {
        enable: false
      },
      'postcss-px-to-viewport' : { 
        enable : true , 
        config : { 
          viewportWidth : 750 , 
          viewportUnit : 'vw' , 
          minPixelValue: 1, 
          selectorBlackList : [ '.ignore' ] , 
        } , 
      } ,
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
  },
  node: {
    fs: "empty"
 }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
