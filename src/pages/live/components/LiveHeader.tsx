import { XImage } from '@/components/PreImage'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useState } from 'react'
import LiveInfo from './LiveInfo'
import './index.scss'
import { IResapi4504 } from '@/apis/21/api4504'
import api2892 from '@/apis/21/api2892'
import api2884 from '@/apis/21/api2884'
import { getStatus } from '@/utils/cachedService'
import { ids } from '@/constants/images'
import { session } from '@/utils/storge'
import { tim } from '@/service/im'
import { useRecoilState } from 'recoil'
import { liveModal } from '@/store/atoms'
import { BwTaro } from '@/utils/base'
import api4890 from '@/apis/21/api4890'

export type IRoomInfo = Required<IResapi4504>['data']

export const LiveId = (props: {
  liveRoomInfo?: IRoomInfo
  seeNum?: number
  openShare?: any
}) => {
  const { liveRoomInfo } = props
  return (
    <View className='Live-header-right'>
      <View className='Live-header-right-id'>
        <Image src={ids} className='Live-header-right-id-img'></Image>
        <View className='Live-header-right-id-bottom'>ID {liveRoomInfo?.roomId}</View>
      </View>
      {/* <View className='Live-header-right-close'>
        <i className='myIcon Live-header-right-close-icon'>&#xe73b;</i>
      </View> */}
    </View>
  )
}


interface Iprops {
  liveRoomInfo?: IRoomInfo
  seeNum?: number
  openShare?: any
  getTips: Function
  closeOperation: Function
}
const LiveHeader = (props: Iprops) => {
  const { liveRoomInfo, seeNum, openShare, getTips, closeOperation } = props
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [liveModalInfo, setLiveModalInfo] = useRecoilState<{ type: string | number, payload: {} }>(liveModal)

  const show = () => {
    if (liveRoomInfo?.status !== 1) {
      setShowInfo(true)
      closeOperation(false)
    }

  }
  const close = () => {
    setShowInfo(false)
    closeOperation(true)
  }



  //关注
  const payAttention = useCallback(async () => {
    getStatus.reset()
    if (liveRoomInfo?.attentionStatus === 1) {
      await api4890({ roomId: liveRoomInfo?.roomId, status: 0 })
    } else {
      await api4890({ roomId: liveRoomInfo?.roomId, status: 1 })
      getTips('attention', 1)
      Taro.showToast({
        title: '已关注',
        icon: 'none'
      })
    }
  }, [liveRoomInfo?.roomId, liveRoomInfo?.attentionStatus])

  const goBack = () => {
    tim.quitGroup(liveRoomInfo?.roomId).finally(() => {
      setLiveModalInfo(item => {
        return { type: 'none', payload: {} }
      });
    })
    Taro.navigateBack().catch(err => {
      BwTaro.redirectTo({
        url: '/pages/index/index'
      })
    })
  }

  return (
    <View className='Live-header'>
      <View className='mhyIcon Live-header-icon' onClick={goBack}>
        <i className='myIcon Live-header-icon-back'>&#xe707;</i>
      </View>
      {session.getItem('scene') === '1069' && <button className='Live-header-app' open-type="launchApp" app-parameter="wechat" binderror="launchAppError">打开APP</button>}
      {showInfo && <View className='Live-header-hide' onClick={close}></View>}
      <View className='Live-header-left'>
        <XImage className='Live-header-left-img' onClick={show} src={liveRoomInfo?.headImg}></XImage>
        <View className='Live-header-left-info'>
          <View className='Live-header-left-info-name'>{liveRoomInfo?.roomName}</View>
          {liveRoomInfo?.status === 2 ? <View className='Live-header-left-info-num'>{seeNum || 0}人观看</View> : <View className='Live-header-left-info-num'>{liveRoomInfo?.merchant?.fansCount || 0}粉丝</View>}
        </View>
        {liveRoomInfo?.attentionStatus === 1 ? <View className='Live-header-left-attention-box'></View> : <Text className='Live-header-left-attention' onClick={payAttention}>关注</Text>}
      </View>
      {showInfo && <LiveInfo getTips={(value) => { getTips('attention', value) }}
        status={liveRoomInfo?.status}
        attentionStatus={liveRoomInfo?.attentionStatus}
        merchantId={liveRoomInfo?.merchant.merchantId}
        roomId={liveRoomInfo?.roomId}
        closeInfo={close} />}
    </View>
  )
}

export default LiveHeader
