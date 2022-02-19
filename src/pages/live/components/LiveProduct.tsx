import api4578 from '@/apis/21/api4578'
import { addWaterMarker, XImage } from '@/components/PreImage'
import { fen2yuan } from '@/utils/base'
import { useAsync } from '@/utils/hooks'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'

import './index.scss'
// import './CommodityStick/index.scss'

const LiveProduct = (props: {
  commodity: any
  time: {
    m: any
    s: any
    ms: any
    isMs: boolean
  }
  joinBidding: Function
  buying: Function;
  roomId: string;
  recordId: string;
  className: string;
}) => {
  const { commodity, time, joinBidding, buying } = props
  const rootClass = classNames(
    'Live-commodity',
    props.className
  )

  const getMyBidding = async () => {
    if (time) {
      const result = await api4578({
        productId: commodity.uuid,
        auctionPrice: commodity?.aucInfo?.lastAucPrice + commodity?.aucInfo?.markUp,
        roomId: props.roomId,
        recordId: props.recordId,
      })
      joinBidding(result?.lastAucPrice)
    }
  }

  const { run: bidding, pending } = useAsync(getMyBidding, { manual: true })


  const buy = () => {
    console.log('买东西');
    Taro.navigateTo({
      url: `/pages/order/genOrder/index?productType=${commodity?.productType}&productId=${commodity?.uuid}&productQuantity=${1}`
    })
    buying()
  }

  return (
    <View className={rootClass}>
      <View className='Live-commodityStick'>
        <View className='Live-commodityStick-content'>
          <View className='Live-commodityStick-content-box'>
            <XImage disabledPlaceholder src={commodity.icon} className='Live-commodityStick-content-img' onClick={() => {
              commodity.icon !== 'undefined' && commodity.icon && Taro.previewImage({
                current: addWaterMarker(commodity.icon), // 当前显示图片的http链接
                urls: [commodity.icon].map(addWaterMarker)
              })
            }}></XImage>
            <View className='Live-commodityStick-content-info'>
              <View className='Live-commodityStick-content-info-title'>
                {commodity.productType === 1 && <Text className='Live-commodityStick-content-info-title-tips'>{commodity?.aucInfo?.delayState === 1 ? '延时拍' : '无延时'}</Text>}
                <Text className='Live-commodityStick-content-info-title-rn'>{commodity.name}</Text>
              </View>
              {/* <View className='Live-commodityStick-content-info-title'>{commodity.name}</View> */}
              <View className='Live-commodityStick-content-info-kc'>{commodity.productType === 1 ? <Text style={{ visibility: 'hidden' }}>拍卖</Text> : `库存 ${commodity.stock}`}</View>
              <View className='Live-commodityStick-content-info-price'>{commodity.productType === 1 ? `¥${fen2yuan(commodity?.aucInfo?.lastAucPrice)}` : `¥${fen2yuan(commodity.price)}`} </View>
            </View>
            {commodity.productType === 1 ? <View onClick={bidding} className={time ? pending ? 'Live-commodityStick-content-pmBtn Live-commodityStick-content-disabled' : 'Live-commodityStick-content-pmBtn' : 'Live-commodityStick-content-pmBtn Live-commodityStick-content-disabled'}>
              {!time ? <View className='Live-commodityStick-content-pmBtn-jp'>截拍中</View> :
                <View>
                  <View className='Live-commodityStick-content-pmBtn-des'>加一手</View>
                  <View className='Live-commodityStick-content-pmBtn-price'>+{fen2yuan(commodity?.aucInfo?.markUp)}</View>
                </View>}
            </View> : <View className='Live-commodityStick-content-btn' onClick={buy}>购买</View>}
          </View>
          {time && commodity.productType === 1 && <View className='Live-commodityStick-content-time'>
            <View className='Live-commodityStick-content-time-title'>截止时间</View>
            {!time.isMs ? <View className='Live-commodityStick-content-time-box'><View className='Live-commodityStick-content-time-big'>{time.m < 10 ? `0${time.m}` : time.m}:{time.s < 10 ? `0${time.s}` : time.s}</View></View> : <View className='Live-commodityStick-content-time-box'><View className='Live-commodityStick-content-time-big'>{time.s < 10 ? `0${time.s}` : time.s}</View><View className='Live-commodityStick-content-time-num'>秒{time.ms}</View></View>}
          </View>}
        </View>
      </View >
    </View>
  )
}

export default LiveProduct
