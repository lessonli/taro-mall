import api4744 from '@/apis/21/api4744'
import { dianzan1, shopping } from '@/constants/images'
import storge from '@/utils/storge'
import { View, Image, Text, CoverView } from '@tarojs/components'
import { useDidShow } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import './index.scss'
import LiveOperation from './LiveOperation'
import LiveSpot from './LiveSpot'
interface Iprops {
  chat: any
  showShopping: any
  openCanvas: Function
  productNum: number
  disabled: boolean
  merchantId: string
  liveRoomInfo: any
  likeNum: number
  changePhrases: Function
  sendMessage: Function
  phrases: any
  isShowOperation: boolean
  popupVisible: boolean
  getTips: Function
  inputFocus?: boolean;
  roomId: string;
}

const LiveBootom = (props: Iprops, ref) => {
  const [showOperation, setShowOperation] = useState<boolean>(false)
  const { chat, showShopping, openCanvas, productNum, disabled, merchantId, phrases, isShowOperation, popupVisible } = props
  const [spotNum, setSpotNum] = useState<number>(0)
  const spotModule = useRef(undefined)
  const spotTimer = useRef(undefined)
  const copyNum = useRef(0)
  const startNum = useRef(0)
  const spotNotice = useRef(undefined)


  useImperativeHandle(ref, () => ({
    start: (isHide?) => {
      spotModule.current && spotModule.current.spot(isHide)
    }
  }));

  const spot = (e) => {
    // let newNum = spotNum
    e.stopPropagation()
    copyNum.current++
    clearTimeout(spotTimer.current)
    clearInterval(spotNotice.current)
    spotNotice.current = null
    spotTimer.current = null
    if (!spotTimer.current) {
      startNum.current++
      spotTimer.current = setTimeout(() => {
        clearTimeout(spotTimer.current)
        spotTimer.current = null
        api4744({ roomId: props.liveRoomInfo.roomId, recordId: props.liveRoomInfo.recordId, likeNum: startNum.current }).then(data => {
          if (data > copyNum.current) {
            copyNum.current = data
            setSpotNum(data)
          }
        })
        startNum.current = 0
      }, 1500);
    }
    setSpotNum(copyNum.current)
    process.env.NODE_ENV === 'production' && Taro.vibrateShort()
    spotModule.current && spotModule.current.spot()


    let time = new Date().getTime()
    if (!storge.getItem('spotTime')) {
      props.getTips('notice')
    } else {
      if (storge.getItem('spotTime') + 40 * 1000 < time) {
        props.getTips('notice')

      }
    }
    storge.setItem('spotTime', time)
  }

  useEffect(() => {
    if (props.likeNum > spotNum) {
      copyNum.current = props.likeNum
      clearInterval(spotNotice.current)
      if (spotNum !== 0) {
        let num = props.likeNum - spotNum
        spotNotice.current = setInterval(() => {
          if (num > 0) {
            spotModule.current && spotModule.current.spot()
            num--

          } else {
            clearInterval(spotNotice.current)
          }
        }, 500)
      }
      setSpotNum(props.likeNum)
    }
  }, [props.likeNum, spotNum])
  const SpotNum = useMemo(() => spotNum > 0 && <Text className='Live-bottom-spot-num'>{spotNum}</Text>
    , [spotNum])

  // useDidShow(() => {
  //   // console.log(11111);

  //   // clearInterval(spotNotice.current)
  //   // spotModule.current && spotModule.current.spot()
  // })

  useEffect(() => {
    isShowOperation === false && setShowOperation(false)
  }, [isShowOperation])

  const changeOperation = (status) => {
    setShowOperation(status)
    props.changePhrases(status)
  }
  return (
    <View className='Live-bottom'>
      <View className='Live-bottom-shopping' onClick={showShopping}>
        <Image className='Live-bottom-shopping-img' src={shopping}></Image>
        <Text className='Live-bottom-shopping-num'>{productNum}</Text>
      </View>
      <View className={disabled ? 'Live-bottom-chat disabled' : 'Live-bottom-chat'} onClick={() => { !disabled && chat(true) }}>
        {disabled ? '主播已开启全员禁言' : '聊两句...'}
      </View>
      <View className='Live-bottom-operation' onClick={() => { changeOperation(true) }}>
        <i className='myIcon Live-bottom-operation-icon'>&#xe755;</i>
      </View>
      <View className='Live-bottom-share' onClick={() => { openCanvas() }}>
        <i className='myIcon Live-bottom-operation-icon'>&#xe754;</i>
      </View>
      <View className='Live-bottom-spot' onTouchStart={spot}>
        {/* {spotNum > 0 && <Text className='Live-bottom-spot-num'>{spotNum}</Text>} */}
        {SpotNum}

        <Image className='Live-spot-btn' src={dianzan1} ></Image>
      </View>
      {!props.inputFocus && <View className='live-phrases'>
        {
          phrases.map((item, i) => {
            return <Text key={i} className='live-phrases-item' onClick={() => { props.sendMessage(item) }}>
              {item}
            </Text>
          })
        }
      </View>}
      <LiveSpot ref={spotModule} popupVisible={popupVisible}></LiveSpot>
      {showOperation && <LiveOperation
        merchantId={merchantId}
        close={() => { changeOperation(false) }}
        roomId={props.roomId}
      ></LiveOperation>}
    </View>
  )
}

export default forwardRef(LiveBootom)