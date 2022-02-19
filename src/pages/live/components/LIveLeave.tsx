import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import LiveHeader from './LiveHeader'
import './index.scss'
import { autoAddImageHost } from '@/components/PreImage/transformImageSrc'
import { XImage } from '@/components/PreImage'
import { useEffect, useMemo, useState } from 'react'
interface Iprops {
  liveRoomInfo: any,
  refresh: Function
}
const LiveLeave = (props: Iprops) => {
  const { liveRoomInfo, refresh } = props

  const goMerchant = () => {
    Taro.navigateTo({
      url: `/pages/store/index?merchantId=${liveRoomInfo?.merchant?.merchantNo}`
    })
  }
  const onRefresh = () => {
    refresh()
  }

  return (
    <View className='Live-end'>
      <View className='Live-end-hide leave'></View>
      <View className='Live-end-box'>
        <Image className='Live-end-head' src={autoAddImageHost(liveRoomInfo.headImg)}></Image>
        <View className='Live-end-title'>{liveRoomInfo.roomName}</View>
        <View className='Live-end-status'>主播暂时离开，请稍等～</View>
        <View className='Live-end-btnBox'>
          <View className='Live-end-btnBox-left' onClick={goMerchant}>进店逛逛</View>
          <View className='Live-end-btnBox-right' onClick={onRefresh}>刷新重连</View>
        </View>
      </View>
    </View>
  )
}

export default LiveLeave
