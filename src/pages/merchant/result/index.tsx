
import { View, Text, Image } from "@tarojs/components"
import { AtButton } from "taro-ui"
import { XImage } from "@/components/PreImage"
import Taro from "@tarojs/taro"
import { useMemo, useCallback, useEffect, useState } from "react"
import { profit } from '@/constants/images'
import api2912, { IResapi2912 } from "@/apis/21/api2912"
import { getUserInfo, globalConfig } from "@/utils/cachedService"
import storge, { session } from "@/utils/storge";
import { isAppWebview } from "@/constants";
type Iconfig = Required<IResapi2912>['data']
import './index.scss'
import { BwTaro } from "@/utils/base"
function Result() {
  const [config, setconfig] = useState<Iconfig>()

  useEffect(() => {
    (async () => {
      const config = await globalConfig()
      setconfig(config)
    })()
  }, [])

  const toBusiness = () => {
    storge.setItem('userCurrentPosition', 'merchant')
    session.setItem('userCurrentPosition', 'merchant')

    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler('closeWebview', '')
    } else {
      BwTaro.redirectTo({
        url: '/pages/my/index/index'
      })
    }


  }
  const copy = useCallback((str) => {
    Taro.setClipboardData({
      data: str,
      success: () => {
        Taro.showToast({ title: '复制成功' })
      }
    })
  }, [])

  return (
    <View className='open-store-wrap'>
      <View className='open-store-box'>
        <View className='open-store-box-payResult'>
          <Text className='myIcon open-store-box-payResult-icon'>&#xe70c;</Text>
          <Text className='open-store-box-payResult-text'>支付成功</Text>
        </View>
        <XImage
          className='open-store-box-img'
          src={profit}
        />
        <View>
          <View className='bw-open-store-box-addWx'>
            <Text>添加官方运营微信: {config?.systemServiceWxNo}</Text> <Text className='copy-btn' onClick={() => { copy(config?.systemServiceWxNo) }}>复制</Text>
          </View>
          <View className='bw-open-store-contacts-imgBox'>
            <XImage showMenuByLongpress className='bw-open-store-contacts-img' src={config?.systemServiceWxQrCode}></XImage>

          </View>
          <View className='bw-open-store-hr'></View>
          <View className='bw-open-store-contacts-saveImage'>长按图片保存至相册</View>
          <AtButton onClick={() => toBusiness()} className='bw-open-store-contacts-toBusiness' type='primary'>进入卖家中心</AtButton>
        </View>
      </View>
    </View>
  )
}


export default Result