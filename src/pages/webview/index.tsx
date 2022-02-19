import { View, WebView } from "@tarojs/components"
import { useEffect, useState, useMemo } from "react"
import Taro from '@tarojs/taro'
import './index.scss'
import agreements from "@/constants/agreements"
import { host } from "@/service/http"

export default () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])

  const [src, setSrc] = useState('')

  useEffect(() => {
    const name = decodeURIComponent(page.router?.params.name)
    const url = decodeURIComponent(page.router?.params.url || '')

    if(url){
      setSrc(url)
    } else {
      setSrc(
        process.env.TARO_ENV === 'h5' ? agreements[name].url : (
          `${host}/pages/webview/index?name=${encodeURIComponent(name)}`
        )
      )
    }


  }, [])
  console.clear()
  console.log(src, 'src');
  
  return <View className="full-screen-page bw-webivew-page">
    {
      process.env.TARO_ENV === 'h5' ?
        <iframe src={src} className="bw-pdf" frameBorder="0"></iframe> :
        <WebView src={src} className="bw-pdf bw-pdf-weapp"></WebView>
    }
  </View>
}