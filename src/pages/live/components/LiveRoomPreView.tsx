import api4504 from '@/apis/21/api4504'
import NavigationBar from '@/components/NavigationBar'
import { View, Image, Text } from '@tarojs/components'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useEffect, useMemo, useRef, useState } from 'react'
import LiveHeader from '../components/LiveHeader'
import LiveInfo from '../components/LiveInfo'
import { worker } from '@/store/atoms'
import LiveOperation from '../components/LiveOperation'
import LivePreView from '../components/LivePreView'

import { useRecoilState } from 'recoil'
import './index.scss'
import { getStatus } from '@/utils/cachedService'
import api2892 from '@/apis/21/api2892'
import api2884 from '@/apis/21/api2884'
import CanvasPhoto from '@/components/CanvasPhoto'
import { initLive } from '@/components/CanvasPhoto/components/CanvasInit'
import { XImage } from '@/components/PreImage'
import { host } from '@/service/http'
import api3560 from '@/apis/21/api3560'
import api3554 from '@/apis/21/api3554'
import { useWeappUrlChannelHook } from '@/utils/hooks'
import { autoAddImageHost } from '@/components/PreImage/transformImageSrc'
import api4890 from '@/apis/21/api4890'
import { ILiveRoomInfo } from '../room'

interface Iprops {
  openPoster: Function;
  roomId: string;
  getTips?: Function
  liveRoomInfo: ILiveRoomInfo
}
const PreView = (props: Iprops) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const { openPoster, liveRoomInfo } = props
  // const [liveRoomInfo, setLiveRoomInfo] = useState<any>({})
  const [seeNum, setSeeNum] = useState<number>(0)
  const [workers, setWorkers] = useRecoilState(worker)
  const [timer, setTimer] = useState<object | undefined>({})
  const [attention, setAttention] = useState<boolean>(false)
  const [canvasVisible, setCanvasVisible] = useState(false)
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [shareInfo, setShareInfo] = useState<any>()
  const shareDetail = useRef()
  useEffect(() => {
    (async () => {
      // const liveRoomInfo = await api4504({ roomId: props.roomId })
      // setLiveRoomInfo(liveRoomInfo)
      setAttention(liveRoomInfo?.attentionStatus === 1)
      workers.postMessage({
        type: 'preView',
        msg: liveRoomInfo?.startTime
      })
      workers.onMessage((data) => {
        if (data.type === 'preView') {
          // 置顶倒计时
          setTimer(data.msg)
        }
      })
    })()
  }, [])

  // useWeappUrlChannelHook()

  const payAttention = async () => {
    getStatus.reset()
    if (liveRoomInfo?.attentionStatus === 0) {
      await api4890({ roomId: liveRoomInfo?.roomId, status: 1 })
      setAttention(true)
      props?.getTips('attention', 1)
      Taro.showToast({
        title: '已打开提醒',
        icon: 'none'
      })
    } else {
      await api4890({ roomId: liveRoomInfo?.roomId, status: 0 })
      setAttention(false)
      props?.getTips('attention', 0)
      Taro.showToast({
        title: '已取消',
        icon: 'none'
      })
    }
  }
  //weapp分享到好友
  // useShareAppMessage(() => {
  //   const res = shareDetail.current

  //   // const data = await cacheShareData()
  //   // console.log(data, 123123);
  //   const data = {
  //     title: res?.title,
  //     path: res?.shareUrl.replace(host, ''),
  //     imageUrl: autoAddImageHost(res?.posterImg)
  //   }
  //   return data
  // })

  // weapp分享到朋友圈
  // useShareTimeline(() => {
  //   return {
  //     title: liveRoomInfo?.roomName,
  //     path: shareInfo?.shareUrl.replace(host, ''),
  //     imageUrl: liveRoomInfo?.posterImg
  //   }
  // })
  const openCanvas = async () => {
    openPoster()
  }


  return (
    <View className='live-preView'>
      <NavigationBar
        leftBtn={<LiveHeader closeOperation={() => { }} getTips={(value) => { props?.getTips('attention', value) }} openShare={openCanvas} seeNum={seeNum} liveRoomInfo={liveRoomInfo}></LiveHeader>}
      />
      <XImage className='live-preView-img' src={liveRoomInfo?.coverImg}></XImage>
      <LivePreView></LivePreView>
      <View className='live-preView-tips'>
        <View className='live-preView-roomName'>{liveRoomInfo?.roomName}</View>
        {liveRoomInfo?.attentionStatus === 1 ? <View className='live-preView-rocked' onClick={payAttention}>
          <Text className='myIcon live-preView-rocked-icon'>&#xe74c;</Text>
          <Text className='live-preView-rocked-text'>已提醒</Text>
        </View> : <View className='live-preView-rock'><i className='myIcon live-preView-rock-icon'>&#xe749;</i><Text className='live-preView-rock-text' onClick={payAttention}>提醒我</Text></View>
        }
      </View>
      {/* {
        liveRoomInfo && shareImg && <CanvasPhoto storeInfo={liveRoomInfo}
          shareImg={shareImg}
          shareLink={shareLink}
          type={'commodity'}
          init={initLive}
          size={
            {
              width: 522,
              height: 860
            }
          }
          visible={canvasVisible} onClose={onCloseCanvas} />
      } */}
      {liveRoomInfo?.merchant?.merchantId && <LiveInfo openShare={openCanvas} closeInfo={() => { }} timer={timer} merchantId={liveRoomInfo?.merchant?.merchantId} status={liveRoomInfo?.status}></LiveInfo>}
    </View>
  )
}

export default PreView
