import { IResapi4488 } from '@/apis/21/api4488'
import api4578 from '@/apis/21/api4578'
import { addWaterMarker, XImage } from '@/components/PreImage'
import product from '@/pages/merchant/publish/product'
import { liveModal, receivedMessage, shoppingCarListInfo } from '@/store/atoms'
import { fen2yuan } from '@/utils/base'
import { View, Text, CoverView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { message } from 'taro-ui'
export type IProductInfo = Required<Required<IResapi4488>['data']>['data'][0]
import './index.scss'

interface Iprops {
  productInfo: IProductInfo
  endTime?: string
  buying: Function;
  roomId: string;
  recordId: string;
}
const LiveProductCard = (props: Iprops) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [liveModalInfo, setLiveModalInfo] = useRecoilState(liveModal)
  const { productInfo, endTime, buying } = props
  const [price, setPrice] = useState<number>(0)
  const bidding = async () => {
    const result = await api4578({
      productId: productInfo?.uuid,
      auctionPrice: productInfo?.auction?.lastAucPrice + productInfo?.auction?.markUp,
      roomId: props.roomId,
      recordId: props.recordId,
    })

    Taro.showToast({
      icon: 'none',
      title: `${productInfo.name}已出价`
    })
    // setLiveModalInfo(item => {
    //   return {
    //     type: 'offer',
    //     payload: {
    //       name: '啊拉锁',
    //       price: '1000'
    //     }
    //   }
    // })
  }

  const buy = () => {
    Taro.navigateTo({
      url: `/pages/order/genOrder/index?productType=${productInfo?.productType}&productId=${productInfo?.uuid}&productQuantity=${1}`
    })
    buying()
  }

  return (
    <View className='Live-commodityCard'>
      <View className='Live-commodityCard-content'>
        <View className='Live-commodityCard-content-imgBox'>
          <XImage src={productInfo?.icon} className='Live-commodityCard-content-img' onClick={() => {
            productInfo?.icon && Taro.previewImage({
              current: addWaterMarker(productInfo.icon), // 当前显示图片的http链接
              urls: [productInfo.icon].map(addWaterMarker)
            })
          }}></XImage>
          {productInfo.productType === 1 && <View className='Live-commodityCard-content-time'>{endTime || '已截拍'}</View>}
        </View>
        <View className='Live-commodityCard-content-info'>
          <View className='Live-commodityCard-content-info-title'>
            {productInfo.productType === 1 && <Text className='Live-commodityCard-content-info-title-tips'>{productInfo?.auction?.delayState === 1 ? '延时拍' : '无延时'}</Text>}
            <Text className='Live-commodityCard-content-info-title-nr'>{productInfo.name}</Text>
          </View>
          <View className='Live-commodityCard-content-info-kc'>
            {productInfo.productType === 1 ? <Text>
              <Text>{fen2yuan(productInfo.auction?.initPrice)}元起</Text>
              <Text className='ml24'>加价{fen2yuan(productInfo.auction?.markUp)}</Text>
            </Text> : <Text>库存 {productInfo.stock}</Text>}
          </View>
          <View className='Live-commodityCard-content-info-price'><Text className='fz24'>¥</Text>{productInfo.productType === 1 ? fen2yuan(productInfo.auction?.lastAucPrice) : fen2yuan(productInfo.price)}</View>
        </View>
      </View>
      <View className='Live-commodityCard-bottom'>
        {productInfo.productType === 1 ? <View className='Live-commodityCard-bottom-buy' onClick={bidding}>加一手</View> :
          <View className='Live-commodityCard-bottom-buy' onClick={buy}>立即购买</View>}
      </View>
    </View>
  )
}

export default LiveProductCard
