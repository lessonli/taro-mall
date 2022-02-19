
import {View, Text, ScrollView} from '@tarojs/components'
import ListItem from '@/components/ListItem'
import { useMemo, useCallback, useEffect, useState } from 'react';
import api2476, {IResapi2476} from '@/apis/21/api2476';
import  compose, { formatMoeny, fen2yuan }  from '@/utils/base';
import './index.scss'
import Taro from "@tarojs/taro";

export type Iprop = Required<IResapi2476>['data']


function CumulativeEarnings() {
  const [info, setInfo] = useState<Iprop>()
  const toPage = (url) => {    
    if (!url) return
    Taro.navigateTo({
      url:url
    })
  }
  useEffect(()=>{
    (async()=>{
      const res = await api2476() 
      setInfo(res)
    })()
  },[])
  return(
    <View className='cumulativeEarnings'>
      <View className='cumulativeEarnings-amount'>
        <View className='cumulativeEarnings-amount-item'>
          <View className='cumulativeEarnings-amount-item-income'>累计收益 (元)</View>
          <Text className='cumulativeEarnings-amount-item-num'>{compose(formatMoeny, fen2yuan)(info?.commissionTotalAmount)}</Text>
        </View>
        <View className='cumulativeEarnings-amount-item'>
          <View className='cumulativeEarnings-amount-item-income'>待入账金额 (元)</View>
          <Text className='cumulativeEarnings-amount-item-num'>{compose(formatMoeny, fen2yuan)(info?.commissionFrozenAmount)}</Text>
        </View>

      </View>
      <ScrollView>
        <View className='cumulativeEarnings-list'>
          <ListItem handleClick={()=> toPage('/pages/user/index/goodsCommission/index')}
            left={
            <View className='cumulativeEarnings-list-item'>
              <View className='cumulativeEarnings-list-item-text'>商品佣金</View>
              <Text className='cumulativeEarnings-list-item-tip'>包括自购/分销非本人商品获得的佣金</Text>
            </View>
          }
          />
          <ListItem 
            handleClick={()=>{toPage('/pages/user/index/investmentPromotionCommission/index')}}
            left={
              <View className='cumulativeEarnings-list-item'>
                <View className='cumulativeEarnings-list-item-text'>招商佣金</View>
                <Text className='cumulativeEarnings-list-item-tip'>通过直接招募商家的佣金</Text>
              </View>
            }
          />
          <ListItem left={
            <View className='cumulativeEarnings-list-item'>
              <View className='cumulativeEarnings-list-item-text'>团队奖励</View>
              <Text className='cumulativeEarnings-list-item-tip'>包括团队整体销售和招商等奖励佣金</Text>
            </View>
          } icon={null}
          />

        </View>
      </ScrollView>
    </View>
  )
}

export default CumulativeEarnings
