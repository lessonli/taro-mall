import { XImage } from "@/components/PreImage"
import compose, { fen2yuan, formatMoeny } from "@/utils/base"
import { useCallback, useMemo } from "react"
import { View, Text, Image } from "@tarojs/components"
import Taro from "@tarojs/taro"
import Big from "big.js"

import { isAppWebview } from "@/constants"
import { IResapi4798 } from "@/apis/21/api4798"


type IItem = Required<Required<IResapi4798>['data']>['data'][0]
interface Iprops {
  data: IItem;
  toGoodsDetail:(uuid)=>void
  
}

const Item = (props:Iprops) => {

  const getPrice = useCallback((price) => {
    let priceYuan = fen2yuan(price)
    let big = new Big(priceYuan)

    if (priceYuan < 9999) {
      return compose(formatMoeny)(priceYuan)
    }
    return big.div(10000).toFixed(1) + 'w'
  }, [])
  const toStore = (merchantNo)=>{
    // Taro.navigateTo({ url: `/pages/store/index?merchantId=${props.data.shopInfo?.merchantNo}` })
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({
          page: '/merchant/home',
          params: { merchantId: merchantNo },
        })
      )
    } else {

      Taro.navigateTo({ url: `/pages/store/index?merchantId=${merchantNo}`, })
    }
  }
  const GoodsList = useMemo(()=>{
      // console.log(props.data.prods, 'props.data.prods');
      return props.data.prods?.slice(0,4)
  },[props.data.prods])

console.log(GoodsList, 'GoodsList');

  return <View className='selectGoodsShop-store-item'>
    <View className='selectGoodsShop-store-item-storeInfo'>
      <View className='selectGoodsShop-store-item-storeInfo-img'>
        <XImage className='selectGoodsShop-store-item-storeInfo-img-ele' src={props.data.shopInfo?.shopLogo}> </XImage>
      </View>
      <View className='selectGoodsShop-store-item-storeInfo-info'>
        <View className='selectGoodsShop-store-item-storeInfo-info-name'>{props.data.shopInfo?.shopName}</View>
        <View className='selectGoodsShop-store-item-storeInfo-info-store'>
          <Text>粉丝 {props.data.shopInfo?.fansNum}</Text>
          <Text className='m-l-32'>保证金 {compose(formatMoeny, fen2yuan)(props.data.shopInfo?.marginShopAmount)}</Text>
        </View>
      </View>
      <View className='selectGoodsShop-store-item-storeInfo-intoShop' onClick={()=>toStore(props?.data?.shopInfo?.merchantNo)}>
        进店逛逛
      </View>
    </View>
    <View className='selectGoodsShop-store-item-goodsInfo'>
      {
        props.data.prods?.map((item, index) => {
          return <View key={index} className='selectGoodsShop-store-item-goodsInfo-item'>
            <View className='selectGoodsShop-store-item-goodsInfo-item-img' onClick={()=>props.toGoodsDetail(item.uuid)}>
              <XImage className='selectGoodsShop-store-item-goodsInfo-item-img-ele' src={item.icon}></XImage>
            </View>
            <View className='selectGoodsShop-store-item-goodsInfo-item-price'>
              {
               item?.auction && <> 
               <Text className="selectGoodsShop-store-item-goodsInfo-item-price-icon fz24 myIcon">&#xe757;</Text>
               <Text className='selectGoodsShop-store-item-goodsInfo-item-price-price'>¥{getPrice(item?.auction?.lastAucPrice)}</Text>
               </>
              }
              {
                !item.auction &&  <Text className='selectGoodsShop-store-item-goodsInfo-item-price-price'>¥{getPrice(item?.price)}</Text>
              }
             
              {/* <Text className='selectGoodsShop-store-item-goodsInfo-item-price-originPrice'>¥{getPrice(item.originalPrice)}</Text> */}
            </View>
          </View>
        })
      }
    </View>

  </View>

} 

export default Item