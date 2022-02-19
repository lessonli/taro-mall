import api4628 from '@/apis/21/api4628'
import BwModal from '@/components/Modal'
import { navigationBarInfo } from '@/components/NavigationBar'
import { XImage } from '@/components/PreImage'
import { cj, fk, leftCloud, rightCloud, zp } from '@/constants/images'
import { Iprop } from '@/pages/bwSchool/list/components/SchoolItem'
import { liveModal } from '@/store/atoms'
import { getRealSize } from '@/utils/base'
import { session } from '@/utils/storge'
import { View, Image, Text, CoverView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import qs from 'query-string'
import './index.scss'
interface Iprops {
  // liveModalInfo: {
  //   type: string | number,
  //   payload: {}
  // },
  close: Function
}


const LiveModal = (props: Iprops) => {
  const { close } = props
  const [liveModalInfo, setLiveModalInfo] = useRecoilState<{ type: string | number, payload: {} }>(liveModal)
  const [showPay, setShowPay] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showImg, setShowImg] = useState<boolean>(false)
  const [buyInfo, setBuyInfo] = useState<any>()
  useDidShow(async () => {
    const showPay = await api4628()
    setShowPay(showPay > 0)
  })

  // useEffect(() => {
  //   (async () => {
  //     const showPay = await api4628()
  //     setShowPay(showPay > 0)
  //   })()
  // }, [])

  const pay = () => {
    session.setItem('userCurrentPosition', 'buyer')
    Taro.navigateTo({
      url: `/pages/order/list/index?status=0&userCurrentPosition=buyer`
    })
  }
  const closeModal = async () => {
    const showPay = await api4628()
    setShowPay(showPay > 0)
    setShowModal(false)
    close()
  }

  const onConfirm = () => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${buyInfo?.orderNo}`
    })
    setLiveModalInfo(item => { return { type: 'obligation', payload: item.payload } })
    setShowModal(false)
    setBuyInfo(null)
  }
  useEffect(() => {
    if (liveModalInfo.type === 'mine' || liveModalInfo.type === 'sendOrder') {
      setBuyInfo(liveModalInfo.payload)
      if (liveModalInfo.type === 'mine') {
        setShowImg(true)
      } else if (liveModalInfo.type === 'sendOrder') {
        setShowImg(false)
      }
      setShowModal(true)
    }
  }, [liveModalInfo.type])
  return (
    <View className='rootClass'>

      {/* 中拍 */}

      {liveModalInfo.type === 'others' && <View className='Live-success'>
        <View className='Live-success-content'>
          <View className='Live-success-header'>
            <XImage className='Live-success-header-img' src={qs.stringifyUrl({ url: liveModalInfo.payload.headImg, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 200) * 2)},m_lfit` } })}></XImage>
          </View>
          <View className='Live-success-name'>
            {liveModalInfo.payload.name}
          </View>
          <View className='Live-success-price'>
            <Text className='Live-success-price-dw'>¥</Text>
            <Text className='Live-success-price-num'>{liveModalInfo.payload.price}</Text>
          </View>
        </View>
        <Image className='Live-success-zp' src={zp}></Image>
      </View>}

      {liveModalInfo.type === 1006 && <View className='Live-pay'>
        <View className='Live-pay-content'>
          <View className='Live-pay-content-head'>
            <XImage src={qs.stringifyUrl({ url: liveModalInfo.payload.headImg, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 160) * 2)},m_lfit` } })} className='Live-pay-content-head-img'></XImage>
          </View>
          <View className='Live-pay-content-name'>{liveModalInfo.payload.name}</View>
        </View>
        <Image className='Live-pay-zp' src={fk}></Image>
      </View>}

      {/* 竞拍 */}

      {liveModalInfo.type === 1003 && <View className='Live-offer'>
        {/* <View></View> */}
        <View className='Live-offer-head'>
          <XImage src={qs.stringifyUrl({ url: liveModalInfo.payload.headImg, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 180) * 2)},m_lfit` } })} className='Live-offer-head-img'></XImage>
        </View>
        <View className='Live-offer-content'>
          <View className='Live-offer-content-name'>
            <Image className='Live-offer-content-name-left' src={leftCloud}></Image>
            <Text className='lineCamp2'>{liveModalInfo.payload.name}</Text>
            <Text> 出价</Text>
            <Image className='Live-offer-content-name-right' src={rightCloud}></Image>
          </View>
          <View className='Live-offer-content-price'>
            <Text className='Live-offer-content-price-dw'>¥</Text>
            <Text className='Live-offer-content-price-num'>{liveModalInfo.payload.price}</Text>
          </View>
        </View>
        <Image className='Live-offer-zp' src={cj}></Image>
      </View>}
      <BwModal onConfirm={onConfirm} visible={showModal} type='confirm' onClose={closeModal} title={!showImg ? '主播向您发送了商品' : ''} confirmText='立即支付' showImg={showImg} content={<View className='payCommodity'>
        <XImage src={buyInfo?.icon} className='payCommodity-img'></XImage>
        <View className='payCommodity-info'>
          <View className='payCommodity-info-title'>{buyInfo?.productName}</View>
          <View className='payCommodity-info-price'>¥{buyInfo?.price}</View>
        </View>
      </View>} ></BwModal>
      {showPay && <View className='live-pay' onClick={pay}>待付款</View>}
    </View>
  )
}

export default LiveModal
