import { sleep } from '@/utils/cachedService'
import { View } from '@tarojs/components'
import Taro, { usePageScroll, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { ReactNode, useRef, useState } from 'react'

interface IProps {
  onScroll?: (e: Taro.PageScrollObject) => void;
  onScrollToLower?: Function
  children?: ReactNode
  /**
   * 小程序页面开启了下拉刷新选项 生效
   * 不支持H5
   */
  onPullDownRefresh?: Function
}

const BwScrollView = (props: IProps) => {

  const [reFreshLock, setReFreshLock] = useState<boolean>(false)

  const { children, onScroll, onScrollToLower, onPullDownRefresh } = props

  // const reFreshLock = useRef<boolean>(false)

  usePageScroll((e) => {
    // 上滑滚动事件
    onScroll?.(e)

  })

  useReachBottom(() => {
    //触底事件
    onScrollToLower?.()
  })

  usePullDownRefresh(async () => {

    // 下拉刷新
    if (!reFreshLock) {
      setReFreshLock(true)
      Taro.startPullDownRefresh()
      await onPullDownRefresh?.()
      setReFreshLock(false)
      await sleep(500)
      Taro.stopPullDownRefresh()
    }
  })

  return (
    <View>
      {children}
    </View>
  )
}

export default BwScrollView
