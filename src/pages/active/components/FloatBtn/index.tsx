
import { View, Image, Text } from "@tarojs/components"
import { weixin } from "@/constants/images"
import { isAppWebview, DEVICE_NAME } from "@/constants"
import Taro from "@tarojs/taro"


import './index.scss'
import { BwTaro } from "@/utils/base"

type Iprops = {
  src?: string,
  icon?: JSX.Element
  handleClick?: () => void
}

function FloatBtn(props: Iprops) {
  const handleClick = () => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({ page: '/home' }),
      )
      return
    } else {
      BwTaro.redirectTo({ url: `/pages/index/index?t=${new Date().getTime()}` })
    }



  }
  return <>
    <View className='bw-go-home-btn' onClick={props.handleClick ? props.handleClick : handleClick}>
      {props.src && <Image className='bw-go-home-btn-img' src={props.src} />}
      {props.icon && <View> {props.icon} </View>}
    </View>
  </>
}

export default FloatBtn


