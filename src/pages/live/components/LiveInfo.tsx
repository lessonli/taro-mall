import { XImage } from '@/components/PreImage'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import { useEffect, useState } from 'react'
import api2612, { IResapi2612 } from '@/apis/21/api2612'
import { getStatus } from '@/utils/cachedService'
import api2884 from '@/apis/21/api2884'
import { deepClone, fen2yuan } from '@/utils/base'
import api4094 from '@/apis/21/api4094'
import api4890 from '@/apis/21/api4890'
export type IMerchantInfo = Required<IResapi2612>['data']
interface InfoProps {
  closeInfo?: any
  merchantId?: any
  timer?: object
  status?: number
  openShare?: any
  getTips?: Function
  roomId?: number
  attentionStatus?: number
}
const LiveInfo = (props: InfoProps) => {
  const { closeInfo, merchantId, timer, status, openShare, getTips } = props
  const [merchantInfo, setMerchantInfo] = useState<IMerchantInfo>()
  const close = () => {
    closeInfo()
  }
  useEffect(() => {
    (async () => {
      const merchantInfo = await api2612({ merchantId: merchantId })
      setMerchantInfo(merchantInfo)
    })()
  }, [])


  const payAttention = async () => {
    if (props?.attentionStatus === 0) {
      getStatus.reset()
      await api4890({ roomId: props?.roomId, status: 1 })
      // newMerchantInfo.followStatus = 1
      // setMerchantInfo(newMerchantInfo)
      props?.getTips(1)
      Taro.showToast({
        title: '已关注',
        icon: 'none'
      })
    } else {
      await api4890({ roomId: props?.roomId, status: 0 })
      // newMerchantInfo.followStatus = 1
      // setMerchantInfo(newMerchantInfo)
      props?.getTips(0)
      Taro.showToast({
        title: '已取消',
        icon: 'none'
      })
    }
  }

  const goIm = async () => {
    const result = await api4094({ merchantId: merchantInfo?.merchantNo })
    closeInfo()
    Taro.navigateTo({
      url: `/pages/im/message/index?id=${result?.identifier}&type=1`
    })
  }

  const goMerchant = () => {
    closeInfo()
    Taro.navigateTo({
      url: `/pages/store/index?merchantId=${merchantInfo?.merchantNo}`
    })
  }

  return (
    <View className='Live-info' >
      <View className='Live-info-content'>
        <XImage src={merchantInfo?.shopLogo} className='Live-info-content-head'></XImage>
        <View className='Live-info-content-name' >{merchantInfo?.shopName}</View>
        {status !== 1 ? <View>
          <View className='Live-info-content-info'>
            <View>
              <View className='Live-info-content-info-num'>{merchantInfo?.productNum}</View>
              <View className='Live-info-content-info-des'>上架宝贝</View>
            </View>
            <View>
              <View className='Live-info-content-info-num'>{fen2yuan(merchantInfo?.marginShopAmount)}</View>
              <View className='Live-info-content-info-des'>店铺保证金</View>
            </View>
            <View>
              <View className='Live-info-content-info-num'>{merchantInfo?.fansNum}</View>
              <View className='Live-info-content-info-des'>粉丝数</View>
            </View>
          </View>
          <View className='Live-info-content-btnBox'>
            <View className='Live-info-content-btnBox-leftBtn' onClick={goIm}>私信</View>
            <View className='Live-info-content-btnBox-rightBtn' onClick={payAttention} style={{ opacity: props?.attentionStatus === 1 ? 0.3 : 1 }}>{props?.attentionStatus === 1 ? '已关注' : '关注主播'}</View>
          </View>
          <View className='Live-info-content-tips' onClick={goMerchant}>{'进店逛逛 >'}</View>
        </View>
          : <View>
            <View className='Live-info-content-time-title'>开播倒计时</View>
            {timer ? <View className='Live-info-content-time-box'>
              <Text className='big'>{timer.h <= 9 ? `0${timer.h || 0}` : timer.h}</Text>
              <Text className='small'>时</Text>
              <Text className='big'>{timer.m <= 9 ? `0${timer.m || 0}` : timer.m}</Text>
              <Text className='small'>分</Text>
              <Text className='big'>{timer.s <= 9 ? `0${timer.s || 0}` : timer.s}</Text>
              <Text className='small'>秒</Text>
            </View>
              : <View className='Live-info-content-time-box'>
                <Text>主播即将开播</Text>
              </View>}
            <View className='Live-info-content-time-btnBox'>
              <View className='Live-info-content-time-btnBox-leftBtn' onClick={goMerchant}>进店逛逛</View>
              <View className='Live-info-content-time-btnBox-rightBtn' onClick={() => { openShare() }} >分享主播</View>
            </View>
          </View>}
      </View>
    </View>
  )
}

export default LiveInfo
