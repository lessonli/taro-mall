import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useEffect } from "react";
import { spreadLogo as logo, slog } from '@/constants/images'
import './index.scss'
export default function Principal() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     Taro.navigateTo({
  //       url: '/pages/login/index'
  //     })
  //   }, 3000);
  // }, [])
  return (
    <View className="principal">
      <Image className='principal-logo' src={logo}></Image>
      <Image className='principal-slog' src={slog}></Image>
    </View>
  )
}

Principal.config = {
  navigationBarTitleText: '首屏',
}

