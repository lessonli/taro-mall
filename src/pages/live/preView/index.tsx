import { View } from '@tarojs/components'
import { useDidShow } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import { useEffect, useMemo } from 'react'

import './index.scss'

const preView2Live = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])

  useDidShow(() => {
    Taro.redirectTo({
      url: `/pages/live/room/index?roomId=${page.router?.params.roomId}`
    })
  })

  return (
    <View className='preView2live'></View>
  )
}

export default preView2Live
