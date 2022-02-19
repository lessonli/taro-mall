import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { selectorQueryClientRect } from '@/utils/base'
import './index.scss'
import { useEffect, useState } from 'react'
import { navigationBarInfo } from '../NavigationBar'

/**
 * 
 * @param scrollTop 滚动高度
 * @param height 浮动上下午以上的高度
 * @param position 布局样式
 * @param callBack  回调
 */

export const useStick = (scrollTop, height, position, callBack) => {

  if (scrollTop > height && position === 'static') {
    callBack('fixed')
  }
  if (position === 'fixed' && scrollTop <= height) {
    callBack('static')
  }

}

interface Iprops {
  position: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed',
  id: string,
  children: JSX.Element,
  type?: string
}

const StickBox = (props: Iprops) => {
  const { position, id, type } = props
  const [height, setHeight] = useState<any>(0)
  useEffect(() => {
    Taro.nextTick(async () => {

      const dom = await selectorQueryClientRect(`#${id}`)
      console.log(dom.height);

      setHeight(`${dom.height}px`)

      // console.log((header)
    })
  }, [])

  return (
    <View className='bw-stickBox' >
      <View className='bw-stickBox-fixed' style={{ position: position, top: type !== 'top' ? navigationBarInfo?.navigationBarAndStatusBarHeight : 0 + 'px' }}>
        {
          props.children
        }
      </View>
      {
        position === 'fixed' ? <View className='bw-stickBox-placeholder' style={{ height: height, opacity: 0 }}>
        </View> : null
      }


    </View>
  )
}

export default StickBox
