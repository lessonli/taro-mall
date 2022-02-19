import api4094 from '@/apis/21/api4094'
import { cksx, ckts, ckxc, sx } from '@/constants/images'
import { BwTaro } from '@/utils/base'
import { View, Image, CoverView, CoverImage } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'

import './index.scss'

const LiveOperation = (props: {
  roomId: string;
}) => {
  const { close, merchantId, } = props
  const goChat = async () => {
    const result = await api4094({ merchantId: merchantId })
    close()
    Taro.navigateTo({
      url: `/pages/im/message/index?id=${result?.identifier}&type=1`
    })
  }

  const goFeedBack = () => {

    close()
    Taro.navigateTo({
      url: '/pages/user/feedback/index'
    })
  }

  const goHome = () => {

    close()
    BwTaro.navigateTo({
      url: '/pages/index/index'
    })
  }

  const refresh = () => {
    close()
    Taro.reLaunch({
      url: `/pages/live/room/index?roomId=${props.roomId}`
    })
  }

  return (
    <View>
      <View className='Live-operation-hide' onClick={close}></View>
      <View className='Live-operation'>
        <View className='Live-operation-title'>更多工具</View>
        <View className='Live-operation-content'>
          <View className='Live-operation-content-item' onClick={refresh}>
            <Image className='Live-operation-content-item-img' src={sx}></Image>
            <View className='Live-operation-content-item-des'>刷新</View>
          </View>
          <View className='Live-operation-content-item' onClick={goChat}>
            <Image className='Live-operation-content-item-img' src={cksx}></Image>
            <View className='Live-operation-content-item-des'>私聊</View>
          </View>
          <View className='Live-operation-content-item' onClick={goFeedBack}>
            <Image className='Live-operation-content-item-img' src={ckts}></Image>
            <View className='Live-operation-content-item-des'>投诉</View>
          </View>
          <CoverView className='Live-operation-content-item' onClick={goHome}>
            <CoverImage className='Live-operation-content-item-img' src={ckxc}></CoverImage>
            <CoverView className='Live-operation-content-item-des'>小窗</CoverView>
          </CoverView>
        </View>
      </View>
    </View>
  )
}

export default LiveOperation
