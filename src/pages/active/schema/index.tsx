import { bw_icon } from "@/constants/images"
import { View, Image, Text } from "@tarojs/components"
import { AtButton } from "taro-ui"
import Taro from '@tarojs/taro'

import './index.scss'
import { useEffect, useState } from "react"

const Weapp = () => <svg t="1634974227884" className="icon color999" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1870" width="20" height="20" color="#999999"><path d="M626.176 279.552c74.24 0 134.656 55.808 134.656 124.928 0 21.504-6.144 42.496-17.408 61.44-16.896 27.648-44.032 48.128-76.8 57.856-8.704 2.56-15.36 3.584-21.504 3.584-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6c1.024 0 3.072 0 5.632-1.024 22.016-6.144 39.424-18.944 49.152-35.84 6.656-10.752 9.728-22.528 9.728-34.816 0-40.448-37.376-73.728-82.944-73.728-15.872 0-31.232 4.096-45.056 11.776-24.064 13.824-38.4 36.864-38.4 61.952v214.528c0 43.52-24.064 83.456-64 105.984-21.504 12.288-45.568 18.432-70.144 18.432-74.24 0-134.656-55.808-134.656-124.928 0-21.504 6.144-42.496 17.408-61.44 16.896-27.648 44.032-48.128 76.8-57.856 9.216-2.56 15.36-3.584 21.504-3.584 14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6c-1.024 0-3.072 0-5.632 1.024-22.016 6.656-39.424 19.456-49.152 35.84-6.656 10.752-9.728 22.528-9.728 34.816 0 40.448 37.376 73.728 83.456 73.728 15.872 0 31.232-4.096 45.056-11.776 24.064-13.824 38.4-36.864 38.4-61.952V404.48c0-43.52 24.064-83.456 64-105.984 20.992-12.8 45.056-18.944 69.632-18.944z m-520.704 230.4c0 226.304 183.296 409.6 409.6 409.6s409.6-183.296 409.6-409.6-183.296-409.6-409.6-409.6-409.6 183.296-409.6 409.6z m-51.2 0c0-254.464 206.336-460.8 460.8-460.8s460.8 206.336 460.8 460.8-206.336 460.8-460.8 460.8-460.8-206.336-460.8-460.8z m0 0" fill="" p-id="1871"></path></svg>

export default () => {
  const a = 'weixin://dl/business/?t=N7N2gJgQbys'
  const [url, setUrl] = useState(a)
  
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    const b = decodeURIComponent(router?.params.url || 'weixin://dl/business/?t=N7N2gJgQbys')
    setUrl(b)
    location.href = b
  }, [])

  return <View className="schemapage">
    <Image src={bw_icon} className="schemapage-bwicon m-t-80" />
    <View className="fz36 fontColor m-t-18">博物有道严选</View>
    <View>
      <Weapp /> <Text className="fz26 color999 schemapage-xcx">小程序</Text>
    </View>
    <View className="schemapage-footer">
      <AtButton className="schemapage-footer-btn" onClick={() => {
        location.href = url
      }}>前往微信打开</AtButton>
      <View className="fz28 schemapage-footer-text">无法打开时，可使用默认浏览器打开。<Text className="schemapage-footer-copy" onClick={() => {
        Taro.setClipboardData({
          data: url,
          success: () => {
            Taro.showToast({
              icon: 'none',
              title: '复制成功'
            })
          }
        })
      }}>复制链接</Text></View>
    </View>
  </View>
}