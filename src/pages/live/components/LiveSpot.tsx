import { avatar1, avatar2, avatar3, dianzan, spot1, spot2, spot3, spot4, spot5, spot6, spot7 } from '@/constants/images'
import { addImage1, drawRoundRect } from '@/utils/canvas'
import { Canvas, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import ThumbsUpAni from './spotCanvas'
import './index.scss'
import { env } from 'config/prod'
import { useDidShow } from '@tarojs/runtime'
interface IProps {
  ref: any
  popupVisible: boolean
}
const LiveSpot = (props: IProps, ref) => {

  let num = 0


  const spotModule = useRef()

  const timer = useRef(undefined)

  useImperativeHandle(ref, () => ({

    spot: (isHide?) => {

      // num += 1
      // if (num && !timer.current) {
      //   start()
      //   timer.current = setInterval(() => {
      //     num -= 1
      //     if (num < 1) {
      //       clearInterval(timer.current)
      //       timer.current = null
      //     } else {
      //       start()

      //     }
      //   }, 300)
      // }
      start(isHide)
    },
    clear: () => {
      spotModule.current && spotModule.current.clear()
    }
  }));

  // useEffect(() => {


  // }, [spotNum])

  useLayoutEffect(() => {
    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select('#spotCanvas')
        .fields({
          node: true,
          size: true,
        }).exec(async (res) => {
          const width = res && res[0]?.width
          const height = res && res[0]?.height
          const ctx = await Taro.createCanvasContext('spotCanvas', this)
          const list = await Promise.all([addImage1(spot1), addImage1(spot2), addImage1(spot3), addImage1(spot4), addImage1(spot5), addImage1(spot6), addImage1(spot7)])
          spotModule.current = new ThumbsUpAni({
            width, height, ctx, imgsList: list
          });
          // setInterval(() => { spotModule.current.start() }, 100)
        })
    })

    // }, 300);
  }, [])

  const start = useCallback(
    (isHide?) => {
      spotModule.current && spotModule.current.start(isHide);
    },
    [],
  )
  // const start = () => {
  //   spotModule.current.start();
  // }
  return (
    <View className='Live-spot'>
      <Canvas type="" style={{ width: '80px', height: props.popupVisible === true ? '0' : '300px' }} className='Live-spot-content' canvasId="spotCanvas" id='spotCanvas'> </Canvas>
    </View>
  )
}

export default forwardRef(LiveSpot)
