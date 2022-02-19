
import {View, Text, ScrollView} from '@tarojs/components'
import {useState, useCallback, useMemo,useEffect } from 'react'
import Tabs from '@/components/Tabs'
import {useRequest} from 'ahooks'
import { empty } from '@/constants/images'
import Empty from '@/components/Empty'
import {GOODS_COMMISSION_STATUS} from "@/constants";
import api3752, {IResapi3752, IReqapi3752} from '@/apis/21/api3752'

import { IReqapi3746 } from '@/apis/21/api3746'
const opts = Object.keys(GOODS_COMMISSION_STATUS).map(key => GOODS_COMMISSION_STATUS[key])
import dayjs from 'dayjs'
import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, {  formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
import './index.scss'

export type Idata = Required<IResapi3752>['data']

const Item = (props)=> {
  const  {item, currentStatus} = props  
  const getText = useCallback((status)=>{
    if(status === 2 || status === 1){
      return '预计7天后到账'
    }
    if(status === 3 || status === 4){
      return '已完成'
    }
    if(status === 5 || status === 6){
      return '已退款'
    }
    
  }, [currentStatus])
  return <View className='GoodsCommission-list-item'>
  <View className='GoodsCommission-list-item-user'>
    <View className='GoodsCommission-list-item-user-info'>
      <View className='GoodsCommission-list-item-user-info-head'>
        <View className='GoodsCommission-list-item-user-info-head-img'><img className='GoodsCommission-list-item-user-info-head-img-imgEle' src={item?.userIcon} alt='' /></View>
        <Text className='GoodsCommission-list-item-user-info-head-nick'>{item.userName}</Text>
      </View>
      {/*TODO: 根据tabs 不同 显示不同的内容 预计到账时间 或者已到账 */}
      <View className='GoodsCommission-list-item-user-account'>
        {getText(item?.status)}
      </View>
    </View>
  </View>
  <View className='GoodsCommission-list-item-goodsInfo'>
    <View className='GoodsCommission-list-item-goodsInfo-imgWrapper'>
      <View className='GoodsCommission-list-item-goodsInfo-imgWrapper-img'>
        <img className='GoodsCommission-list-item-goodsInfo-imgWrapper-img-imgEle' src={item?.productIcon} alt='' />
      </View>
    </View>
    <View className='GoodsCommission-list-item-goodsInfo-detail'>
      <View className='GoodsCommission-list-item-goodsInfo-detail-title'>{item.productName}</View>
      <View className='GoodsCommission-list-item-goodsInfo-detail-date'>{dayjs(item?.paymentTime).format('YYYY-MM-DD HH:mm:ss')}</View>
      <View className='GoodsCommission-list-item-goodsInfo-detail-moneyInfo'>
        <View className='GoodsCommission-list-item-goodsInfo-detail-moneyInfo-money'>
          <Text className='GoodsCommission-list-item-goodsInfo-detail-moneyInfo-money-price m-r-16'>￥{compose(formatMoeny, fen2yuan)(item.productPrice)}</Text>
          <Text className='GoodsCommission-list-item-goodsInfo-detail-moneyInfo-money-profit'>赚￥{compose(formatMoeny, fen2yuan)(item.commissionAmount)}</Text>
        </View>
        <View className='GoodsCommission-list-item-goodsInfo-detail-moneyInfo-num'>X{item.productQuantity}</View>
      </View>
    </View>
  </View>
</View>
}

function GoodsCommission() {  
  const [currentStatus, setCurrentStatus] = useState(GOODS_COMMISSION_STATUS.all.value)
  // const [info, setInfo] = useState<Idata>()

  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {    
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 10
    const res = await api3752({
      type: currentStatus,
      pageNo,
      pageSize
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  },[currentStatus])
  const { data, loadMore, loading,reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [currentStatus],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  // loadingDelay: 500,
})
const listStatus = useListStatus({
  list: data?.list,
  loading,
  noMore
})

const getText = useCallback((status)=>{
  if(status === 2 || status === 1){
    return '预计7天后到账'
  }
  if(status === 3 || status === 4){
    return '已完成'
  }
  if(status === 5 || status === 6){
    return '已退款'
  }
  
}, [currentStatus])


const Row = useCallback(({data, index}) => <Item item={data[index]} currentStatus={currentStatus}  />, [data])
  return(
   <View className='GoodsCommission full-screen-page '>
     <View className='GoodsCommission-tabs'>
        <Tabs options={opts} composition={1} value={currentStatus} onChange={setCurrentStatus} />
     </View>
       <VirtualScrollList 
        loadMore={loadMore}
        subHeight = {getRealSize(88)}
        itemSize ={getRealSize(354)}
        row={Row}
        data={data}
        listStatus={{
          noMore,
          loading: loading || loadingMore,
        }}
        emptyProps={{text: '暂无数据'}}
      >
      </VirtualScrollList>

   </View>
  )
}

export default GoodsCommission
