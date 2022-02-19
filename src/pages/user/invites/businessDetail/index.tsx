

import { View, Text } from "@tarojs/components"

import './index.scss'
function BusinessDetail(){
  return (
   <>
    <View className='businessDetail-list-item'>
      <View className='businessDetail-list-item-content'>
        <View className='businessDetail-list-item-content-img'>
          <img className='businessDetail-list-item-content-img-imgEle' src='https://picsum.photos/id/447/40/40' alt='' />
        </View>
        <View className='businessDetail-list-item-content-info'>
          <View className='businessDetail-list-item-content-info-name'>用户名称用户名称用户名称</View>
          <View className='businessDetail-list-item-content-info-date'>2021-06-14 23:44:66</View>
        </View>
      </View>
      <View className='businessDetail-list-item-result'>
        <View className='businessDetail-list-item-result-item'>
          <Text className='businessDetail-list-item-result-item-number'>1212</Text>
          <View>购买单数</View>

        </View>
        <View className='businessDetail-list-item-result-item'>
          <Text className='businessDetail-list-item-result-item-number'>￥11211</Text>
          <View>贡献收益</View>
        </View>
      </View>
    </View>
    <View className='businessDetail-income-tit'>收益记录</View>
    <View className='businessDetail-list-item-goodsInfo'>
      <View className='businessDetail-list-item-goodsInfo-imgWrapper'>
        <View className='businessDetail-list-item-goodsInfo-imgWrapper-img'>
          <img className='businessDetail-list-item-goodsInfo-imgWrapper-img-imgEle' src='https://picsum.photos/id/736/90/90' alt='' />
        </View>
      </View>
      <View className='businessDetail-list-item-goodsInfo-detail'>
        <View className='businessDetail-list-item-goodsInfo-detail-title'>这里是商品名称这里是商品名称这里是商品名称这里是商品名称这里是商品名称这里是商品名称</View>
        <View className='businessDetail-list-item-goodsInfo-detail-date'>2021-09-09 20:33:33</View>
        <View className='businessDetail-list-item-goodsInfo-detail-moneyInfo'>
          <View className='businessDetail-list-item-goodsInfo-detail-moneyInfo-money'>
            <Text className='businessDetail-list-item-goodsInfo-detail-moneyInfo-money-price'>￥900 </Text>
            <Text className='businessDetail-list-item-goodsInfo-detail-moneyInfo-money-profit'>赚￥9.9</Text>
          </View>
          <View className='businessDetail-list-item-goodsInfo-detail-moneyInfo-num'>X2</View>
        </View>
      </View>
    </View>
       
    </>


  )
}

export default BusinessDetail