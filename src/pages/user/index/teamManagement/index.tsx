
import { View, Text, ScrollView } from '@tarojs/components'
import NavigationBar from "@/components/NavigationBar";
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import api3824, { IResapi3824 } from '@/apis/21/api3824'; //  当前分销团队列表 
import api3830, { IResapi3830 } from '@/apis/21/api3830'; // 商家培养团队列表
import api2444, { IResapi2444 } from '@/apis/21/api2444'; // 商户信息
import api3788, { IResapi3788 } from '@/apis/21/api3788';

import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";

import Taro from "@tarojs/taro";
import './index.scss'
import dayjs from 'dayjs';
import Empty from '@/components/Empty';

import { empty } from '@/constants/images';

export type Idata = Required<IResapi3824>['data']
export type ImerchantInfo = Required<IResapi2444>['data']
export type Istatistics = Required<IResapi3788>['data']

const Item = (props) => {


  const { item } = props
  const toPage = (url) => {
    if (!url) return
    Taro.navigateTo({
      url: url
    })
  }

  return <View className='p-l-24 p-r-24'>
    <View className='teamManagement-invite-list-item' onClick={() => toPage(`/pages/user/index/businessDetail/index?merchantNo=${item?.merchantNo}`)}>
      <View className='teamManagement-invite-list-item-content'>
        <View className='teamManagement-invite-list-item-content-img'>
          <img className='teamManagement-invite-list-item-content-img-imgEle' src={item.headImg} alt='' />
        </View>
        <View className='teamManagement-invite-list-item-content-info'>
          <View className='teamManagement-invite-list-item-content-info-name'>{item?.nickName}</View>
          <View className='teamManagement-invite-list-item-content-info-date'> {dayjs(item?.displayTime).format('YYYY-MM-DD HH:mm:ss')}</View>
        </View>
      </View>
      <View className='teamManagement-invite-list-item-result'>
        <View className='teamManagement-invite-list-item-result-item'>
          <Text>专属粉丝:</Text>
          <Text className='teamManagement-invite-list-item-result-item-number'> {item?.privateFansCount}</Text>
        </View>

        <View className='teamManagement-invite-list-item-result-item'>
          <Text>邀请商家:</Text>
          <Text className='teamManagement-invite-list-item-result-item-number'>{item?.directSubMerchantCount}</Text>
        </View>
      </View>
    </View>
  </View>
}

function TeamManagement() {
  const [merchantInfo, setMerchantInfo] = useState<ImerchantInfo>()
  const [statistics, setStatistics] = useState<Istatistics>()
  const [visible, setVisible] = useBoolean(false)
  // const [data, setData] = useState<Idata>()
  const [team, setTeam] = useState({
    isTrain: false, // 我的团队 false  培养团队 true
    sortType: true // true  按商家排序 false 按 专属粉丝排序
  })


  const toCopy = (str) => {
    Taro.setClipboardData({
      data: str,
      success: () => {
        Taro.showToast({
          icon: 'none',
          title: '复制成功'
        })
      }
    })
  }
  useEffect(() => {
    (async () => {
      const res = await api2444()
      setMerchantInfo(res)

      const statisticsRes = await api3788()

      setStatistics(statisticsRes)
    })()
  }, [])
  const handleSortType = (status, e) => {
    setVisible.toggle()
    setTeam({ ...team, sortType: status })
    e.stopPropagation()
  }
  const handleTrain = (status, e) => {
    setTeam({ ...team, isTrain: status })
    e.stopPropagation()
  }

  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 8
    const fn = team.isTrain ? api3830 : api3824
    const res = await fn({
      pageNo,
      pageSize,
      orderItems: {
        asc: false,
        column: team.sortType ? 'directSubMerchantCount' : 'privateFansCount'   // 排序方式
      }
    })
    return {
      list: res.data || res,
      total: res?.total || 0,
      pageNo,
      pageSize,
    }
  }, [team])
  const { data, loadMore, loading, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [team],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })
  const Row = useCallback(({ data, index }) => <Item item={data[index]} />, [data])
  return (
    <View className='teamManagement-wrapper full-screen-page'>
      <View className='teamManagement-wrapper-header'>
        {/* <NavigationBar  /> */}
        <View className='teamManagement-invite'>
          <View className='teamManagement-invite-code'>
            <Text>我的邀请码: {merchantInfo?.channelNo}</Text>
            <Text onClick={() => toCopy(merchantInfo?.channelNo)} className='teamManagement-invite-copy'>复制</Text>
          </View>
          <View className='teamManagement-invite-tip'>
            分享开店链接邀请开店，即可加入你的团队
          </View>
        </View>
      </View>
      <View className='teamManagement-tabs-wrapper'>

        <View className={`teamManagement-tabs-item ${team.isTrain ? '' : 'teamManagement-tabs-item-active'} `} onClick={(e) => { handleTrain(false, e) }}>
          <View className='teamManagement-tabs-item-content'>
            <View className='teamManagement-tabs-item-count'>{statistics?.teamCont}</View>
            <View className='teamManagement-tabs-item-text'>我的团队</View>
          </View>
        </View>

        <View className={`teamManagement-tabs-item ${team.isTrain ? 'teamManagement-tabs-item-active' : ''} `} onClick={(e) => { handleTrain(true, e) }}>
          <View>
            <View className='teamManagement-tabs-item-count'>{statistics?.transTeamCount}</View>
            <View className='teamManagement-tabs-item-text'>培养团队</View>
          </View>
        </View>
      </View>
      {/* <View className={`teamManagement-invite-list`}> */}
      <View className='p-l-24 p-r-24'>
         <View className={`teamManagement-invite-list-title`}>
          <View>邀请列表</View>
          <View className='teamManagement-invite-list-title-sort' onClick={() => setVisible.toggle()}>{team.sortType ? '按邀请商家排序' : '按专属粉丝排序'}
            <View className={`teamManagement-invite-list-title-sortType  ${visible ? 'bwBlock' : 'bwHide'} `}>
              <View className='teamManagement-invite-list-title-sortType-item' onClick={(e) => handleSortType(false, e)} style={{ color: team.sortType ? '' : '#AA1612' }} >按专属粉丝排序</View>
              <View className='teamManagement-invite-list-title-sortType-item' onClick={(e) => handleSortType(true, e)} style={{ color: team.sortType ? '#AA1612' : '' }}>按商家排序</View>
              <View className='teamManagement-invite-list-title-sortType-trangle'></View>
            </View>
            <Text className='myIcon'>&#xe726;</Text></View>
        </View>
      </View>
       

      <VirtualScrollList
        loadMore={loadMore}
        subHeight={getRealSize(510)}
        itemSize={getRealSize(208)}
        row={Row}
        data={data}
        listStatus={{
          noMore,
          loading: loading || loadingMore,
        }}
        emptyProps={{ text: '暂无数据' }}
      >

      </VirtualScrollList>

      {/* </View> */}
    </View>
  )

}

export default TeamManagement
