import { IResapi2148 } from "@/apis/21/api2148"
import { DEVICE_NAME, PAY_TYPE } from "@/constants"

import Taro from "@tarojs/taro";

let h5wx

if (process.env.TARO_ENV === 'h5') {
  h5wx = wx
}

/**
 * service 获取签名api
 */
export default (
  service: () => Promise<IResapi2148['data']>,
  payType = PAY_TYPE.WX.value,
) => {
  
  return new Promise((resolve, reject) => {
    service().then(res => {
      if (DEVICE_NAME === 'webh5' && payType !== PAY_TYPE.YE.value) {
        console.log('跳转到第三方支付')
        // TODO: 支付完成的路径拼接
        window.location.href = res?.h5Pay?.h5Url || ''
      }
      console.log('微信支付', res)
      if (DEVICE_NAME === 'wxh5' && payType !== PAY_TYPE.YE.value) {
        const config = {
          timestamp: res?.mpPay?.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: res?.mpPay?.nonceStr, // 支付签名随机串，不长于 32 位
          package: res?.mpPay?.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: res?.mpPay?.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
          paySign: res?.mpPay?.paySign,
          appId: res?.mpPay?.appId || APP_ID,
        }
        h5wx.chooseWXPay({
          ...config,
          complete: (err) => {
            console.log('H5支付 complete', err)
            if (err && err.errMsg === 'chooseWXPay:ok') {
              console.log('支付 success')
              resolve(res, 'res支付成功')
            } else {
              console.log('用户取消支付')
              reject({err, res})
            }
            
          }
        })
      }

      if (DEVICE_NAME === 'weapp' && payType !== PAY_TYPE.YE.value) {
        Taro.requestPayment({
          appId: res?.mpPay?.appId || APP_ID,
          timeStamp: res?.mpPay?.timeStamp || '',
          nonceStr: res?.mpPay?.nonceStr || '',
          package: res?.mpPay?.packageValue || '',
          // @ts-ignore
          signType: res?.mpPay?.signType || '',
          paySign: res?.mpPay?.paySign || '',
          complete: (err) => {
            console.log('小程序支付 complete', err)
            if (err && ['chooseWXPay:ok', 'requestPayment:ok'].includes(err.errMsg)) {
              console.log('支付 success')
              resolve(res)
            } else {
              console.log('用户取消支付')
              reject({err, res})
            }
            
          }
        })
      }

      if (DEVICE_NAME === 'androidbwh5' || DEVICE_NAME === 'iosbwh5' && payType !== PAY_TYPE.YE.value) {
        WebViewJavascriptBridge.callHandler(
          'pay',
          JSON.stringify({
            ...res,
            payType,
          }),
          response => {
            console.log('WebViewJavascriptBridge pay', response)
            const {code, data} = JSON.parse(response)
            if (code === 0) {
              resolve({ res })
            } else {
              reject({res})
            }
          }
        )
        
      }

      if (payType === PAY_TYPE.YE.value) {
        resolve(res)
      }
    }).catch((err) => {
      reject({err, res: err})
    })
  })
}