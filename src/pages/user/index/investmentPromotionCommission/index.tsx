
import {View, Text, ScrollView} from '@tarojs/components'
import ListItem from '@/components/ListItem'
import { useState, useCallback, useEffect , useMemo} from 'react'
import Empty from '@/components/Empty';

import { empty } from '@/constants/images';
import {useRequest} from 'ahooks'
import './index.scss'
import dayjs from 'dayjs';

import api3764, {IResapi3764} from '@/apis/21/api3764'
import api3758, {IResapi3758} from '@/apis/21/api3758'; // 直接邀请统计

import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
export type IStatistical = Required<IResapi3758>['data']

const Left = (item)=>{
  return <View className='investmentPromotionCommission-list-left'>
  <View className='investmentPromotionCommission-list-left-img'>
    <img className='investmentPromotionCommission-list-left-img-imgEle' src={item?.headImg} alt="" /></View>
  <View className='investmentPromotionCommission-list-left-user'>
  <View className='investmentPromotionCommission-list-left-user-text'>
   {item?.nickName}
  </View>
  <View className='investmentPromotionCommission-list-left-user-date'>{dayjs(item?.displayTime).format('YYYY-MM-DD')}</View>
  </View>
</View>
}


const Item = (props)=> {
  const {item} = props
  return <View className='investmentPromotionCommission-list'>
  <View className='investmentPromotionCommission-list-item'>
    <ListItem icon={null} left={Left(item)} right={<Text className='investmentPromotionCommission-list-item-right'>￥{compose(formatMoeny, fen2yuan)(item?.commissionAmount)}</Text>}></ListItem>
  </View>
</View>
}


function InvestmentPromotionCommission() {
  const [inviteStatistical, setInviteStatistical] = useState<IStatistical>()
  
  useEffect(()=>{
    (async()=>{
      const res = await api3758()
      setInviteStatistical(res)
    })()
  },[])


  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 10
  
    const res = await api3764({
      pageNo,
      pageSize
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [])
  
  const { data, loadMore, loading,reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  // loadingDelay: 500,
  })
  
  const listStatus = useListStatus({
  list: data?.list,
  loading,
  noMore
  })
  const Row = useCallback(({data, index}) => <Item item={data[index]}  />, [data])

  return(
    <View className='investmentPromotionCommission full-screen-page'>
      <View className='investmentPromotionCommission-overView'>
        <View className='investmentPromotionCommission-overView-desc'>
          <View className='investmentPromotionCommission-overView-desc-title'>招商佣金 (元)</View>
          <View className='investmentPromotionCommission-overView-desc-num'>{compose(formatMoeny, fen2yuan)(inviteStatistical?.commissionAmount)}</View>
        </View>
        <View className='investmentPromotionCommission-overView-zs'>招商 <Text className='investmentPromotionCommission-overView-desc-num'>{inviteStatistical?.directSubMerchantCount}</Text>人</View>
      </View>
      <VirtualScrollList 
        loadMore={loadMore}
        subHeight = {getRealSize(184)}
        itemSize ={getRealSize(144)}
        row={Row}
        data={data}
        listStatus={{
          noMore,
          loading: loading || loadingMore,
        }}
      >

      </VirtualScrollList>
    </View>
  )
}

export default InvestmentPromotionCommission
