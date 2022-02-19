

import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Tabs from '@/components/Tabs'
import ListItem from '@/components/ListItem'
import { MERCHANT_LEVEL } from '@/constants'
import Empty from '@/components/Empty';

import { empty } from '@/constants/images';
import { INVITE_STATUS } from '@/constants'
import { useRequest } from 'ahooks'
import api2452, { IResapi2452 } from '@/apis/21/api2452'
import api2444, { IResapi2444 } from '@/apis/21/api2444'
import api3776, { IResapi3776, IReqapi3776 } from '@/apis/21/api3776'
import { IReqapi3806 } from '@/apis/21/api3806'
import NavigationBar from '@/components/NavigationBar'

import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
import dayjs from 'dayjs'
import Taro from '@tarojs/taro'
import './index.scss'

const opts = Object.keys(INVITE_STATUS).map(key => INVITE_STATUS[key])

export type ImerchantStatus = Required<IResapi2452>['data']
export type ImerchantInfo = Required<IResapi2444>['data']


const Item = (props) => {
  const { item, currentValue } = props

  return <View className='Invite-border-bottom'>
    <View className='Invite-list-item'>
      <View className='Invite-list-item-userInfo'>
        <View className='Invite-list-item-userInfo-content'>
          <View className='Invite-list-item-userInfo-content-img'>
            <img className='Invite-list-item-userInfo-content-img-imgEle' src={item.headImg}></img>
          </View>
          <View className='Invite-list-item-userInfo-content-text'>
            <View className='Invite-list-item-userInfo-content-text-tit'>{item.nickName}</View>
             <View className='Invite-list-item-userInfo-content-text-date'>{dayjs(item.displayTime).format('YYYY-MM-DD')}  {dayjs(item.displayTime).format('HH:mm:ss')}</View>
          </View>
        </View>
      </View>

      <View className='Invite-list-item-ability'>
        {currentValue === 3 && <View>自购/分销<Text className='Invite-list-item-ability'>{item.directDistributionOrderCount}</Text>单</View>}
        {currentValue === 2 && <View>已购<Text className='Invite-list-item-ability'>{item.directDistributionOrderCount}</Text>单</View>}

      </View>
    </View>
    {currentValue === 1 && <View className='invite-recent-time'>最近访问时间：
      <Text className='m-r-8'>{dayjs(item.lastLoginTime).format('YYYY-MM-DD')}</Text>
      <Text>{dayjs(item.lastLoginTime).format('HH:mm:ss')}</Text>
    </View>}
  </View>
}


function Invite() {
  const [currentValue, setCurrentValue] = useState(INVITE_STATUS.business.value)
  const [merchantStatus, setMerchantStatus] = useState<ImerchantStatus>()
  const [merchantInfo, setMerchantInfo] = useState<ImerchantInfo>()
  const [total, setTotal] = useState<number>()
  const copy = useCallback((str) => {
    Taro.setClipboardData({
      data: str,
      success: () => {
        Taro.showToast({
          icon: 'none',
          title: '复制成功',
          duration: 400
        })
      }
    })
  }, [])

  useEffect(() => {
    (async () => {
      const status = await api2452()
      const info = await api2444()
      setMerchantInfo(info)
      setMerchantStatus(status)
    })()
  }, [])


  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    const res = await api3776({
      pageNo,
      pageSize,
      type: currentValue
    })
    setTotal(res?.total)
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
    // debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })

  const toLevel = () => {
    Taro.navigateTo({
      url: '/pages/user/invites/Level/index'
    })

  }

  const Row = useCallback(({ data, index }) => <Item item={data[index]} currentValue={currentValue} />, [data])
  return (
    <>
      <View className='Invite full-screen-page'>
        <View className='Invite-bg'>
          <Text className='Invite-bg-code'>我的邀请码: {merchantInfo?.channelNo}</Text>
          {/* <Text className='Invite-bg-copy copy-btn' onClick={() => copy(merchantStatus?.merchantNo)}>复制</Text> */}
          <View className='Invite-bg-tip'>
            被邀请好友填写你的邀请码即可邀请成功
          </View>
          <View className='Invite-bg-tip'>
            {merchantStatus?.merchantLevel === 1 && <View onClick={() => toLevel(merchantStatus?.merchantLevel)} className='Invite-bg-tip-text'><Text>升级钻石商家</Text> <Text className='myIcon'>&#xe726;</Text></View>}
            {merchantStatus?.merchantLevel === 2 && <View onClick={() => toLevel(merchantStatus?.merchantLevel)} className='Invite-bg-tip-text'><Text>升级服务商</Text> <Text className='myIcon'>&#xe726;</Text></View>}
          </View>
        </View>

        <View>
          <Tabs options={opts} value={currentValue} onChange={setCurrentValue}></Tabs>
        </View>
        <View className='Invite-tit'>
          <View className='Invite-tit-desc'>
            {currentValue === 3 && '邀请商家数 '}
            {currentValue === 2 && '专属粉丝数'}
            {currentValue === 1 && '普通粉丝数'}
            <Text className='Invite-tit-desc-num'>{total}</Text>人
          </View>
        </View>
        <View className='Invite-list'>
          <VirtualScrollList
            loadMore={loadMore}
            subHeight={getRealSize(473)}
            itemSize={getRealSize(currentValue !== 1 ? 125 : 211)}
            row={Row}
            data={data}
            listStatus={{
              noMore,
              loading: loading || loadingMore,
            }}
            emptyProps={{text:'暂无数据'}}
          >
          </VirtualScrollList>
        </View>
      </View>
    </>
  )
}

export default Invite