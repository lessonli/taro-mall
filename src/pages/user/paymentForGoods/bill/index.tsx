import { View, Text, ScrollView } from "@tarojs/components"

import Tabs from "@/components/Tabs"
import ListItem from "@/components/ListItem"
import { BILL_STATUS } from "@/constants"
import NavigationBar from "@/components/NavigationBar"
import { useEffect, useState, useCallback, useMemo } from "react"
import Taro from "@tarojs/taro"
import Empty from '@/components/Empty';

import { empty } from '@/constants/images';
import { useRequest } from "ahooks"
import api3818, { IReqapi3818 } from "@/apis/21/api3818" // 佣金账单
import api3812, { IResapi3812 } from "@/apis/21/api3812" // 货款账单

import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
import './index.scss'

import dayjs from "dayjs"


export type Idata = Required<IResapi3812>['data']

const Item = (props)=>{
  const {item, currentValue, isCommission} = props
  const getText = useCallback((status) => {
    if (currentValue === 1) {
      if (status === 1) {
        return <View>待入账</View>
      }
      if (status === 2) {
        return <View>已入账</View>
      }
    }
    if (currentValue === 2) {
      if (status === 1) {
        return <View>提现中</View>
      }
      if (status === 2 && item.merchantBillType!== 4) { 
        return <View>已提现</View>
      }
      if (status === 2 && item.merchantBillType === 4) { 
        return <View>已完成</View>
      }
    }
    if (currentValue === 3) {
      return <View>已退款</View>
    }

  }, [currentValue])
  const toDetail = (item) => {
    if (isCommission === '2' && currentValue !== 2) {
    //  actualAmount 收入金额   tradeAmount 交易金额   commissionAmount 分销金额  手续费 serviceFee serviceFeeRate  commissionAmount 分销金额 commissionRate 佣金率
      Taro.navigateTo({
        url: `/pages/user/paymentForGoods/detail/index?actualAmount=${item.actualAmount}&tradeAmount=${item.tradeAmount}&commissionAmount=${item.commissionAmount}&serviceFee=${item.serviceFee}&serviceFeeRate=${item.serviceFeeRate}&orderNo=${item.orderNo}&gmtCreate=${item.gmtCreate}&billStatus=${item.billStatus}&userPayAmount=${item.userPayAmount}&commissionRate=${item.commissionRate}&currentValue=${currentValue}`
      })
    }

  }
  return (
    <ListItem  icon={null} left={
      <View className='bill-list-left'>
        {(isCommission === '2') && (currentValue === 1 || currentValue === 3) && <View className='bill-list-left-tit'>{item.title}-{item.orderNo}</View>}
        {(isCommission === '2') && (currentValue === 2) && <View className='bill-list-left-tit'>{item.title}</View>}
        {isCommission === '1' && <View className='bill-list-left-tit'>{item.title}</View>}
        <View className='bill-list-left-date'>{dayjs(item.gmtCreate).format('YYYY-MM-DD')} {dayjs(item.gmtCreate).format('HH:mm:ss')}</View>
      </View>
    }
      right={
      isCommission === '1' ? 
        <View className='bill-list-right bill-list-income'>
          {/* {item?.amountSign === 1 && <View className='fz32'>+{item?.commissionAmount}</View>}
          {item?.amountSign === (-1) && <View className='fz32'>+{item?.commissionAmount}</View>} */}
          {item.billStatus === 1 && <View style={{ color: '#333333' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.tradeAmount)}</View>}
          {item.billStatus === 2 && <View style={{ color: '#AA1612' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.tradeAmount)}</View>}
          {item.billStatus === 3 && <View style={{ color: '#999999' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.tradeAmount)}</View>}
          <View className='fz24'>{getText(item.billStatus)}</View>

        </View>
        :<View className='bill-list-right bill-list-income'>
        {/* {item?.amountSign === 1 && <View className='fz32'>+{item?.commissionAmount}</View>}
        {item?.amountSign === (-1) && <View className='fz32'>+{item?.commissionAmount}</View>} */}
        {item.billStatus === 1 && <View style={{ color: '#333333' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.actualAmount)}</View>}
        {item.billStatus === 2 && <View style={{ color: '#AA1612' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.actualAmount)}</View>}
        {item.billStatus === 3 && <View style={{ color: '#999999' }}  >{item?.amountSign === 1 ? '+' : '-'} {compose(formatMoeny, fen2yuan)(item?.actualAmount)}</View>}
        <View className='fz24'>{getText(item.billStatus)}</View>

      </View>
      } 
      handleClick={() => toDetail(item)}  />
  )
}

function Bill() {
  const opts = Object.keys(BILL_STATUS).map(key => BILL_STATUS[key])
  const isCommission = Taro.getCurrentInstance().router?.params.iscommision
  const [currentValue, setCurrentValue] = useState(BILL_STATUS.out.value)
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    const fn = isCommission === '1' ? api3818 : api3812
    const res = await fn({
      type: currentValue,
      pageNo,
      pageSize
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [currentValue])
  const { data, loadMore, loading, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [currentValue],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })

  

  const Row = useCallback(({data, index}) => <Item item={data[index]} currentValue={currentValue} isCommission={isCommission}  />, [data])
  return (
    <View className='Bill'>
      {/* <NavigationBar></NavigationBar> */}
      <View className='Bill-tabs'>
        <Tabs options={opts} value={currentValue} onChange={setCurrentValue} ></Tabs>
      </View>
      <ScrollView className='bill-scrollView' scrollY onScrollToLower={loadMore}>
        <View className='bill-list'>
          <VirtualScrollList 
            loadMore={loadMore}
            subHeight = {getRealSize(86)}
            itemSize ={getRealSize(142)}
            row={Row}
            data={data}
            listStatus={{
              noMore,
              loading: loading || loadingMore,
            }}
            emptyProps={{
              text: '暂无数据'
            }}
          >
          </VirtualScrollList>

        </View>
      </ScrollView>


    </View>
  )
}

export default Bill