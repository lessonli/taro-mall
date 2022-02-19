import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import LiveHeader from './LiveHeader'
import './index.scss'
import { autoAddImageHost } from '@/components/PreImage/transformImageSrc'
import { XImage } from '@/components/PreImage'
import { useEffect, useMemo, useState } from 'react'
import { BwTaro } from '@/utils/base'
interface Iprops {
  liveRoomInfo: any,
  seeNum: number
}
const LiveEnd = (props: Iprops) => {
  const { liveRoomInfo, seeNum } = props
  const [heighgt, setHeighgt] = useState<number>(0)
  const goHome = () => {
    BwTaro.redirectTo({
      url: '/pages/index/index'
    })
  }
  const system = useMemo(() => {
    const { statusBarHeight } = Taro.getSystemInfoSync()
    return statusBarHeight
  }, [])


  return (
    <View className='Live-end'>
      <View className='Live-end-header' style={{ top: `${system}px` }}>
        <LiveHeader getTips={() => { }} closeOperation={() => { }} seeNum={seeNum} liveRoomInfo={liveRoomInfo}></LiveHeader>
      </View>
      <View className='Live-end-hide'></View>
      <XImage disabledPlaceholder
        className='Live-end-bg' src={liveRoomInfo?.coverImg}></XImage>
      <View className='Live-end-box'>
        <XImage disabledPlaceholder className='Live-end-head' src={liveRoomInfo?.headImg}></XImage>
        <View className='Live-end-title'>{liveRoomInfo?.nickName}</View>
        <View className='Live-end-status'>主播已离开直播间</View>
        <View className='Live-end-btn' onClick={goHome}>逛其他直播间</View>
      </View>
    </View>
  )
}

export default LiveEnd
